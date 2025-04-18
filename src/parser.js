import fs from 'fs-extra'
import path from 'path'
import { parse } from '@babel/parser'
import traverser from '@babel/traverse'
import { generate } from '@babel/generator'
import { parseJSDocAccessibility, getBabelAccess } from './help.js'

const traverse = traverser.default

const ignoreDir = ['dist']
export async function parseCode(dirPath) {
  const result = { classes: [] }

  const files = await fs.readdir(dirPath)
  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = await fs.stat(filePath)

    if (stat.isDirectory()) {
      if (!ignoreDir.includes(file)) {
        await parseCode(filePath)
      }
      continue
    }

    if (
      !/\.(js|ts)$/.test(file) ||
      file.endsWith('d.ts') ||
      file.startsWith('.')
    )
      continue

    const code = await fs.readFile(filePath, 'utf-8')
    const ast = parse(code, {
      sourceType: 'module',
      plugins: [
        'typescript',
        'classProperties',
        'decorators-legacy', // Add decorator support
        'classPrivateMethods', // Add private methods support
        'classPrivateProperties', // Add private properties support
        'logicalAssignment', // Add logical assignment operator support
        'jsdoc', // JSDoc 解析插件
      ],
      allowUndeclaredExports: true,
      attachComment: true, // 允许获取注释
    })

    traverse(ast, {
      ClassDeclaration(path) {
        const classInfo = {
          name: path.node.id.name,
          methods: [],
          properties: [],
          extends: path.node.superClass?.name,
          file: filePath,
        }

        path.traverse({
          ClassMethod(childPath) {
            // classInfo.methods.push(childPath.node.key.name)
            const accessibility = parseJSDocAccessibility(childPath)
            classInfo.methods.push({
              name: childPath.node.key.name,
              access: accessibility || getBabelAccess(childPath), // 优先使用 JSDoc 注释
            })
          },
          ClassProperty(childPath) {
            // classInfo.properties.push(childPath.node.key.name)
            const accessibility = parseJSDocAccessibility(childPath)
            classInfo.properties.push({
              name: childPath.node.key.name,
              access: accessibility || getBabelAccess(childPath),
            })
          },
        })

        result.classes.push(classInfo)
      },
    })
  }

  return result
}
