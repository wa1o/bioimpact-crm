import { createCookieSessionStorage } from "react-router";
import { SESSION_SECRET } from "~/env.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name:     "__session",
    secrets:  [SESSION_SECRET],
    sameSite: "lax",
    httpOnly: true,  
    secure:   process.env.NODE_ENV === "production",
    maxAge:   60 * 60 * 8, 
  },
});

export const getSession    = (request: Request) =>
  sessionStorage.getSession(request.headers.get("Cookie"));

export const commitSession  = sessionStorage.commitSession;
export const destroySession = sessionStorage.destroySession;