import fs from 'fs-extra'
import path from 'path'
import { generateMermaid } from './generators/mermaidGenerator.js'
import { generatePlantUML } from './generators/plantUMLGenerator.js'
import { exec } from 'child_process'
import { run } from "@mermaid-js/mermaid-cli"
import { __dirname } from './help.js'

export const UML_ENGINES = {
  MERMAID: 'mm',
  PLANTUML: 'puml',
}

export async function renderUML(engine, analysis, outputPath) {
  switch (engine) {
    case UML_ENGINES.MERMAID:
      const mermaidCode = generateMermaid(analysis)
      // return renderToHTML(mermaidCode, outputPath)
      return renderToSVG(mermaidCode, outputPath)
    case UML_ENGINES.PLANTUML:
      const plantUMLCode = generatePlantUML(analysis)
      return renderToPlantUML(plantUMLCode, outputPath)
    default:
      throw new Error(`Unsupported engine: ${engine}`)
  }
}

export async function renderToHTML(mermaidCode, outputPath = 'uml.html') {
  const template = `
<!DOCTYPE html>
<html>
  <body>
    <pre class="mermaid">
      ${mermaidCode}
    </pre>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <script>
      mermaid.initialize({
        startOnLoad: true,
        maxTextSize: 90000,
      })
    </script>
  </body>
</html>
`

  await fs.writeFile(outputPath, template)
  console.log(`UML rendered to ${outputPath}`)
}

// 生成 HTML 并捕获 SVG
export async function renderToSVG(mermaidCode, outputPath = 'uml.svg') {
  // 1. 生成临时 .mmd 文件
  const tempMmdPath = 'temp.mmd'
  await fs.writeFile(tempMmdPath, mermaidCode)

  const configFile = path.resolve(__dirname, '../mermaid.config.json')
  // 2. 调用 mmdc 命令行工具
  await new Promise((resolve, reject) => {
    exec(`npx mmdc -i ${tempMmdPath} -o ${outputPath} -c ${configFile}`, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

  // 3. 清理临时文件
  await fs.remove(tempMmdPath)
  console.log(`SVG saved to ${outputPath}`)
}

async function renderToPlantUML(plantUMLCode, outputPath = 'uml.puml') {
  await fs.writeFile(outputPath, plantUMLCode)
  console.log(`PlantUML rendered to ${outputPath}`)
}
