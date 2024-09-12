import { Express, Request, Response, NextFunction } from "express";
import { PassportStatic } from "passport";

export function registerAuthenticationRoutes(
  app: Express,
  passport: PassportStatic,
) {
  app.get("/login/federated/google", passport.authenticate("google"));
}
