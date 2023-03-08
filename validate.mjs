import { readFile } from 'fs/promises'
import Ajv from 'ajv/dist/2019.js'
import meta from 'ajv/dist/refs/json-schema-2020-12/index.js'
import { glob as baseGlob } from 'glob'

const ajv = new Ajv({ validateSchema: true, verbose: true })
ajv.addMetaSchema(meta, 'https://json-schema.org/draft/2020-12/schema')

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
        process.exitCode = 1
        ajv.errors.forEach(({ message }) =>
          console.error(`error: ${path}: ${message}`)
        )
      }
    })
  )
}

await validate()
