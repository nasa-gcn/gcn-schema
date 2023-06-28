import { readFile, writeFile } from 'fs/promises'
import { execSync } from 'child_process'
import { glob as baseGlob } from 'glob'

const version = JSON.parse(await readFile('package.json')).version
if (!/[0-9]+\.[0-9]+\.[0-9]+.*/.test(version)) {
  process.exit()
}
const tagPath = `/v${version}/`

async function glob(path) {
  return await baseGlob(path, {
    ignore: ['test/**', 'node_modules/**'],
  })
}

function searchForAndUpdateRefs(object, oldValue, newValue) {
  for (let key in object) {
    if (key == '$ref' && !object[key].startsWith('#')) {
      object[key] = object[key].replace(oldValue, newValue)
    } else if (
      (typeof object[key] == 'object' || typeof object[key] == 'array') &&
      object[key] !== null
    ) {
      searchForAndUpdateRefs(object[key], oldValue, newValue)
    }
  }
}

async function loadAndUpdateFiles(oldValue, newValue) {
  const schemaFilenames = await glob('**/*.schema.json')
  await Promise.all(
    schemaFilenames.map(async (match) => {
      let schema = JSON.parse(
        await readFile(match, {
          encoding: 'utf-8',
        })
      )

      schema['$id'] = schema['$id'].replace(oldValue, newValue)
      // searchForAndUpdateRefs(schema, oldValue, newValue)
      await writeFile(match, JSON.stringify(schema, null, 2))
    })
  )
  const exampleFilenames = await glob('**/*.example.json')
  await Promise.all(
    exampleFilenames.map(async (path) => {
      const example = JSON.parse(
        await readFile(path, {
          encoding: 'utf-8',
        })
      )
      example['$schema'] = example['$schema'].replace(oldValue, newValue)
      await writeFile(path, JSON.stringify(example, null, 2))
    })
  )
}

if (process.argv.some((x) => x == '--reset')) {
  await loadAndUpdateFiles(tagPath, '/main/')
} else {
  await loadAndUpdateFiles('/main/', tagPath)
}

execSync('npx prettier -w .')
