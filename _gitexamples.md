## isomorphic-git

```js

const fs = require('fs')
const git = require('isomorphic-git')
git.plugins.set('fs', fs)

const branch = await git.currentBranch({ dir })
console.log(branch)

const tags = await git.listTags({ dir })
console.log(tags.pop())

const commits = await git.log({ dir, depth: 1 })
console.log(commits)

const pushResponse = await git.push({ dir })
console.log(pushResponse)

const result = await git.checkout({ dir, ref: 'master' })
console.log(result)

const status = await git.statusMatrix({ fs, dir })
console.log(status)

```
