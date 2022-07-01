import { createUser } from "~/lib/services/user";
import { tester } from "../__data__";

test("Create a Test User", async () => {
  await createUser(tester);
});
