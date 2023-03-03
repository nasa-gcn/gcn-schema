import { readFile } from 'fs/promises'
import Ajv from 'ajv/dist/2019.js'
import meta from 'ajv/dist/refs/json-schema-2020-12/index.js'
import { glob } from 'glob'

const ajv = new Ajv({ verbose: true })
ajv.addMetaSchema(meta, 'https://json-schema.org/draft/2020-12/schema')

/** @param {string} path */
async function validate(path) {
  const filesInDir = await glob(path, {
    ignore: ['test/**', 'node_modules/**'],
  })

  const schemas = await Promise.all(
    filesInDir.map(async (file) =>
      JSON.parse(
        await readFile(file, {
          encoding: 'utf-8',
        })
      )
    )
  )
  try {
    ajv.addSchema(schemas).compile(true)
    let result = {}
    // Structure Validation:
    console.log(Object.keys(ajv.schemas))
    filesInDir.forEach(async (file) => {
      const testCase = JSON.parse(
        await readFile(['./test', file].join('/'), {
          encoding: 'utf-8',
        })
      )
      const pathComponents = file.split('\\')
      const schemaId = pathComponents[pathComponents.length - 1]
      // console.log(schemaId)
      // result[schemaId] = ajv.validate(schemaId, testCase)
      console.log(`Case: ${schemaId}: ${ajv.validate(schemaId, testCase)}`)
    })

    console.log(result)
  } catch (e) {
    if (e instanceof Error) {
      process.exitCode = 1
      console.error(`${path}: ${e.message}`)
    } else {
      throw e
    }
  }
}

const args = process.argv.slice(2)
await Promise.all(args.map(validate))
