import { type Tree, readJsonFile, readNxJson } from '@nx/devkit'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { matchesGlob } from 'node:path'
import { getLatestGitTagForPattern } from 'nx/src/command-line/release/utils/git'

const require = createRequire(import.meta.url)

export const resolveInitialVersion = async (
  tree: Tree,
  projectName: string
) => {
  const release = readNxJson(tree)?.release
  const releaseTag = release?.releaseTag
  const pattern =
    releaseTag?.pattern ??
    (release?.projectsRelationship === 'independent'
      ? '{projectName}@{version}'
      : 'v{version}')

  const git = (args: string[]) =>
    execFileSync('git', args, {
      cwd: tree.root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()

  const latest = await getLatestGitTagForPattern(
    pattern,
    { projectName },
    async checkAllBranchesWhen => {
      let allBranches = checkAllBranchesWhen === true
      if (Array.isArray(checkAllBranchesWhen)) {
        const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'])
        allBranches = checkAllBranchesWhen.some(pattern =>
          matchesGlob(branch, pattern)
        )
      }
      const tags = (all: boolean) =>
        git([
          '-c',
          'versionsort.suffix=-',
          'tag',
          '--sort=-v:refname',
          ...(all ? [] : ['--merged'])
        ])
          .split('\n')
          .filter(Boolean)
      const mergedTags = tags(allBranches)
      return !mergedTags.length &&
        !allBranches &&
        checkAllBranchesWhen !== false
        ? tags(true)
        : mergedTags
    },
    {
      requireSemver: true,
      strictPreid: releaseTag?.strictPreid ?? true,
      checkAllBranchesWhen: releaseTag?.checkAllBranchesWhen
    }
  )

  return (
    latest?.extractedVersion ??
    readJsonFile<{ version: string }>(
      require.resolve('@vx-cli/react/package.json')
    ).version
  )
}
