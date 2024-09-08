# Project template

Full-stack TypeScript webapp:

- With npm workspaces (client, server, shared)
- Ready to deploy to Heroku
- With `prettier` (& format-on-commit via `husky` and `lint-staged`)
- Frontend dependencies:
  - `react` (no framework)
  - `vite`
  - `react-router-dom`
  - `styled-components`
- Backend dependencies:
  - `express`
  - `tsx`
  - `pg`
  - `kysely` (& `kysely-codegen`)


## Setup
To create a new project based on this template:

- Create a new repo from this template
- Create a Postgres database locally
- Replace `XX_PROJECT_NAME` and `XX_DATABASE_NAME` in the code
- Deploy to Heroku


## Local development
```
# Install dependencies from client, server, shared
npm install

# Husky is used to run Prettier (code formatter) on every commit. Run this to enable Husky.
npm run prepare-husky
```

### Server
```
npm run dev -w server
```

For type checking, run this too in a separate terminal:
```
npm run typecheck-watch -w server
```

### Client
```
npm run dev -w client
```

Then open a browser and go to the url shown (probably http://localhost:5173)

For type checking, run this too in a separate terminal:
```
npm run typecheck-watch -w client
```

### Shared
Usually you won't need to run type checking for `shared`: The client and server both import it and
therefore typecheck it, so if you already have typecheck-watch (see above) running for client or
server, you'll see any type errors in `shared` that way.

(Usually I'll have both running, so I'll actually see those type errors twice -- oops!)

If you want type checking for it specifically, you can run:
```
npm run typecheck-watch -w shared
```


## Build and deploy

### Client
```
npm run build -w client
```

Output is in `dist/`.

### Server
No compile step. Just run the server as described above.
