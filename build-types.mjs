import { glob } from 'glob'
import { readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { mkdir } from 'node:fs/promises'
import prettier from 'prettier'

const jsonExtension = '.schema.json'
const tsExtension = '.d.ts'

function unique(array) {
  return [...new Set(array)]
}

function jsonFilenameToTypeName(filename) {
  return basename(filename, jsonExtension)
}

// Recursively find all of the references in a JSON schema.
function findRefs(obj) {
  if (obj === undefined || typeof obj === 'string') {
    return []
  } else if (obj instanceof Array) {
    return obj.flatMap(findRefs)
  } else if (obj.hasOwnProperty('$ref') && /^\.{1,2}\//.test(obj['$ref'])) {
    return [obj['$ref']]
  } else {
    return findRefs(Object.values(obj))
  }
}

async function compileAndWrite(path) {
  const jsonText = await readFile(path, { encoding: 'utf8' })
  const json = JSON.parse(jsonText)
  const typeName = jsonFilenameToTypeName(path)
  const tsDir = dirname(path)
  const tsPath = join(tsDir, `${typeName}${tsExtension}`)
  const refs = unique(findRefs(json))
  const imports = refs
    .map(
      (ref, i) =>
        `import { schema as schema${i} } from './${join(
          dirname(ref),
          jsonFilenameToTypeName(ref)
        )}';`
    )
    .join('\n')
  const references = refs
    .map((ref, i) => `Omit<typeof schema${i}, '$id'> & {'$id': '${ref}'}`)
    .join(',')

  const src = await prettier.format(
    `
    import { FromSchema } from 'json-schema-to-ts';
    ${imports}
    export declare const schema: ${jsonText.trim()};
    export type ${typeName} = FromSchema<typeof schema, {references: [${references}]}>;
    export default ${typeName};
  `,
    { filepath: tsPath }
  )

  await mkdir(tsDir, { recursive: true })
  await writeFile(tsPath, src)
}

await Promise.all(
  (
    await glob(`**/*${jsonExtension}`, {
      ignore: ['test/**', 'node_modules/**'],
    })
  ).map(compileAndWrite)
)
