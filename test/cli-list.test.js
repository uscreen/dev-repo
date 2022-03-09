import tap from 'tap'
import { promisify } from 'util'
import { exec } from 'child_process'
import { cli, stubGit, cleanupGit, before } from './helper.js'
import { root } from '../src/utils.js'

const execPromise = promisify(exec)

tap.before(before)

tap.test('$ cli list (on empty directory)', async (t) => {
  const result = await cli(['list'], './test/_fixtures/empty')
  t.equal(0, result.code, 'Should succeed')
  t.equal(
    true,
    result.stdout.startsWith('demorepo - missing: no directory'),
    'Should print error information on missing directory'
  )
  t.end()
})

tap.test('$ cli list (with missing checkout)', async (t) => {
  const result = await cli(['list'], './test/_fixtures/norepos')
  t.equal(0, result.code, 'Should succeed')
  t.equal(
    true,
    result.stdout.startsWith('demorepo - missing: no repository'),
    'Should print error information on empty repos'
  )
  t.end()
})

tap.test(
  '$ cli list (with missing checkout and explicit parameter)',
  async (t) => {
    const result = await cli(['list', 'demorepo'], './test/_fixtures/norepos')
    t.equal(0, result.code, 'Should succeed')
    t.equal(
      true,
      result.stdout.startsWith('demorepo - missing: no repository'),
      'Should print error information on empty repos'
    )
    t.end()
  }
)

tap.test(
  '$ cli list (with missing checkout and explicit wrong parameter)',
  async (t) => {
    const result = await cli(['list', 'norepo'], './test/_fixtures/norepos')
    t.equal(1, result.code, 'Should not succeed')
    t.equal(
      true,
      result.stderr.startsWith(
        'ERROR: repository "norepo" does not exist Aborting.'
      ),
      'Should print error information on missing repos'
    )
    t.end()
  }
)

tap.test('$ cli list (with uncommitted local changes)', async (t) => {
  stubGit('list')
  const cwd = './test/_fixtures/listrepos'
  await cli(['install', 'demorepo_list'], cwd)
  const listResult = await cli(
    ['list', 'demorepo_list --fetch'],
    './test/_fixtures/listrepos'
  )
  t.equal(0, listResult.code, 'Should succeed')
  t.equal(
    true,
    listResult.stdout.includes(
      '[master] HEAD clean - Working Copy: 1 uncommitted local changes'
    ),
    'Should print information on uncommitted local change'
  )

  cleanupGit('list')
  t.end()
})

tap.test('$ cli list (with dirty head running ahead)', async (t) => {
  stubGit('list')
  const reposDir = `${root}/test/_fixtures/listrepos/repos`
  const dirBare = `${reposDir}/repo_bare`
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
    git remote add origin ${dirBare} && \
    git fetch && git checkout master && git pull origin master && \
    touch test2 && git add . && git commit -m "added test2" && \
    echo status now && git status -s -b`

  await execPromise(addLocalRepo2)

  const listResult = await cli(
    ['list', 'repo_2 --fetch'],
    './test/_fixtures/listrepos'
  )

  t.equal(
    true,
    listResult.stdout.includes('[master] HEAD dirty [1⇡/⇣0]'),
    'Should print information on branch being ahead by 1 commit'
  )
  t.end()

  cleanupGit('list')
})

tap.test('$ cli list (with dirty head running behind)', async (t) => {
  stubGit('list')
  const reposDir = `${root}/test/_fixtures/listrepos/repos`
  const dirBare = `${reposDir}/repo_bare`
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
    git remote add origin ${dirBare} && \
    git fetch && git checkout master && git pull origin master && \
    touch test2 && git add . && git commit -m "added test2" && \
    git push -u origin master`

  await execPromise(addLocalRepo2)

  const listResult = await cli(
    ['list', 'repo_1 --fetch'],
    './test/_fixtures/listrepos'
  )

  t.equal(
    true,
    listResult.stdout.includes('[master] HEAD dirty [0⇡/⇣1]'),
    'Should print information on branch being behind by 1 commit'
  )
  t.end()

  cleanupGit('list')
})

tap.test('$ cli list (with different branch)', async (t) => {
  cleanupGit('list')
  stubGit('list')
  const reposDir = `${root}/test/_fixtures/listrepos/repos`
  const dirBare = `${reposDir}/repo_bare`
  const dirRepo1 = `${reposDir}/repo_1`

  const createBareRemote = `mkdir -p ${dirBare} && cd ${dirBare} && \
    git init --bare && \
    git remote add origin ${dirBare}/.git`

  await execPromise(createBareRemote)

  const addLocalRepo1 = `mkdir -p ${dirRepo1} && cd ${dirRepo1} && \
    git init && \
    git remote add origin ${dirBare} && \
    touch test1 && git add . && git commit -m "added test1" && \
    git push -u origin master && \
    git checkout -b testbranch --track origin/master`

  await execPromise(addLocalRepo1)

  const listResult = await cli(
    ['list', 'repo_1 --fetch'],
    './test/_fixtures/listrepos'
  )

  t.equal(
    true,
    listResult.stdout.includes('[testbranch] HEAD clean'),
    'Should print information on selected testbranch'
  )
  t.end()

  cleanupGit('list')
})
