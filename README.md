# dev-repo

> Manage a group of repositories for local development

## Install

Add the module within your dev repo:

```bash
$ yarn add @uscreen.de/dev-repo
```

## Usage

To combine mutliple repositories into one single development repository you just add a mapping to your existing package.json, ie.:

```json
"repos": {
  "client": "git@gitlab.uscreen.net:example/client.git",
  "api": "git@gitlab.uscreen.net:example/api.git",
  "website": "git@gitlab.uscreen.net:example/website.git"
}
```

Next run `repo install` and you will end up with a directory structure like:

```bash
.
├── package.json
├── repos
│   ├── client
│   ├── api
│   └── site
└── yarn.lock
```

Each `./repos/*` now containing a git cloned checkout with `./repos/*/node_modules` already installed. Invoking `$ repo`without any parameter prints general usage information:

```bash
$ repo
Usage: repo [options] [command]

Options:
  -V, --version         output the version number
  -h, --help            output usage information

Commands:
  install [repository]  install named repository (ie. "webapi"), or all if no name supplied
  list [repository]     list named repository (ie. "webapi"), or all if no name supplied
  help [cmd]            display help for [cmd]
```

## Api

### $ repo install [repository]

Install given repository or all. This will create any missing subdirectory, `git clone` missing repositories and run a `yarn install` for each repository. Subsequent calls of `repo install` will at least run a `yarn install` each time. Those will run in parallel.

### $ repo list [repository]

Lists local information about a given repository or all.

- name@version
- current branch of working copy
- current changes of working copy
- counts of commits behind/ahead HEAD

Example output:

```bash
$ repo list
client@0.1.0 - [master] HEAD clean
api@0.4.0 - [master] HEAD dirty [2⇡/⇣1] - Working Copy: 2 uncommitted local changes
website@0.3.0 - [stable] HEAD clean

$ repo list
client@0.1.0 - [master] HEAD clean
api@0.4.0 - [master] HEAD dirty [2⇡/⇣1]
website@0.3.0 - [stable] HEAD clean

$ repo list
client@0.1.0 - [master] HEAD clean
api@0.4.0 - [master] HEAD dirty [3⇡/⇣0]
website@0.3.0 - [stable] HEAD clean

$ repo list
client@0.1.0 - [master] HEAD clean
api@0.4.0 - [master] HEAD clean - Working Copy: 1 uncommitted local changes
website@0.3.0 - [stable] HEAD clean

$ repo list
client@0.1.0 - [master] HEAD clean
api@0.4.0 - [master] HEAD clean - Working Copy: 1 uncommitted local changes
website@0.3.0 - [stable] HEAD clean

```
---

## Roadmap

- need to find better git module (native, isomorph, utils)
- add unit tests for edge cases
- add another optional flag to also `git fetch` befores list

## Changelog

### v0.1.0

#### Added

- `repo install` command to install from git & npm
- `repo list` command to give some status info
- integration tests covering most (all?) use cases

### v0.0.0

- initially bootstrapped

---

## License

Licensed under [MIT](./LICENSE).

Published, Supported and Sponsored by [u|screen](https://uscreen.de)
