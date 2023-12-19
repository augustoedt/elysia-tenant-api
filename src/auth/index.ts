import { libsql } from "@lucia-auth/adapter-sqlite";
import { Middleware, lucia } from "lucia";
import { sqliteDB } from "../db";

export interface ElysiaContext {
  request: Request;
  set: {
    headers: Record<string, string> & {
      ["Set-Cookie"]?: string | string[];
    };
    status?: number | undefined | string;
    redirect?: string | undefined;
  };
}

export const elysia = (): Middleware<[ElysiaContext]> => {
  return ({ args }) => {
    const [{ request, set }] = args;
    return {
      request,
      setCookie: (cookie) => {
        const setCookieHeader = set.headers["Set-Cookie"] ?? [];
        const setCookieHeaders: string[] = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];
        setCookieHeaders.push(cookie.serialize());
        set.headers["Set-Cookie"] = setCookieHeaders;
      },
    };
  };
};

export const authLucia = lucia({
  env: "DEV",
  middleware: elysia(),
  adapter: libsql(sqliteDB, {
    user: "user",
    key: "user_key",
    session: "user_session",
  }),
  getUserAttributes: (user) => ({
    name: user.name,
    email: user.email,
  }),
});

export type Auth = typeof authLucia;
