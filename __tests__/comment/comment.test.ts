import { testComment } from "__tests__/__data__";
import { createComment } from "~/lib/services/comment";

test("Create a comment", async () => {
  await createComment(testComment);
});
