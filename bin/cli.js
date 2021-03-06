#!/usr/bin/env node

const { Command } = require('commander')
const cli = new Command()

/**
 * package.json content
 */
const { version } = require('../package.json')

/**
 * define the command
 */
cli
  .version(version)
  .command(
    'install [repository]',
    'install named repository (ie. "webapi"), or all if no name supplied'
  )
  .command(
    'list [repository] [-f|--fetch]',
    'list named repository (ie. "webapi"), or all if no name supplied'
  )
  .command(
    'pull [repository]',
    'pull named repository (ie. "webapi"), or all if no name supplied'
  )
  .command(
    'run <command> [repository]',
    'run command within named repository (ie. "webapi"), or all if no name supplied'
  )

/**
 * read args
 */
cli.parse(process.argv)

/**
 * output help as default
 */
if (!process.argv.slice(2).length) {
  cli.help()
}
