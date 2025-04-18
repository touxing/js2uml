import { accessibilityMap } from '../help.js'
export function generateMermaid(analysisResult) {
  let mermaidCode = 'classDiagram\n'

  analysisResult.classes.forEach(cls => {
    mermaidCode += `\nclass ${cls.name} {\n`
    cls.properties.forEach(prop => mermaidCode += `  ${accessibilityMap[prop.access]}${prop.name}\n`)
    cls.methods.forEach(method => mermaidCode += `  ${accessibilityMap[method.access]}${method.name}()\n`)
    mermaidCode += '}'
  })

  analysisResult.classes.forEach(cls => {
    if (cls.extends) {
      mermaidCode += `\n${cls.name} --|> ${cls.extends}`
    }
  })

  return mermaidCode
}