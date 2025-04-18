import * as parser from "@babel/parser";
import traverser from "@babel/traverse";
import {generate} from "@babel/generator";

const traverse = traverser.default;

const code = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(code);

traverse(ast, {
  enter(path) {
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  },
});

// 生成新代码
const output = generate(ast);
console.log(output.code);