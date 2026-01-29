#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { exit } from 'node:process'

/**
 * Prosemirror node types
 */
interface TextNode {
  type: 'text'
  text: string
  marks?: Mark[]
}

interface HardBreakNode {
  type: 'hardBreak'
}

interface ContentNode {
  type: string
  content?: (TextNode | HardBreakNode | ContentNode)[]
  attrs?: Record<string, unknown>
  text?: string
  marks?: Mark[]
}

interface Mark {
  type: 'strong' | 'em' | 'code' | 'link' | 'strikethrough'
  attrs?: Record<string, unknown>
}

interface ProsemirrorDoc {
  type: 'doc'
  version: number
  content?: ContentNode[]
}

/**
 * Converts Prosemirror JSON content to markdown
 */
function prosemirrorToMarkdown(doc: ProsemirrorDoc): string {
  if (!doc || !doc.content) {
    return ''
  }

  return doc.content.map((node) => nodeToMarkdown(node)).join('\n')
}

/**
 * Converts a single Prosemirror node to markdown
 */
function nodeToMarkdown(node: ContentNode): string {
  switch (node.type) {
    case 'paragraph':
      return contentToMarkdown(node.content || [])

    case 'heading': {
      const level = (node.attrs?.level as number) || 1
      const hashes = '#'.repeat(level)
      return `${hashes} ${contentToMarkdown(node.content || [])}`
    }

    case 'bulletList':
      return (node.content || []).map((item) => listItemToMarkdown(item as ContentNode, '- ', 0)).join('')

    case 'orderedList': {
      const order = (node.attrs?.order as number) || 1
      return (node.content || [])
        .map((item, index) => listItemToMarkdown(item as ContentNode, `${order + index}. `, 0))
        .join('')
    }

    case 'codeBlock': {
      const code = contentToPlainText(node.content || [])
      const language = (node.attrs?.language as string) || ''
      return `\`\`\`${language}\n${code}\n\`\`\``
    }

    case 'blockquote': {
      const quoted = (node.content || []).map((n) => nodeToMarkdown(n as ContentNode)).join('\n')
      return quoted
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n')
    }

    case 'horizontalRule':
      return '---'

    default:
      return (node.content || []).map((n) => nodeToMarkdown(n as ContentNode)).join('\n')
  }
}

/**
 * Converts list item content to markdown with proper indentation
 */
function listItemToMarkdown(item: ContentNode, prefix: string, indent: number): string {
  const indentStr = '  '.repeat(indent)
  const firstParagraph = item.content?.[0]

  if (!firstParagraph) {
    return `${indentStr}${prefix}\n`
  }

  const firstContent = contentToMarkdown((firstParagraph as ContentNode).content || [])
  let result = `${indentStr}${prefix}${firstContent}\n`

  // Handle nested lists and remaining paragraphs
  if (item.content && item.content.length > 1) {
    for (let i = 1; i < item.content.length; i++) {
      const node = item.content[i] as ContentNode
      if (node.type === 'bulletList' || node.type === 'orderedList') {
        const nestedItems = (node.content || []) as ContentNode[]
        const isOrdered = node.type === 'orderedList'
        const order = (node.attrs?.order as number) || 1

        nestedItems.forEach((nestedItem, index) => {
          const nestedPrefix = isOrdered ? `${order + index}. ` : '- '
          result += listItemToMarkdown(nestedItem, nestedPrefix, indent + 1)
        })
      } else if (node.type === 'paragraph') {
        const content = contentToMarkdown(node.content || [])
        result += `${indentStr}  ${content}\n`
      }
    }
  }

  return result
}

/**
 * Converts inline content to markdown
 */
function contentToMarkdown(content: ContentNode[]): string {
  if (!content) return ''

  return content
    .map((node) => {
      if (node.type === 'text') {
        const textNode = node as TextNode
        let text = textNode.text || ''

        if (textNode.marks?.length) {
          for (const mark of textNode.marks) {
            switch (mark.type) {
              case 'strong':
                text = `**${text}**`
                break
              case 'em':
                text = `_${text}_`
                break
              case 'code':
                text = `\`${text}\``
                break
              case 'link':
                text = `[${text}](${(mark.attrs?.href as string) || ''})`
                break
              case 'strikethrough':
                text = `~~${text}~~`
                break
            }
          }
        }

        return text
      } else if (node.type === 'hardBreak') {
        return '\n'
      }

      return ''
    })
    .join('')
}

/**
 * Converts content to plain text (for code blocks, etc)
 */
function contentToPlainText(content: ContentNode[]): string {
  if (!content) return ''

  return content
    .map((node) => {
      if (node.type === 'text') {
        return (node as TextNode).text || ''
      }
      return ''
    })
    .join('')
}

/**
 * Main conversion function
 */
