import { readFile, writeFile } from 'fs/promises'
import { glob as baseGlob } from 'glob'
import packageJSON from './package.json' assert { type: 'json' }
import * as prettier from 'prettier'

const tagPath = `v${packageJSON.version}`

async function glob(path) {
  return await baseGlob(path, {
    ignore: ['node_modules/**'],
  })
}

async function fileUpdates(fileSet, key, oldValue, newValue) {
  await Promise.all(
    fileSet.map(async (fileItem) => {
      let file = JSON.parse(
        await readFile(fileItem, {
          encoding: 'utf-8',
        })
      )
      file[key] = file[key].replace(
        `https://gcn.nasa.gov/schema/${oldValue}/`,
        `https://gcn.nasa.gov/schema/${newValue}/`
      )

      await writeFile(
        fileItem,
        prettier.format(JSON.stringify(file), {
          parser: 'json',
        })
      )
    })
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
