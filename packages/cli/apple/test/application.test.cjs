const assert = require('node:assert/strict')
const { test } = require('node:test')
const { readProjectConfiguration } = require('@nx/devkit')
const { createTreeWithEmptyWorkspace } = require('@nx/devkit/testing')
const application = require('../application/generator.cjs')
const apple = require('../application/schema.json').properties
const react =
  require('../../react/src/generators/application/schema.json').properties

test('matches the React app category and directory options', () => {
  assert.deepEqual(apple.category, react.category)
  assert.deepEqual(apple.directory, react.directory)
})

test('defaults to apps and preserves identity in each category and nested group', () => {
  const folders = [
    'apps',
    'apps-showcases',
    'apps-suites',
    'apps-platforms',
    'apps-widgets',
    'apps-pods',
    'apps-internals',
    'apps-vezham'
  ]
  const plain = createTreeWithEmptyWorkspace()
  application(plain, { name: 'Field Notes' })
  assert.equal(
    readProjectConfiguration(plain, 'field-notes').root,
    'apps/field-notes'
  )
  for (const [index, category] of apple.category.enum.entries()) {
    const tree = createTreeWithEmptyWorkspace()
    application(tree, {
      name: 'Field Notes',
      category,
      directory: 'Customer Ops/Mobile'
    })
    const project = readProjectConfiguration(tree, 'field-notes')
    assert.equal(
      project.root,
      folders[index] + '/customer-ops/mobile/field-notes'
    )
    assert.deepEqual(project.tags, ['category:' + category])
    assert.ok(tree.exists(project.root + '/Mac/FieldNotesMacApp.swift'))
    assert.match(
      project.targets['build-ios'].options.command,
      /\.\.\/\.\.\/\.\.\/\.\.\/dist\/field-notes\/Mobile/
    )
    assert.throws(() =>
      application(tree, { name: 'field-notes', category: 'pod' })
    )
  }
})

test('rejects unsupported categories and escaping directories before generating files', () => {
  for (const options of [
    { category: 'cdn' },
    { category: 'doc' },
    { directory: '../escape' },
    { directory: '/tmp/foo' }
  ]) {
    const tree = createTreeWithEmptyWorkspace()
    const before = tree.listChanges()
    assert.throws(() => application(tree, { name: 'notes', ...options }))
    assert.deepEqual(tree.listChanges(), before)
  }
})
