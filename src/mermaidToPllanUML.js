import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function mermaidToPlantUML(inputPath, outputPath) {
  const content = fs.readFileSync(inputPath, 'utf-8')

  // 匹配类定义和继承关系
  const classRegex = /class (\w+)\s*{([^}]+)}/g
  const relationRegex = /(\w+)\s+--\|>\s+(\w+)/g

  const classes = new Map()
  const relations = []

  // 解析类定义
  let match
  while ((match = classRegex.exec(content)) !== null) {
    const [_, className, methods] = match
    const cleanedMethods = methods
      .replace(/^\s*\n|\n\s*$/g, '') // 清理前后空行
      .split('\n')
      .map((line) => line.trim().replace(/^\+/, '+'))
      .filter((line) => line)
    classes.set(className, cleanedMethods)
  }

  // 解析继承关系
  while ((match = relationRegex.exec(content)) !== null) {
    relations.push([match[1], match[2]])
  }

  // 生成PlantUML
  let plantUML = '@startuml\n\n'

  // 添加类定义
  Array.from(classes.entries())
    .sort()
    .forEach(([className, methods]) => {
      plantUML += `class ${className} {\n`
      methods.forEach((method) => (plantUML += `  ${method}\n`))
      plantUML += '}\n\n'
    })

  // 添加继承关系
  relations.forEach(([child, parent]) => {
    plantUML += `${child} extends ${parent}\n`
  })

  plantUML += '\n@enduml'

  fs.writeFileSync(outputPath, plantUML)
  console.log(`转换完成，输出文件：${outputPath}`)
}

// 使用示例
mermaidToPlantUML(
  // path.join(__dirname, '../openlayersUML.html'),
  path.join(__dirname, '../uml.html'),
  path.join(__dirname, '../testUML.puml')
)
