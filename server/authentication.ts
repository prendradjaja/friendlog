import { Express, Request, Response, NextFunction } from "express";
import { PassportStatic } from "passport";
import session from "express-session";
import connectPGSimple from "connect-pg-simple";
// @ts-ignore
import GoogleStrategy from "passport-google-oidc"; // Type definitions don't exist, so GoogleStrategy is typed as `any`.

import { dbPool } from "./database";
import { Account } from "./database-types";
import { Repository } from "./repository";
import { loadConfig } from "./config";

interface Profile {
  id: string;
  displayName: string;
}

const PGStore = connectPGSimple(session);

/**
 * Check if the user is logged in; else give a 403 Forbidden.
 *
 * This can be used as middleware on the app or on a Router, e.g.
 *
 *     // All routes below this use ensureLoggedIn
 *     router.use(ensureLoggedIn);
 *
 * It can also be used on an individual route:
 *
 *     router.get(
 *       "/some/route",
 *       ensureLoggedIn,
 *       async (req, res) => { ... }  // Your route handler here
 *     )
 */
export function ensureLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    res.status(403).json({});
    return;
  }
  next();
}

/**
 * Get the ID of the logged in user. This should only be used if the user is logged in (i.e. use
 * this together with ensureLoggedIn()). If the user is not logged in, an exception will be thrown.
 */
export function getUserId(req: Request): number {
  return (req.user as any).id; // todo Add name and id fields to Express's user object
}

export function setUpAuthentication(
  app: Express,
  repo: Repository,
  passport: PassportStatic,
) {
  const config = loadConfig();
  const { googleClientID, googleClientSecret, clientDomainForOAuthCallback } =
    config;

  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: new PGStore({
        pool: dbPool,
      }),
    }),
  );
  app.use(passport.authenticate("session"));

  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: clientDomainForOAuthCallback + "/oauth2/redirect/google", // todo Maybe pull the whole url into config, not just domain
        scope: ["profile"],
      },
      makeVerifyUserCallback(repo),
    ),
  );

  passport.serializeUser(function (user: any, cb) {
    // todo Any
    process.nextTick(function () {
      cb(null, { id: user.id, name: user.name });
    });
  });

  passport.deserializeUser(function (user: any, cb) {
    // todo Any
    process.nextTick(function () {
      return cb(null, user);
    });
  });
}

export function registerAuthenticationRoutes(
  app: Express,
  passport: PassportStatic,
) {
  app.get("/login/federated/google", passport.authenticate("google"));

  app.get(
    "/oauth2/redirect/google",
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/",
    }),
  );

  app.post("/logout", function (req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
}

function makeVerifyUserCallback(repo: Repository) {
  // todo Use zod to validate the Profile type?
  async function verifyUser(
    issuer: string,
    profile: Profile,
  ): Promise<Account> {
    let accountId = await repo.getAccountIdViaFederatedIdentity(
      issuer,
      profile.id,
    );
    if (accountId === undefined) {
      accountId = await repo.createAccount(profile.displayName);
      await repo.createFederatedCredential(accountId, issuer, profile.id);
      return {
        id: accountId,
        name: profile.displayName,
      };
    } else {
      return repo.getAccount(accountId);
    }
  }

  return (
    issuer: string,
    profile: Profile,
    cb: Function, // todo More specific type here
  ) => {
    return verifyUser(issuer, profile).then(
      (account) => cb(null, account),
      (err) => cb(err), // todo Test that various errors do get handled properly here
    );
  };
}
