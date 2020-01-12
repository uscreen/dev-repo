# dev-repo

> TBD


## Usage

> TBD

## api

### dev list [repository]

Lists local information about a given repository or all.

- name@version
- current branch of working copy
- current changes of working copy
- counts of commits behind/ahead HEAD

Example output:

```bash
$ dev list
dashboard-client@0.1.0 - [master] HEAD clean
webapi@0.4.0 - [master] HEAD dirty [2⇡/⇣1] - Working Copy: 2 uncommitted local changes
website@0.3.0 - [stable] HEAD clean

$ dev list
dashboard-client@0.1.0 - [master] HEAD clean
webapi@0.4.0 - [master] HEAD dirty [2⇡/⇣1]
website@0.3.0 - [stable] HEAD clean

$ dev list
dashboard-client@0.1.0 - [master] HEAD clean
webapi@0.4.0 - [master] HEAD dirty [3⇡/⇣0]
website@0.3.0 - [stable] HEAD clean

$ dev list
dashboard-client@0.1.0 - [master] HEAD clean
webapi@0.4.0 - [master] HEAD clean - Working Copy: 1 uncommitted local changes
website@0.3.0 - [stable] HEAD clean

$ dev list
dashboard-client@0.1.0 - [master] HEAD clean
webapi@0.4.0 - [master] HEAD clean - Working Copy: 1 uncommitted local changes
website@0.3.0 - [stable] HEAD clean

```
---

## Roadmap

- > ...TBD

## Changelog

### v0.0.0

- initially bootstrapped

---

## License

Licensed under [MIT](./LICENSE).

Published, Supported and Sponsored by [u|screen](https://uscreen.de)
