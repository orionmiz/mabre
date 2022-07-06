import { createArticle } from "src/lib/services/article";
import { testArticle } from "../__data__";

test("Create a Test Article", async () => {
  await createArticle(testArticle);
});
