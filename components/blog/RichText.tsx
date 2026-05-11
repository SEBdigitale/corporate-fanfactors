import type { PayloadBlogPost } from '@/types/payload-content'

import styles from './Blog.module.css'

type RichTextProps = {
  body: PayloadBlogPost['body']
}

type LexicalNode = {
  children?: LexicalNode[]
  tag?: string
  text?: string
  type?: string
}

export function RichText({ body }: RichTextProps) {
  const nodes = (body.root.children ?? []) as LexicalNode[]

  return (
    <div className={styles.article}>
      {nodes.map((node, index) => (
        <RichTextNode key={index} node={node} />
      ))}
    </div>
  )
}

function RichTextNode({ node }: { node: LexicalNode }) {
  const text = collectText(node)

  if (!text) {
    return null
  }

  if (node.type === 'heading' && node.tag === 'h2') {
    return <h2>{text}</h2>
  }

  if (node.type === 'heading' && node.tag === 'h3') {
    return <h3>{text}</h3>
  }

  return <p>{text}</p>
}

function collectText(node: LexicalNode): string {
  if (typeof node.text === 'string') {
    return node.text
  }

  return node.children?.map(collectText).join(' ').trim() ?? ''
}
