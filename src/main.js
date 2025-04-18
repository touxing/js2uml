#!/usr/bin/env node
import { parseCode } from './parser.js'
import { UML_ENGINES, renderUML } from './renderer.js'
import { Command } from 'commander'

async function main() {
  const program = new Command()
    .version('1.0.0')
    .description('JavaScript 代码转 UML 图工具')
    .option(
      '-e, --engine <type>',
      `选择渲染引擎 (${UML_ENGINES.MERMAID}|${UML_ENGINES.PLANTUML}), ${UML_ENGINES.MERMAID} means mermaid, ${UML_ENGINES.PLANTUML} meams plantuml`,
      UML_ENGINES.MERMAID
    )
    .option('-i, --input <dir>', '指定输入目录')
    .option('-o, --output <file>', '指定输出文件路径')
    // 添加自动帮助显示
    .configureHelp({ showGlobalOptions: true })

  // 添加空参数检测
  if (process.argv.length === 2) {
    program.help()
  }
  program.parse(process.argv)

  const options = program.opts()
  // 自动设置默认输出文件名
  const outputFile =
    options.output ||
    (options.engine === UML_ENGINES.MERMAID ? 'uml.html' : 'uml.puml')

  const analysis = await parseCode(options.input)

  await renderUML(options.engine, analysis, outputFile)
}

main().catch(console.error)
