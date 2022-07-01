import { createBoard } from "~/lib/services/board";
import { freeBoard, noticeBoard } from "../__data__";

test("Create a Notice Board", async () => {
  expect(
    await createBoard(noticeBoard).catch((e) =>
      expect(e.message).toMatch("Unique constraint failed")
    )
  );
});

test("Create a Free Board", async () => {
  expect(
    await createBoard(freeBoard).catch((e) =>
      expect(e.message).toMatch("Unique constraint failed")
    )
  );
});
