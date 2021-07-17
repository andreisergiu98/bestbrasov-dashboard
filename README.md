# Usage

<!-- usage -->

```sh-session
$ npm install -g @bestbrasov/cli
$ cli COMMAND
running command...
$ cli (-v|--version|version)
@bestbrasov/cli/0.0.1 linux-x64 node-v16.4.0
$ cli --help [COMMAND]
USAGE
  $ cli COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`cli backend:build`](#cli-backendbuild)
- [`cli backend:emit-schema`](#cli-backendemit-schema)
- [`cli backend:start`](#cli-backendstart)
- [`cli backend:update`](#cli-backendupdate)
- [`cli db:migrate:dev`](#cli-dbmigratedev)
- [`cli db:migrate:reset`](#cli-dbmigratereset)
- [`cli db:migrate:status`](#cli-dbmigratestatus)
- [`cli db:studio`](#cli-dbstudio)
- [`cli db:sync`](#cli-dbsync)
- [`cli frontend:build`](#cli-frontendbuild)
- [`cli frontend:start`](#cli-frontendstart)
- [`cli frontend:update`](#cli-frontendupdate)
- [`cli help [COMMAND]`](#cli-help-command)

## `cli backend:build`

builds the backend application

```
USAGE
  $ cli backend:build

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cli backend:build
```

## `cli backend:emit-schema`

emits the graphql schema

```
USAGE
  $ cli backend:emit-schema

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cli backend:emit:schema
```

## `cli backend:start`

start the backend application

```
USAGE
  $ cli backend:start

OPTIONS
  -d, --dev     watch for changes
  -h, --help    show CLI help
  -u, --update  update on prisma schema changes
  --clear       clear on changes

EXAMPLE
  $ cli backend:start
```

## `cli backend:update`

run backend related code generation

```
USAGE
  $ cli backend:update

OPTIONS
  -d, --dev   watch for changes
  -h, --help  show CLI help

EXAMPLE
  $ cli backend:update
```

## `cli db:migrate:dev`

create a migration from changes in Prisma schema, apply it to the database, trigger generators (e.g. Prisma Client)

```
USAGE
  $ cli db:migrate:dev

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cli db:migrate:status
```

## `cli db:migrate:reset`

reset your database and apply all migrations

```
USAGE
  $ cli db:migrate:reset

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cli db:migrate:reset
```

## `cli db:migrate:status`

check the status of migrations in the production/staging database

```
USAGE
  $ cli db:migrate:status

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cli db:migrate:status
```

## `cli db:studio`

launch Prisma Studio

```
USAGE
  $ cli db:studio

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cli db:studio
```

## `cli db:sync`

sync database with the current version of the schema

```
USAGE
  $ cli db:sync

OPTIONS
  -f, --force
  -h, --help   show CLI help

EXAMPLE
  $ cli db:sync
```

## `cli frontend:build`

build the frontend application

```
USAGE
  $ cli frontend:build

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cli frontend:build
```

## `cli frontend:start`

start the frontend application

```
USAGE
  $ cli frontend:start

OPTIONS
  -d, --dev     watch for changes
  -h, --help    show CLI help
  -u, --update  starts graphql code generation

EXAMPLE
  $ cli frontend:start
```

## `cli frontend:update`

run frontend related code generation

```
USAGE
  $ cli frontend:update

OPTIONS
  -d, --dev         watch for changes
  -e, --errorsOnly  overrides the errorsOnly config to true.
  -h, --help        show CLI help

EXAMPLE
  $ cli frontend:update
```

## `cli help [COMMAND]`

display help for cli

```
USAGE
  $ cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

<!-- commandsstop -->
