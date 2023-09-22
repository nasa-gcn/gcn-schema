import { readFile } from 'fs/promises'
import Ajv from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import meta from 'ajv/dist/refs/json-schema-2020-12/index.js'
import { glob as baseGlob } from 'glob'

const ajv = new Ajv({
  validateSchema: true,
  verbose: true,
  allowUnionTypes: true,
})
addFormats(ajv)
ajv.addMetaSchema(meta)

async function glob(path) {
  return await baseGlob(path, {
    ignore: ['test/**', 'node_modules/**'],
  })
}

/** @param {string} path */
async function validate(path) {
  const schemaFilenames = await glob('**/*.schema.json')
  const schemas = await Promise.all(
    schemaFilenames.map(async (match) =>
      JSON.parse(
        await readFile(match, {
          encoding: 'utf-8',
        })
      )
    )
  )

  try {
    ajv.addSchema(schemas).compile(true)
  } catch (e) {
    if (e instanceof Error) {
      process.exitCode = 1
      console.error(`error: ${e.message}`)
    } else {
      throw e
    }
  }

  const exampleFilenames = await glob('**/*.example.json')
  await Promise.all(
    exampleFilenames.map(async (path) => {
      const example = JSON.parse(
        await readFile(path, {
          encoding: 'utf-8',
        })
      )

      const schemaId = example['$schema']
      if (!schemaId) {
        process.exitCode = 1
        console.error(`error: ${path}: missing required $schema property`)
        return
      }

      try {
        ajv.validate(schemaId, example)
      } catch (e) {
        if (e instanceof Error) {
          process.exitCode = 1
          console.error(`error: ${path}: ${e.message}`)
        } else {
          throw e
        }
      }

      if (ajv.errors) {
        console.log(JSON.stringify(ajv.errors, null, 2))
        process.exitCode = 1
      }
    })
  )
}

await validate()
