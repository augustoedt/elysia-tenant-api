import { Elysia, NotFoundError, t } from "elysia";
import { ctx } from "../context";

export const auth = new Elysia()
  .use(ctx)
  .post(
    "/signin",
    async ({ body, auth, set }) => {
      const user = await auth.useKey("email", body.email, body.password);

      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });

      const sessionCookie = auth.createSessionCookie(session);

      set.headers["Set-Cookie"] = sessionCookie.serialize();

      return {
        id: user.userId,
      };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    }
  )
  .post(
    "/signup",
    async ({ body, auth, session }) => {
      try {
        const user = await auth.createUser({
          key: {
            providerId: "email",
            providerUserId: body.email,
            password: body.password,
          },
          attributes: {
            name: body.name,
            email: body.email,
          },
        });

        return {
          id: user.id,
        };
      } catch (e) {
        console.log(e);
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 2 }),
        email: t.String({ format: "email" }),
        password: t.String({
          pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])",
        }),
      }),
    }
  )
  .get("/profile", async ({ auth, body, session }) => {
    
    const user = await session?.user;

    if (!user) {
      throw new NotFoundError();
    }

    return {
      user,
    };
  });
