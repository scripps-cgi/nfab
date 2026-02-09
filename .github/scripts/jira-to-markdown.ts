#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { exit } from 'node:process'
import { logger } from './lib/logger.ts'

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

  return doc.content.map(node => nodeToMarkdown(node)).join('\n')
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
      return (node.content || []).map(item => listItemToMarkdown(item as ContentNode, '- ', 0)).join('')

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
      const quoted = (node.content || []).map(n => nodeToMarkdown(n as ContentNode)).join('\n')
      return quoted
        .split('\n')
        .map(line => `> ${line}`)
        .join('\n')
    }

    case 'horizontalRule':
      return '---'

    default:
      return (node.content || []).map(n => nodeToMarkdown(n as ContentNode)).join('\n')
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
    .map(node => {
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
    .map(node => {
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
function extractHeadlineLine(content: string): string {
  const headlineMatch = content.match(/^#+\s+(.+?)$/m)
  return headlineMatch ? headlineMatch[0] : ''
}

function extractMetadataHeader(content: string): Record<string, string> {
  const metadata: Record<string, string> = {}
  const metadataMatch = content.match(/^---\n([\s\S]*?)\n---\n/m)
  if (!metadataMatch) return metadata

  const metadataLines = metadataMatch[1].split('\n')
  for (const line of metadataLines) {
    const colonIndex = line.indexOf(': ')
    if (colonIndex <= 0) continue
    const key = line.substring(0, colonIndex)
    const value = line.substring(colonIndex + 2)
    metadata[key] = value
  }

  return metadata
}

function extractJsonPayload(content: string): string {
  const codeBlockMatch = content.match(/```(?:mdc|json)?\s*\n([\s\S]*?)\n```/)
  if (codeBlockMatch) return codeBlockMatch[1].trim()

  const jsonLineMatch = content.match(/\n(\{[\s\S]*\})\s*$/m)
  return jsonLineMatch ? jsonLineMatch[1].trim() : content
}

function stripHeadlineAndMetadata(content: string): string {
  return content
    .replace(/^#+\s+.+\n+/, '')
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .trim()
}

function prosemirrorJsonToMarkdown(jsonStr: string): string {
  if (!jsonStr.startsWith('{')) {
    throw new Error('No JSON payload found')
  }

  const doc: ProsemirrorDoc = JSON.parse(jsonStr)
  return prosemirrorToMarkdown(doc)
}

function buildOutputMarkdown(input: { headline: string; metadata: Record<string, string>; markdown: string }): string {
  const lines: string[] = []

  if (input.headline) {
    lines.push(input.headline, '')
  }

  if (Object.keys(input.metadata).length > 0) {
    lines.push(
      '---',
      `Jira: ${input.metadata['Jira'] || ''}`,
      `Title: ${input.metadata['Title'] || ''}`,
      `Type: ${input.metadata['Type'] || ''}`,
      `Status (Jira): ${input.metadata['Status (Jira)'] || ''}`,
      `Epic: ${input.metadata['Epic'] || ''}`,
      `Priority: ${input.metadata['Priority'] || ''}`,
      `Labels: ${input.metadata['Labels'] || ''}`,
      `Created: ${input.metadata['Created'] || ''}`,
      `Imported: ${input.metadata['Imported'] || ''}`,
      '---',
      ''
    )
  }

  const body = input.markdown.trim()
  if (body) {
    lines.push('## User Story', '', input.markdown.endsWith('\n') ? input.markdown.trimEnd() : input.markdown)
  }

  return lines.join('\n') + '\n'
}

async function convertFileOrThrow(inputPath: string, outputPath?: string): Promise<string> {
  const content = await readFile(inputPath, 'utf8')
  const headline = extractHeadlineLine(content)
  const metadata = extractMetadataHeader(content)

  const jsonStr = extractJsonPayload(content)
  let markdown = ''

  try {
    markdown = prosemirrorJsonToMarkdown(jsonStr)
  } catch (parseError) {
    const message = parseError instanceof Error ? parseError.message : String(parseError)
    logger.warn(`Failed to parse Prosemirror JSON: ${message}`)
    logger.warn('Using raw content as fallback')
    markdown = stripHeadlineAndMetadata(content)
  }

  const output = buildOutputMarkdown({ headline, metadata, markdown })
  const finalOutputPath = outputPath || inputPath
  await writeFile(finalOutputPath, output, 'utf8')

  if (outputPath) {
    logger.success(`Converted → ${finalOutputPath}`)
  } else {
    logger.success(`Converted: ${finalOutputPath}`)
  }

  return output
}

async function convertFile(inputPath: string, outputPath?: string): Promise<string> {
  try {
    return await convertFileOrThrow(inputPath, outputPath)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logger.error(`Error converting file: ${message}`)
    exit(1)
  }
}

// CLI usage
const isMainModule = import.meta.url.startsWith('file://') && import.meta.url === `file://${process.argv[1]}`

if (isMainModule) {
  const args = process.argv.slice(2)

  if (args.length < 1) {
    logger.error('Usage: tsx jira-to-markdown.ts <file> [output-file]')
    logger.info('Examples:')
    logger.info('tsx scripts/jira-to-markdown.ts input.md', { indent: 2 })
    logger.info('tsx scripts/jira-to-markdown.ts input.md output.md', { indent: 2 })
    exit(1)
  }

  const inputFile = resolve(args[0])
  const outputFile = args[1] ? resolve(args[1]) : undefined

  await convertFile(inputFile, outputFile)
}

export { prosemirrorToMarkdown, convertFile }
