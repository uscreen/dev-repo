import path from 'path'
import fs from 'fs-extra'
import tap from 'tap'
import { cli, stubGit, cleanupGit, before } from './helper.js'

tap.before(before)

tap.test('$ cli install (on empty directory)', async (t) => {
  stubGit()
  const cwd = './test/_fixtures/addrepos'
  const reposDir = path.resolve(cwd, 'repos')
  const result = await cli(['install'], cwd)

  t.equal(0, result.code, 'Should succeed')

  t.equal(
    true,
    result.stdout.startsWith('demorepo - missing: no directory'),
    'Should print error information on missing directory'
  )

  t.equal(
    true,
    result.stdout.includes('mkdir new directory "repos/demorepo"'),
    'Should print mkdir information'
  )

  t.equal(
    true,
    result.stdout.includes('demorepo - missing: no repository'),
    'Should print error information on missing repository'
  )

  t.equal(
    true,
    result.stdout.includes('git clone ../../_stubs/demorepo repos/demorepo'),
    'Should print git clone information'
  )

  t.equal(
    true,
    result.stdout.includes('[1/4] Resolving packages'),
    'Should print [1/4] Resolving packages'
  )

  t.equal(
    true,
    fs.existsSync(path.resolve(reposDir, '.gitignore')),
    'Should create .gitignore file'
  )

  t.equal(
    '*\n!.gitignore',
    fs.readFileSync(path.resolve(reposDir, '.gitignore'), 'utf8'),
    '.gitignore should ignore all file except itself'
  )

  // slow filesystem?
  // TODO: fix or refactor
  // await wait(200)
  // t.equal(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, '.git')),
  //   "Should contain '.git'"
  // )
  // t.equal(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, '.gitignore')),
  //   "Should contain '.gitignore'"
  // )
  // t.equal(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, 'one')),
  //   "Should contain 'one'"
  // )
  // t.equal(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, 'package.json')),
  //   "Should contain 'package.json'"
  // )
  // t.equal(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, 'two')),
  //   "Should contain 'two'"
  // )
  // t.equal(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, 'yarn.lock')),
  //   "Should contain 'yarn.lock'"
  // )
  // t.equal(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, 'node_modules')),
  //   "Should contain 'node_modules'"
  // )
  // t.equal(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, 'node_modules', 'debug')),
  //   "Should contain 'node_modules/debug'"
  // )

  // another run should not clone but install
  fs.writeFileSync(path.resolve(reposDir, '.gitignore'), '!demorepo', 'utf8')

  const result2 = await cli(['install'], cwd)

  t.equal(0, result2.code, 'Another run should succeed')

  t.equal(
    false,
    result2.stdout.startsWith('demorepo - missing: no directory'),
    'Another run should NOT print error information on missing directory'
  )

  t.equal(
    false,
    result2.stdout.includes('mkdir new directory "repos/demorepo"'),
    'Another run should NOT print mkdir information'
  )

  t.equal(
    false,
    result2.stdout.includes('demorepo - missing: no repository'),
    'Another run should NOT print error information on missing repository'
  )

  t.equal(
    false,
    result2.stdout.includes('git clone ../../_stubs/demorepo repos/demorepo'),
    'Another run should NOT print git clone information'
  )

  t.equal(
    true,
    result2.stdout.includes('[1/4] Resolving packages'),
    'Another run should print [1/4] Resolving packages'
  )

  t.equal(
    true,
    result2.stdout.includes('success Already up-to-date'),
    'Another run should print yarns success Already up-to-date information'
  )

  t.equal(
    '!demorepo',
    fs.readFileSync(path.resolve(reposDir, '.gitignore'), 'utf8'),
    '.gitignore should not be overwritten'
  )

  cleanupGit()
  t.end()
})

tap.test('$ cli install single repo (demorepo)', async (t) => {
  stubGit()
  const cwd = './test/_fixtures/addrepos'
  const result = await cli(['install', 'demorepo'], cwd)
  t.equal(
    true,
    result.stdout.includes('git clone ../../_stubs/demorepo repos/demorepo'),
    "Should print Cloning into 'repos/demorepo'"
  )
  t.equal(
    true,
    result.stderr.startsWith("Cloning into 'repos/demorepo'"),
    "Should print Cloning into 'repos/demorepo'"
  )
  cleanupGit()
  t.end()
})

tap.test('$ cli install (on invalid repository)', async (t) => {
  stubGit()
  const cwd = './test/_fixtures/addrepos'
  const result = await cli(['install', 'invalid'], cwd)
  t.equal(
    true,
    result.stderr.startsWith('ERROR: repository "invalid" does not exist'),
    'Should print error information on invalid repository'
  )
  cleanupGit()
  t.end()
})
