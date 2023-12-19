import { Elysia } from "elysia";
import { authLucia } from "../auth";
import { db } from "../db";

type UserData = {
  name: string;
  email: string;
  userId: string;
};

type SessionData = {
  user: UserData;
  sessionId: string;
  activePeriodExpiresAt: string;
  idlePeriodExpiresAt: string;
  state: string;
  fresh: boolean;
} | null;

export const ctx = new Elysia({ name: "@app/ctx" })
  .decorate("db", db)
  .decorate("auth", authLucia)
  .derive(async (ctx) => {
    const now = performance.now();
    const authRequest = ctx.auth.handleRequest(ctx);
    const session: SessionData = await authRequest.validate();
    console.log(`auth request took ${performance.now() - now}ms`);
    return {
      session,
    };
  });
