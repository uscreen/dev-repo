import tap from 'tap'
import { cli, stubGit, cleanupGit } from './helper.js'
const cwd = './test/_fixtures/runrepos'

const prepare = async () => {
  stubGit('run')
  return cli(['install'], cwd)
}

tap.test('$ cli run (without command)', async (t) => {
  await prepare()
  const resultA = await cli(['run', '', ''], cwd)
  t.equal(1, resultA.code, 'Should fail')

  const resultB = await cli(['run'], cwd)
  t.equal(1, resultB.code, 'Should fail')

  t.end()
  cleanupGit('run')
})

tap.test('$ cli run (fail on unknown repo)', async (t) => {
  await prepare()
  const result = await cli(['run', "'ls one'", 'foo'], cwd)
  t.equal(1, result.code, 'Should fail')
  t.equal(
    true,
    result.stderr.includes('repository "foo" does not exist Aborting'),
    'Should print information on aborting operation due to unknown repository'
  )
  t.end()
  cleanupGit('run')
})

tap.test('$ cli run (with ls command on one existing repo)', async (t) => {
  await prepare()
  const result = await cli(['run', "'ls one'", 'repo_1'], cwd)
  t.equal(0, result.code, 'Should succeed')
  t.equal('one\n', result.stdout, 'Should print name of found file')
  t.end()
  cleanupGit('run')
})

tap.test('$ cli run (with ls command on all repos)', async (t) => {
  await prepare()
  const result = await cli(['run', "'ls one'"], cwd)
  t.equal(0, result.code, 'Should succeed')
  t.equal('one\none\n', result.stdout, 'Should print names of found files')
  t.end()
  cleanupGit('run')
})
