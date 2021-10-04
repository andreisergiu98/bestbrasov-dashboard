# Dashboard

[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=andreisergiu98_bestbrasov-dashboard&metric=security_rating)](https://sonarcloud.io/dashboard?id=andreisergiu98_bestbrasov-dashboard)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=andreisergiu98_bestbrasov-dashboard&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=andreisergiu98_bestbrasov-dashboard)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=andreisergiu98_bestbrasov-dashboard&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=andreisergiu98_bestbrasov-dashboard)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=andreisergiu98_bestbrasov-dashboard&metric=bugs)](https://sonarcloud.io/dashboard?id=andreisergiu98_bestbrasov-dashboard)

Internal dashboard for an NGO. Built with Node.Js, React, TypeScript and GraphQL.

It uses Yarn Berry for package management in PnP strict mode, Vite as a development server for React,
and is compiled using esbuild.

# Contents <!-- omit in toc -->

- [Dashboard](#dashboard)
- [Dependencies](#dependencies)
- [Commands](#commands)
  - [Docker](#docker)
    - [`docker-compose up -d`](#docker-compose-up--d)
    - [`docker-compose down`](#docker-compose-down)
  - [Backend](#backend)
    - [`yarn backend start:dev`](#yarn-backend-startdev)
    - [`yarn backend build`](#yarn-backend-build)
    - [`yarn backend lint`](#yarn-backend-lint)
  - [Frontend](#frontend)
    - [`yarn frontend start:dev`](#yarn-frontend-startdev)
    - [`yarn frontend build`](#yarn-frontend-build)
    - [`yarn frontend lint`](#yarn-frontend-lint)
  - [Database](#database)
    - [`yarn prisma db push`](#yarn-prisma-db-push)
    - [`yarn prisma db pull`](#yarn-prisma-db-pull)
    - [`yarn prisma migrate dev`](#yarn-prisma-migrate-dev)

# Dependencies

- [Docker](https://www.docker.com/)
- Docker compose
- [Node.js v16](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)

# Commands

## Docker

### `docker-compose up -d`

Starts the databases in background and leaves them running.

```
$ docker-compose up -d
```

### `docker-compose down`

Stops containers and removes containers, networks, volumes, and images created by `up`.

```
$ docker-compose down
```

## Backend

### `yarn backend start:dev`

Start the backend application in development mode. It will automatically rebuild itself and restart on file changes.

```
$ yarn backend start:dev
```

### `yarn backend build`

Build the backend for production.

```
$ yarn backend build
```

### `yarn backend lint`

Check the backend for linter errors.

```
$ yarn backend lint
$ yarn backend lint --fix # to also fix errors if possible
```

## Frontend

### `yarn frontend start:dev`

Start the frontend application in development mode.

```
$ yarn frontend start:dev
```

### `yarn frontend build`

Build the frontend for production.

```
$ yarn frontend build
```

### `yarn frontend lint`

Check the frontend for linter errors.

```
$ yarn frontend lint
$ yarn frontend lint --fix # to also fix errors if possible
```

## Database

### `yarn prisma db push`

Push the Prisma schema state to the database.

```
$ yarn prisma db push
```

### `yarn prisma db pull`

Pull the schema from an existing database, updating the Prisma schema.

```
$ yarn prisma db pull
```

### `yarn prisma migrate dev`

Create migrations from your Prisma schema.

```
$ yarn prisma migrate dev
```
