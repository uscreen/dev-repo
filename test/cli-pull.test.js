import tap from 'tap'
import { promisify } from 'util'
import { exec } from 'child_process'
import { cli, stubGit, cleanupGit, before } from './helper.js'
import { root } from '../src/utils.js'

const execPromise = promisify(exec)
const cwd = './test/_fixtures/pullrepos'

tap.before(before)

const prepare = async ({ addChanges = false }) => {
  if (!addChanges) {
    await stubGit('pull')
    return cli(['install'], cwd)
  }

  // use bare repo to push changes to in order to be able to pull changes from origin
  const reposDir = `${root}/test/_fixtures/pullrepos/repos`
  const dirBare = `${reposDir}/repo_0`
  const dirRepo1 = `${reposDir}/repo_1`
  const dirRepo2 = `${reposDir}/repo_2`
  const createBareRemote = `mkdir -p ${dirBare} && cd ${dirBare} && \
    git init --bare && \
    git remote add origin ${dirBare}/.git`

  await execPromise(createBareRemote)

  const addLocalRepo1 = `mkdir -p ${dirRepo1} && cd ${dirRepo1} && \
    git init && \
    git remote add origin ${dirBare} && \
    touch test1 && git add . && git commit -m "added test1" && \
    git push -u origin master`

  await execPromise(addLocalRepo1)

  const addLocalRepo2 = `mkdir -p ${dirRepo2} && cd ${dirRepo2} && \
    git init && \
    git remote add origin ${dirBare} && git pull origin master && \
    touch test2 && git add . && git commit -m "added test2" && \
    git push -u origin master`

  await execPromise(addLocalRepo2)
}

tap.test('$ cli pull (on already up to date state)', async (t) => {
  await prepare({})
  const result = await cli(['pull'], cwd)
  t.equal(0, result.code, 'Should succeed')

  t.equal(
    true,
    result.stdout.includes('Already up to date.\nAlready up to date'),
    'should print information on up to date repositories'
  )

  t.end()
  cleanupGit('pull')
})

tap.test('$ cli pull (on known up to date repository)', async (t) => {
  await prepare({})
  const result = await cli(['pull', 'repo_1'], cwd)
  t.equal(0, result.code, 'Should succeed')

  t.equal(
    true,
    result.stdout.includes('Already up to date.'),
    'should print information on up to date repositories'
  )

  t.end()
  cleanupGit('pull')
})

tap.test('$ cli pull (on known repository)', async (t) => {
  await prepare({ addChanges: true })
  const result = await cli(['pull', 'repo_1'], cwd)
  t.equal(0, result.code, 'Should succeed')

  t.equal(
    true,
    result.stdout.includes('1 file changed'),
    'should print information on pulling one file change'
  )

  t.end()
  cleanupGit('pull')
})

tap.test('$ cli pull (on unknown repository)', async (t) => {
  await prepare({})
  const result = await cli(['pull', 'foo'], cwd)
  t.equal(1, result.code, 'Should fail')

  t.equal(
    true,
    result.stderr.includes('repository "foo" does not exist'),
    'should print failure notice on unknown repository'
  )

  t.end()
  cleanupGit('pull')
})
