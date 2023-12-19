import { Elysia } from "elysia";
import { auth } from "./controllers/auth";

const app = new Elysia().use(auth).listen(3000);
