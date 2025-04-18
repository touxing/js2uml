import {fileURLToPath} from 'url'
import path from 'path'
export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

export function parseJSDocAccessibility(path) {
  return path.node.leadingComments?.reduce((acc, comment) => {
    if (comment.type === 'CommentBlock') {
      const matches = comment.value.match(/@(public|private|protected)/)
      return matches ? matches[1] : acc
    }
    return acc
  }, null)
}

export function getBabelAccess(path) {
  return path.node.accessibility || 'public'
}

export const accessibilityMap = {
  public: '+',
  private: '-',
  protected: '#',
}