async function convertFile(inputPath: string, outputPath?: string): Promise<string> {
  try {
    // Read the input file
    const content = await readFile(inputPath, 'utf8')

    // Extract headline
    const headlineMatch = content.match(/^#+\s+(.+?)$/m)
    const headline = headlineMatch ? headlineMatch[0] : ''

    // Extract metadata header (between --- markers)
    const metadata: Record<string, string> = {}
    const metadataMatch = content.match(/^---\n([\s\S]*?)\n---\n/m)
    if (metadataMatch) {
      const metadataLines = metadataMatch[1].split('\n')
      for (const line of metadataLines) {
        // Find first ': ' occurrence to split key and value
        const colonIndex = line.indexOf(': ')
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex)
          const value = line.substring(colonIndex + 2)
          metadata[key] = value
        }
      }
    }

    // Parse JSON - handle multiple formats:
    // 1. JSON inside code blocks: ```...JSON...```
    // 2. JSON directly in file
    let jsonStr = content

    // Try to extract from code block first
    const codeBlockMatch = content.match(/```(?:mdc|json)?\s*\n([\s\S]*?)\n```/)
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim()
    } else {
      // Try to extract JSON from line starting with {
      const jsonLineMatch = content.match(/\n(\{[\s\S]*\})\s*$/m)
      if (jsonLineMatch) {
        jsonStr = jsonLineMatch[1].trim()
      }
    }

    let doc: ProsemirrorDoc | null = null
    let markdown = ''

    // Only parse Prosemirror if we found valid JSON
    if (jsonStr.startsWith('{')) {
      try {
        doc = JSON.parse(jsonStr)
        if (doc) {
          markdown = prosemirrorToMarkdown(doc)
        }
      } catch (parseError) {
        // If JSON is not valid, treat content after metadata as the body
        const message = parseError instanceof Error ? parseError.message : String(parseError)
        console.warn(`⚠ Failed to parse Prosemirror JSON: ${message}`)
        console.warn('⚠ Using raw content as fallback')
        markdown = content
          .replace(/^#+\s+.+\n+/, '') // Remove headline
          .replace(/^---\n[\s\S]*?\n---\n/, '') // Remove metadata
          .trim()
      }
    } else {
      // No JSON found, use content as-is
      markdown = content
        .replace(/^#+\s+.+\n+/, '') // Remove headline
        .replace(/^---\n[\s\S]*?\n---\n/, '') // Remove metadata
        .trim()
    }

    // Build the final markdown with proper structure
    let output = ''

    // Add headline
    if (headline) {
      output += `${headline}\n\n`
    }

    // Add metadata header
    if (Object.keys(metadata).length > 0) {
      output += '---\n'
      // Jira field is already formatted as a markdown link by the GitHub action
      output += `Jira: ${metadata['Jira'] || ''}\n`
      output += `Title: ${metadata['Title'] || ''}\n`
      output += `Type: ${metadata['Type'] || ''}\n`
      output += `Status (Jira): ${metadata['Status (Jira)'] || ''}\n`
      output += `Epic: ${metadata['Epic'] || ''}\n`
      output += `Priority: ${metadata['Priority'] || ''}\n`
      output += `Labels: ${metadata['Labels'] || ''}\n`
      output += `Created: ${metadata['Created'] || ''}\n`
      output += `Imported: ${metadata['Imported'] || ''}\n`
      output += '---\n\n'
    }

    // Add body content (Jira description maps to ## User Story section)
    if (markdown && markdown.trim() !== '') {
      output += '## User Story\n\n'
      output += markdown
      if (!markdown.endsWith('\n')) {
        output += '\n'
      }
    }

    // Write output (default to input path if not specified)
    const finalOutputPath = outputPath || inputPath
    await writeFile(finalOutputPath, output, 'utf8')
    const action = outputPath ? '→' : '✓ Converted:'
    console.log(`${action} ${finalOutputPath}`)

    return output
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`✗ Error converting file:`, message)
    exit(1)
  }
}

// CLI usage
const isMainModule = import.meta.url.startsWith('file://') && import.meta.url === `file://${process.argv[1]}`

if (isMainModule) {
  const args = process.argv.slice(2)

  if (args.length < 1) {
    console.error('Usage: tsx jira-to-markdown.ts <file> [output-file]')
    console.error('')
    console.error('Examples:')
    console.error('  # Convert in-place (overwrites input):')
    console.error('  tsx scripts/jira-to-markdown.ts input.md')
    console.error('')
    console.error('  # Convert to separate file:')
    console.error('  tsx scripts/jira-to-markdown.ts input.md output.md')
    exit(1)
  }

  const inputFile = resolve(args[0])
  const outputFile = args[1] ? resolve(args[1]) : undefined

  await convertFile(inputFile, outputFile)
}

export { prosemirrorToMarkdown, convertFile }
