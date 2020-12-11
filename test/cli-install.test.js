const path = require('path')
const fs = require('fs-extra')
const tap = require('tap')
const { cli, stubGit, cleanupGit } = require('./helper')

tap.test('$ cli install (on empty directory)', async (t) => {
  stubGit()
  const cwd = './test/_fixtures/addrepos'
  const reposDir = path.resolve(cwd, 'repos')
  // const demorepo = path.resolve(cwd, 'repos', 'demorepo')
  const result = await cli(['install'], cwd)

  t.strictEqual(0, result.code, 'Should succeed')

  t.strictEqual(
    true,
    result.stdout.startsWith('demorepo - missing: no directory'),
    'Should print error information on missing directory'
  )

  t.strictEqual(
    true,
    result.stdout.includes('mkdir new directory "repos/demorepo"'),
    'Should print mkdir information'
  )

  t.strictEqual(
    true,
    result.stdout.includes('demorepo - missing: no repository'),
    'Should print error information on missing repository'
  )

  t.strictEqual(
    true,
    result.stdout.includes('git clone ../../_stubs/demorepo repos/demorepo'),
    'Should print git clone information'
  )

  t.strictEqual(
    true,
    result.stdout.includes('[1/4] Resolving packages'),
    'Should print [1/4] Resolving packages'
  )

  t.strictEqual(
    true,
    fs.existsSync(path.resolve(reposDir, '.gitignore')),
    'Should create .gitignore file'
  )

  t.strictEqual(
    '*\n!.gitignore',
    fs.readFileSync(path.resolve(reposDir, '.gitignore'), 'utf8'),
    '.gitignore should ignore all file except itself'
  )

  // slow filesystem?
  // TODO: fix or refactor
  // await wait(200)
  // t.strictEqual(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, '.git')),
  //   "Should contain '.git'"
  // )
  // t.strictEqual(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, '.gitignore')),
  //   "Should contain '.gitignore'"
  // )
  // t.strictEqual(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, 'one')),
  //   "Should contain 'one'"
  // )
  // t.strictEqual(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, 'package.json')),
  //   "Should contain 'package.json'"
  // )
  // t.strictEqual(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, 'two')),
  //   "Should contain 'two'"
  // )
  // t.strictEqual(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, 'yarn.lock')),
  //   "Should contain 'yarn.lock'"
  // )
  // t.strictEqual(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, 'node_modules')),
  //   "Should contain 'node_modules'"
  // )
  // t.strictEqual(
  //   true,
  //   fs.existsSync(path.resolve(demorepo, 'node_modules', 'debug')),
  //   "Should contain 'node_modules/debug'"
  // )

  // another run should not clone but install
  fs.writeFileSync(path.resolve(reposDir, '.gitignore'), '!demorepo', 'utf8')

  const result2 = await cli(['install'], cwd)
  t.strictEqual(0, result2.code, 'Another run should succeed')

  t.strictEqual(
    false,
    result2.stdout.startsWith('demorepo - missing: no directory'),
    'Another run should NOT print error information on missing directory'
  )

  t.strictEqual(
    false,
    result2.stdout.includes('mkdir new directory "repos/demorepo"'),
    'Another run should NOT print mkdir information'
  )

  t.strictEqual(
    false,
    result2.stdout.includes('demorepo - missing: no repository'),
    'Another run should NOT print error information on missing repository'
  )

  t.strictEqual(
    false,
    result2.stdout.includes('git clone ../../_stubs/demorepo repos/demorepo'),
    'Another run should NOT print git clone information'
  )

  t.strictEqual(
    true,
    result2.stdout.includes('[1/4] Resolving packages'),
    'Another run should print [1/4] Resolving packages'
  )

  t.strictEqual(
    true,
    result2.stdout.includes('success Already up-to-date'),
    'Another run should print yarns success Already up-to-date information'
  )

  t.strictEqual(
    '!demorepo',
    fs.readFileSync(path.resolve(reposDir, '.gitignore'), 'utf8'),
    '.gitignore should not be overwritten'
  )

  cleanupGit()
  t.end()
})
