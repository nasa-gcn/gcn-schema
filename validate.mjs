import { readFile } from 'fs/promises'
import Ajv from 'ajv/dist/2019.js'
import meta from 'ajv/dist/refs/json-schema-2020-12/index.js'

const ajv = new Ajv({ verbose: true })
ajv.addMetaSchema(meta, 'https://json-schema.org/draft/2020-12/schema')

/** @param {string} path */
async function validate(path) {
  const text = await readFile(path, { encoding: 'utf-8' })
  const schema = JSON.parse(text)
  try {
    ajv.compile(schema)
    return true
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
