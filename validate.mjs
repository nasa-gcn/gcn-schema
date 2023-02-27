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
  ajv.addSchema(schemas).compile(true)
  return true
}

const args = process.argv.slice(2)
await Promise.all(args.map(validate))
