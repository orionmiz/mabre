import { createBoard } from "src/lib/services/board";
import { testBoard } from "../__data__";

test("Create an Empty Test Board", async () => {
  expect(
    await createBoard(testBoard).catch((e) =>
      expect(e.message).toMatch("Unique constraint failed")
    )
  );
});
