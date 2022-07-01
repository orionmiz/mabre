import useSWR from "swr";
import { fetcher } from "~/lib/swr";
import { CommentResponse } from "~/pages/api/boards/[board]/[article]/comments";

export default function useComments(
  boardId: string,
  articleId: number,
  page: number
) {
  const { data, error, mutate } = useSWR<CommentResponse>(
    `/api/boards/${boardId}/${articleId}/comments?page=${page}`,
    fetcher
  );

  return { data, isLoading: !error && !data, isError: error, mutate };
}
