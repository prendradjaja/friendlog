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
}

export function registerAuthenticationRoutes(
  app: Express,
  passport: PassportStatic,
) {
  app.get("/login/federated/google", passport.authenticate("google"));
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
