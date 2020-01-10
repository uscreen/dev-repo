#!/usr/bin/env node

const cli = require('commander')

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
    'list [repository]',
    'list named repository (ie. "webapi"), or all if no name supplied'
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
