import { NextRequest, NextResponse } from "next/server";
import { getUser, UserAuthPayload } from "./lib/auth";
import { host } from "./lib/constants";
import { BoardResponse } from "./pages/api/boards";

const PATTERNS = {
  401: "/401",
  register: "/register",
  write: "/:board/write",
  edit: "/:board/edit/:article",
  article: "/:board/:article",
};

const patterns = Object.entries(PATTERNS).map(([page, pathname]) => [
  page,
  new URLPattern({ pathname }),
]);

const params = (url: string) => {
  const input = url.split("?")[0];

  for (const [page, pattern] of patterns) {
    const patternResult = pattern.exec(input);
    if (patternResult !== null && "pathname" in patternResult) {
      return [page, patternResult.pathname.groups];
    }
  }

  return [];
};

export async function middleware(req: NextRequest) {
  const [page, groups] = params(req.url);

  if (!page) return NextResponse.next();

  if (page === "401") return checkUser(req);
  if (page === "register") return checkRegister(req);

  const boards: BoardResponse = await fetch(`${host}/api/boards/`).then((res) =>
    res.json()
  );
  const { board: boardId, article } = groups;

  if (!(boardId in boards)) return NextResponse.next();

  const board = boards[boardId];

  const token = req.cookies.get("access_token") as string;
  const user = await getUser(token);

  const articleId = parseInt(article);

  switch (page) {
    case "write": {
      if (!user) return errorPage(req, 401);

      return checkWritable({ req, user, board });
    }
    case "edit": {
      if (isNaN(articleId)) return errorPage(req, 404);
      if (!user) return errorPage(req, 401);

      return checkEditable({ req, user, boardId, articleId });
    }
    case "article": {
      if (isNaN(articleId)) return errorPage(req, 404);
      if (!user) return errorPage(req, 401);

      return checkReadable({ req, user, board, boardId, articleId });
    }
    default:
      break;
  }
}

const errorPage = (req: NextRequest, status: number) => {
  const url = req.nextUrl.clone();

  if (status === 401) {
    url.search = "";
    url.searchParams.set("url", url.pathname);
  }

  url.pathname = `/${status}`;

  return NextResponse.redirect(url);
};

const returnToHome = (req: NextRequest) => {
  const url = req.nextUrl.clone();
  url.search = "";
  url.pathname = "/";
  return NextResponse.redirect(url);
};

const checkUser = async (req: NextRequest) => {
  const token = req.cookies.get("access_token") as string;
  const user = await getUser(token);

  if (!user) return NextResponse.next();

  const redirect = req.nextUrl.searchParams.get("url");

  if (!redirect) return returnToHome(req);

  const url = req.nextUrl.clone();

  url.searchParams.delete("url");
  url.pathname = redirect;

  return NextResponse.redirect(url);
};

const checkRegister = async (req: NextRequest) => {
  const token = req.cookies.get("access_token") as string;
  const user = await getUser(token);

  if (user) return returnToHome(req);

  // check code, redirect in query
  const code = req.nextUrl.searchParams.get("code");
  const redirect = req.nextUrl.searchParams.get("redirect");

  if (!code || !redirect) return returnToHome(req);

  return NextResponse.next();
};

const checkReadable = async ({
  req,
  user,
  board,
  boardId,
  articleId,
}: {
  req: NextRequest;
  user: UserAuthPayload;
  board: BoardResponse[keyof BoardResponse];
  boardId: string;
  articleId: number;
}) => {
  if (user.role >= board.read) return NextResponse.next();

  const article = await fetch(`${host}/api/boards/${boardId}/${articleId}`, {
    method: "GET",
  }).then((res) => res.json());

  if (!article) return errorPage(req, 404);

  return article.authorId === user.id
    ? NextResponse.next()
    : errorPage(req, 403);
};

const checkWritable = async ({
  req,
  user,
  board,
}: {
  req: NextRequest;
  user: UserAuthPayload;
  board: BoardResponse[keyof BoardResponse];
}) => {
  return user.role >= board.write ? NextResponse.next() : errorPage(req, 403);
};

const checkEditable = async ({
  req,
  user,
  boardId,
  articleId,
}: {
  req: NextRequest;
  user: UserAuthPayload;
  boardId: string;
  articleId: number;
}) => {
  const article = await fetch(
    `${host}/api/boards/${boardId}/${articleId}`
  ).then((res) => res.json());

  if (article.authorId === user.id) return NextResponse.next();

  return errorPage(req, 403);
};
