# dev-repo

[![Build Status](https://travis-ci.com/uscreen/dev-repo.svg?branch=master)](https://travis-ci.com/uscreen/dev-repo)
[![Known Vulnerabilities](https://snyk.io/test/github/uscreen/dev-repo/badge.svg?targetFile=package.json)](https://snyk.io/test/github/uscreen/dev-repo?targetFile=package.json)

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
  "client": "git@github.com:example/client.git",
  "api": "git@github.com:example/api.git",
  "website": "git@github.com:example/website.git"
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
  install [repository]            install named repository (ie. "webapi"), or all if no name supplied
  list [repository] [-f|--fetch]  list named repository (ie. "webapi"), or all if no name supplied
  pull [repository]               pull named repository (ie. "webapi"), or all if no name supplied
  run <command> [repository]      run command within named repository (ie. "webapi"), or all if no name supplied
  help [cmd]                      display help for [cmd]
```

## Api

### $ repo install [repository]

Install given repository or all. This will create any missing subdirectory, `git clone` missing repositories and run a `yarn install` for each repository. Subsequent calls of `repo install` will at least run a `yarn install` each time. Those will run in parallel.

### $ repo pull [repository]

Pull one given repository from remote or all repositories. Those pulls will run in parallel.

### $ repo run \<command\> [repository]

Run given command within given repository or all available repositories.
Example with three repoos:

```bash
$ repo run "git pull"
Already up to date.
Already up to date.
Already up to date.
```

Example with a given repository:

```bash
$ repo run "git status" webapi
On branch master
Your branch is up to date with 'origin/master'.

nothing to commit, working tree clean
```

By now commands will run in parallel, so don't expect a proper sequences output. `run` inherits the current users shell from env to enable aliases etc. by default. For example this could open editors for all projects:

```bash
$ repo run "v"
```

(assuming an alias like `alias v 'code .'`)

### $ repo list [repository] [-f|--fetch]

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

$ repo list -f
remote: Enumerating objects: 1, done.
remote: Counting objects: 100% (1/1), done.
remote: Total 2 (delta 1), reused 1 (delta 1)
Unpacking objects: 100% (2/2), done.
From github.com:example/api
   b578056..d7b07cd  master     -> origin/master
website@0.3.0 - [master] HEAD clean
api@0.4.0 - [master] HEAD dirty [0⇡/⇣1]
client@0.1.0 - [master] HEAD clean

```
---

## Roadmap

- add unit tests for edge cases
- add tests for v0.2.0
- add switch to run commands in squence

## Changelog

### v0.5.0

#### Changed

- refactored to ESM

### v0.4.[1,2]

- security fixes & upgrades

### v0.4.0

#### Changed

- dropped git packages (isomorphic-git, git-utils), replaced by shell commands

### v0.3.0

#### Added

- travis ci integration
- snyk audit integration

### v0.2.0

#### Added

- `repo pull` command to pull one or all repositories from remote
- `repo run` command to run sub-commands within repositories

### v0.1.0

#### Added

- `repo install` command to install from git & npm
- `repo list` command to give some status info
- integration tests covering most (not all) use cases
- added integration test for `repo list --fetch` to also `git fetch` befores list

### v0.0.0

- initially bootstrapped

---

## License

Licensed under [MIT](./LICENSE).

Published, Supported and Sponsored by [u|screen](https://uscreen.de)
