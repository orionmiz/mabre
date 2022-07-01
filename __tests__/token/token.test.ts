import * as jose from "jose";

test("Test a token", async () => {
  const key = new TextEncoder().encode("test".repeat(8));

  const token = await new jose.EncryptJWT({
    test: "test_val",
  })
    .setProtectedHeader({
      alg: "dir",
      enc: "A256GCM",
    })
    .encrypt(key);

  const { payload } = await jose.jwtDecrypt(token, key);

  expect(payload).toEqual({
    test: "test_val",
  });
});
