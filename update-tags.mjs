import { readFile, writeFile } from 'fs/promises'
import { glob as baseGlob } from 'glob'
import * as prettier from 'prettier'

// FIXME: replace with a JSON import when Import Attributes become part of
// EcmaScript. See https://github.com/tc39/proposal-import-attributes
const { version } = JSON.parse(
  await readFile('package.json', { encoding: 'utf8' }),
)

const tagPath = `v${version}`

async function glob(path) {
  return await baseGlob(path, {
    ignore: ['node_modules/**'],
    posix: true,
  })
}

async function fileUpdates(fileSet, key, oldValue, newValue) {
  await Promise.all(
    fileSet.map(async (fileItem) => {
      let file = JSON.parse(
        await readFile(fileItem, {
          encoding: 'utf-8',
        }),
      )
      file[key] = file[key].replace(
        `https://gcn.nasa.gov/schema/${oldValue}/`,
        `https://gcn.nasa.gov/schema/${newValue}/`,
      )

      await writeFile(
        fileItem,
        await prettier.format(JSON.stringify(file), {
          parser: 'json',
        }),
      )
    }),
  )
}

async function loadAndUpdateFiles(oldValue, newValue) {
  const schemaFilenames = await glob('**/*.schema.json')
  await fileUpdates(schemaFilenames, '$id', oldValue, newValue)

  const exampleFilenames = await glob('**/*.example.json')
  await fileUpdates(exampleFilenames, '$schema', oldValue, newValue)
}

if (process.argv.includes('--reset')) {
  await loadAndUpdateFiles(tagPath, 'main')
} else {
  await loadAndUpdateFiles('main', tagPath)
}
