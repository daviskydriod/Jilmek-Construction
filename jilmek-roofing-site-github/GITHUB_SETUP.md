# JILMEK Roofing & Construction Ltd

This repository contains the JILMEK public website and its authenticated content-management dashboard. The application is a React + TypeScript frontend with an Express/tRPC backend, Drizzle ORM, MySQL/TiDB persistence, Manus OAuth authentication, and storage references for project imagery.

## Features

The public site includes the Home, About, Services, Projects, and Contact pages with the supplied JILMEK logo and project photography. The `/admin` area provides a persistent dashboard layout for creating, editing, publishing, unpublishing, featuring, reordering, and deleting roofing products and property listings. Published CMS records automatically appear in the public Services and Home pages.

When the catalog API is unavailable or the database has no records yet, the public pages and `/admin` use clearly marked demo records from `client/src/lib/mockCms.ts`. In this fallback mode, create, edit, and delete actions update the current browser session locally so the admin screens remain fully demonstrable while the API is being connected. Once the API returns real catalog records, the dashboard uses the database-backed data and mutations automatically.

## Local setup

Install Node.js 22 or a compatible current LTS version, then run:

```bash
pnpm install
pnpm dev
```

The project uses the following scripts:

```bash
pnpm check     # TypeScript validation
pnpm build     # Production frontend and backend build
pnpm test      # Vitest regression tests
pnpm db:push   # Generate and apply Drizzle migrations
```

## Environment variables

Create a local environment file using the variables supplied by your hosting/auth/database provider. Never commit `.env` or real credentials.

Required runtime configuration includes `DATABASE_URL`, `JWT_SECRET`, Manus OAuth values, owner identity, and the built-in storage API values. The owner account is promoted to the `admin` role automatically when it signs in through Manus OAuth. Other users can be promoted by updating the `users.role` value to `admin` in the database.

## CMS workflow

Sign in through Manus OAuth and open `/admin`. Use **Roofing products** to manage sheet profiles and **Property listings** to manage land, property, and development records. Leave **Published on website** unchecked while a record is being prepared. The image fields accept a public URL or a WebDev storage path such as `/manus-storage/example-image.jpeg`.

## Deployment notes

The database migration is stored in `drizzle/0000_equal_garia.sql`. Run `pnpm db:push` against the target database before using the CMS. The website references WebDev storage paths for the supplied imagery; if moving outside WebDev, replace those paths with the URLs from your own object storage provider.

Do not commit `node_modules`, `dist`, `.env`, database credentials, OAuth secrets, or storage API keys.
