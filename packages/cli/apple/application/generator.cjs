const path = require('node:path')
const categories = require('./schema.json').properties.category.enum
const {
  addProjectConfiguration,
  generateFiles,
  getProjects,
  offsetFromRoot,
  names
} = require('@nx/devkit')

module.exports = function application(tree, options) {
  const { category = 'app', directory = '', bundlePrefix = 'dev.vx' } = options
  if (!categories.includes(category))
    throw new Error('Unknown app category: ' + category)
  const name = names(options.name.trim()).fileName
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error('Use a lowercase app name such as field-notes.')
  }
  if (
    !/^[a-zA-Z][a-zA-Z0-9-]*(?:[.][a-zA-Z][a-zA-Z0-9-]*)+$/.test(bundlePrefix)
  ) {
    throw new Error('Use a reverse-DNS bundle prefix such as dev.vx.')
  }
  const categoryFolder =
    category === 'app'
      ? 'apps'
      : category === 'vezham'
        ? 'apps-vezham'
        : `apps-${category}s`
  const group = names(directory.trim()).fileName
  if (
    group &&
    !group.split('/').every(segment => /^[a-z0-9][a-z0-9.-]*$/.test(segment))
  ) {
    throw new Error(
      'Use a relative group such as operations or operations/mobile.'
    )
  }
  const root = [categoryFolder, group, name].filter(Boolean).join('/')
  if (
    getProjects(tree).has(name) ||
    tree.exists(root) ||
    tree.children(root).length
  ) {
    throw new Error('An app or project already exists at ' + name)
  }
  const product = names(name).className
  const targets = {}
  const command = value => ({
    executor: 'nx:run-commands',
    options: { cwd: root, command: value }
  })
  targets.generate = { ...command('xcodegen generate'), cache: false }
  for (const [target, scheme, destination] of [
    ['build-ios', 'Mobile', 'generic/platform=iOS Simulator'],
    ['build-mac', 'Mac', 'platform=macOS']
  ]) {
    targets[target] = {
      ...command(
        `xcodebuild -quiet -project ${product}.xcodeproj -scheme ${product}${scheme} -configuration Debug -destination '${destination}' -derivedDataPath ${offsetFromRoot(root)}dist/${name}/${scheme} build`
      ),
      dependsOn: ['generate']
    }
  }
  addProjectConfiguration(tree, name, {
    root,
    projectType: 'application',
    tags: [`category:${category}`],
    targets
  })
  generateFiles(tree, path.join(__dirname, 'files'), root, {
    name,
    product,
    displayName: name
      .split('-')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' '),
    bundlePrefix,
    dot: '.',
    template: ''
  })
}
