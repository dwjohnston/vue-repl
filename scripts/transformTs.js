/* eslint-disable no-console */

/**
 *
 *
 * THIS FILE GENERATED WITH COPILOT CHAT
 *
 *
 * jscodeshift ESM transform (no recast) that:
 *  - Uses fileInfo.source provided by jscodeshift (do NOT read the file manually)
 *  - Parses with the TypeScript parser via api.jscodeshift
 *  - Removes top-level `declare` modifiers from non-import top-level declarations
 *  - Wraps those declarations in `declare module 'mylibrary' { ... }`
 *  - Writes the result to src/generated/newTypes.ts
 *
 * Run it on the types file:
 *   jscodeshift -t transform-mylibrary-types.mjs node_modules/mylibrary/dist/types.d.ts
 *
 * Note: this version avoids api.recast entirely (recast was undefined). It uses
 * j(node).toSource() to print nodes instead.
 */
import fs from 'fs'
import path from 'path'

export default function transform(fileInfo, api, options) {
  const j = api.jscodeshift.withParser('ts')

  // Use the source passed into the transform (don't read the file manually).
  const src = fileInfo.source

  // Parse into a collection and get the program body
  const root = j(src)
  const rootNode = root.get && root.get().node
  if (!rootNode || !rootNode.program || !Array.isArray(rootNode.program.body)) {
    // If parsing failed or no body, bail out and don't modify the input file.
    console.error(
      '[transform-mylibrary-types] could not parse input or empty program body',
    )
    return fileInfo.source
  }
  const body = rootNode.program.body

  const importNodes = []
  const declNodes = []

  for (const node of body) {
    if (!node) continue
    if (node.type === 'ImportDeclaration') {
      importNodes.push(node)
      continue
    }

    // Remove top-level declare flags when present on nodes
    if ('declare' in node) {
      try {
        delete node.declare
      } catch (e) {
        // ignore if read-only
      }
    }

    // Also handle ExportNamedDeclaration wrapping a declaration that might have `declare`
    if (
      node.type === 'ExportNamedDeclaration' &&
      node.declaration &&
      'declare' in node.declaration
    ) {
      try {
        delete node.declaration.declare
      } catch (e) {}
    }

    declNodes.push(node)
  }

  // Print imports and declarations using j(node).toSource() so we don't rely on recast
  const printedImports = importNodes.map((n) => j(n).toSource()).join('\n')
  const printedDecls = declNodes
    .map((n) => j(n).toSource())
    .map((s) => {
      // Remove leading "declare " (or "export declare ") only at the start of the printed declaration.
      s = s.replace(/^(\s*export\s+)declare\s+/, '$1')
      s = s.replace(/^\s*declare\s+/, '')
      return s.trim()
    })
    .filter(Boolean)

  // Join declarations with a blank line between each
  const moduleInner = printedDecls.join('\n\n')

  // Indent module body for readability
  const indent = (text, n = 2) => {
    if (!text) return ''
    const pad = ' '.repeat(n)
    return text
      .split('\n')
      .map((line) => (line ? pad + line : ''))
      .join('\n')
  }

  const moduleBody = indent(moduleInner, 4) // 4-space indent

  // Assemble final output text
  const parts = []
  parts.push("declare module 'mylibrary' {")
  if (moduleBody) {
    parts.push(printedImports)
    parts.push('') // blank line
    parts.push('')
    parts.push(moduleBody)
    parts.push('')
  }
  parts.push('}')
  parts.push('') // trailing newline

  const output = parts.join('\n')

  // Write file to src/generated/newTypes.ts
  const outputPath = path.resolve(
    process.cwd(),
    'src',
    'generated',
    'designSystemTypes.ts',
  )
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, output, 'utf8')
  console.log(
    `[transform-mylibrary-types] Wrote generated types to: ${outputPath}`,
  )

  // Do not modify the file jscodeshift invoked this transform on
  return fileInfo.source
}
