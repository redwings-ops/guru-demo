# Vercel Deployment Guide

This file describes how to deploy the `tracking-web` Next.js app to Vercel and which environment variables to configure. It does NOT contain any secret keys — add your keys in the Vercel dashboard or via the CLI.

## Quick checklist
- Create a Git repository and push the `tracking-web` folder.
- Import the repository into Vercel (https://vercel.com/new).
- Add the required Environment Variables in the Vercel project settings (see list below).
- Set the **Build Command** to `npm run build` and **Output Directory** to the default (Next.js projects are detected automatically).
- Deploy and verify `/api/users` and `/api/location` routes (visit your-deployment.vercel.app/api/users).

## Environment variables (set these in Vercel → Project → Settings → Environment Variables)
Set the variables for Production, Preview and Development as needed.

- `NEXT_PUBLIC_SUPABASE_URL`  — Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key (public)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (SECRET — server-only usage)
- `NEXT_PUBLIC_MAPBOX_TOKEN` — Mapbox public token (public)

Security notes
- Never store `SUPABASE_SERVICE_ROLE_KEY` in client-side code or commit it to Git. In Vercel, set it only as an environment variable; serverless functions will access it via `process.env.SUPABASE_SERVICE_ROLE_KEY`.
- Use the Preview and Production environment settings to avoid leaking test keys to production.
- Consider rotating keys regularly and using Supabase Row Level Security (RLS) for stricter access control.

## Example `vercel.json` (optional)
You can add a `vercel.json` file to the repo to declare builds and optionally reference Vercel secrets. This file is optional — Vercel will detect Next.js automatically.

```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/next" }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY": "@SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_MAPBOX_TOKEN": "@NEXT_PUBLIC_MAPBOX_TOKEN"
  }
}
```

Notes about the example above:
- The `@VAR_NAME` syntax references Vercel Project Secrets. Create the corresponding Project Secrets in the Vercel UI or CLI and the mapping will work.

## Connecting Git & deploy flow
1. Init a repo in the `tracking-web` folder and push to GitHub/GitLab/Bitbucket.
2. In Vercel, choose "Import Project" → select your repository → configure Environment Variables.
3. Click "Deploy". Vercel will run `npm run build` and publish the site.

## Post-deploy checks
- Visit: `https://<your-deployment>.vercel.app/` to open the site.
- Verify API endpoints: `https://<your-deployment>.vercel.app/api/users` (POST) and `/api/location` (POST).
- Verify realtime updates: confirm Supabase Realtime subscriptions are firing (map receives points when `locations` inserts occur).

## Troubleshooting
- Build fails with missing env vars: ensure all required variables are set in Vercel for the environment being deployed.
- API returns 500 when inserting to Supabase: verify `SUPABASE_SERVICE_ROLE_KEY` is correct and has appropriate database privileges.
- Map tiles not showing: confirm `NEXT_PUBLIC_MAPBOX_TOKEN` is valid and has the right usage scope.

## CLI tips (optional)
- Create an encrypted secret (Vercel CLI):

```bash
vercel secret add NEXT_PUBLIC_SUPABASE_URL "https://..."
vercel secret add NEXT_PUBLIC_SUPABASE_ANON_KEY "anonkey..."
vercel secret add SUPABASE_SERVICE_ROLE_KEY "service_role_key..."
vercel secret add NEXT_PUBLIC_MAPBOX_TOKEN "pk..."
```

Then reference them in `vercel.json` using the `@` syntax shown above.

---
Keep this file in the project root so the team has a single source of truth for deployment.
