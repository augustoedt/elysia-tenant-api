import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import { auth } from "../src/controllers/auth";
import { db } from "../src/db";
import { key, session, user } from "../src/db/schemas";
import { loginPayload, newUserPayload } from "./setup";

describe("Autthentication Server", () => {
  const app = new Elysia().use(auth);

  beforeAll(async () => {});

  afterAll(async () => {
    await db.delete(session);
    await db.delete(key);
    await db.delete(user);
  });

  it("signup response", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUserPayload),
        })
      )
      .then(async (res) => res);

    expect(response.status).toBe(200);
  });

  it("signin response", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "operador@teste.com",
            password: "Fulano@123",
          }),
        })
      )
      .then((res) => res);

    expect(response.status).toBe(200);
  });

  it("signin and get profile", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginPayload),
        })
      )
      .then((res) => res);

    const sessionCookie = response.headers.get("Set-Cookie");

    const profile = await app
      .handle(
        new Request("http://localhost/profile", {
          method: "GET",
          headers: {
            Cookie: sessionCookie ?? "",
          },
        })
      )
      .then((res) => res);

    expect(profile.status).toBe(200);
  });

  it("Unauthorized Profile", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginPayload),
        })
      )
      .then((res) => res);

    const sessionCookie = response.headers.get("Set-Cookie");

    const unauthorizedProfile = await app
      .handle(
        new Request("http://localhost/profile", {
          method: "GET",
          headers: {},
        })
      )
      .then((res) => res);

    expect(unauthorizedProfile.status).toBe(404);
  });
});
