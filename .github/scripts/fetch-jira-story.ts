#!/usr/bin/env node

import { writeFileSync, mkdirSync } from 'node:fs'
import * as dotenv from 'dotenv'
import { logger } from './lib/logger.ts'

// Load environment variables
dotenv.config()
const { JIRA_EMAIL, JIRA_TOKEN, JIRA_BASE_URL } = process.env

if (!JIRA_EMAIL || !JIRA_TOKEN || !JIRA_BASE_URL) {
  logger.error('Missing environment variables: JIRA_EMAIL, JIRA_TOKEN, JIRA_BASE_URL')
  process.exit(1)
}

const jiraEmail = JIRA_EMAIL
const jiraToken = JIRA_TOKEN
const jiraBaseUrl = JIRA_BASE_URL

const ticketId = process.argv[2]?.toUpperCase().trim()
const VERBOSE = process.env.VERBOSE === 'true'

if (!ticketId) {
  logger.error('Usage: tsx fetch-jira-story.ts <JIRA_TICKET_ID>')
  logger.info('Example: tsx fetch-jira-story.ts SCRUM-1')
  process.exit(1)
}

// Validate ticket ID format (PROJECT-NUMBER)
if (!/^[A-Z]+-\d+$/.test(ticketId)) {
  logger.error(`Invalid ticket ID format: ${ticketId}`)
  logger.info('Expected format: PROJECT-NUMBER (e.g., SCRUM-1, NFAB-42)')
  process.exit(1)
}

interface JiraResponse {
  key: string
  fields: {
    summary: string
    description?: AdfContent
    issuetype: { name: string }
    status: { name: string }
    customfield_10014?: { name: string } | null
    priority?: { name: string } | null
    labels?: string[]
    created: string
    customfield_10015?: {
      content: Array<{
        type: string
        content: Array<{
          type: string
          text?: string
        }>
      }>
    } | null
    customfield_10016?: {
      content: Array<{
        type: string
        content: Array<{
          type: string
          text?: string
        }>
      }>
    } | null
    issuelinks?: Array<{
      type: { name: string }
      inwardIssue?: {
        key: string
        fields: { summary: string }
      }
      outwardIssue?: {
        key: string
        fields: { summary: string }
      }
    }>
    attachment?: Array<{
      id: string
      filename: string
      content: string
      mimeType: string
    }>
    updated: string
    project: {
      key: string
      name: string
    }
    duedate?: string | null
    [key: string]: unknown
  }
}

/**
 * Jira ADF (Atlas Document Format) mark types for text formatting.
 */
interface AdfMark {
  type: 'strong' | 'em' | 'code' | 'strike' | 'link' | 'mention' | 'underline'
  attrs?: Record<string, unknown>
}

/**
 * Jira ADF node types for rich text content.
 */
interface AdfNode {
  type: string
  text?: string
  marks?: AdfMark[]
  attrs?: Record<string, unknown>
  content?: AdfNode[]
}

/**
 * Jira ADF container with content array.
 */
interface AdfContent {
  content: AdfNode[]
}

/**
 * Recursively extract text from Jira ADF nodes with proper formatting.
 *
 * Handles all ADF node types including text, marks (bold, italic, etc.),
 * breaks, mentions, emojis, images, and nested content.
 *
 * @param node - ADF node to process
 * @returns Formatted markdown text
 */
function extractNodeText(node: AdfNode | undefined): string {
  if (!node) return ''

  switch (node.type) {
    case 'text':
      return formatTextNode(node)
    case 'softbreak':
      return ' '
    case 'hardbreak':
      return '\n'
    case 'mention':
      return formatMentionNode(node)
    case 'emoji':
      return formatEmojiNode(node)
    case 'image':
      return formatImageNode(node)
    default:
      return node.content?.map(extractNodeText).join('') ?? ''
  }
}

function formatTextNode(node: AdfNode): string {
  const text = node.text ?? ''
  return applyTextMarks(text, node.marks)
}

function applyTextMarks(text: string, marks: AdfMark[] | undefined): string {
  if (!marks || marks.length === 0) return text

  let result = text
  for (const mark of marks) {
    result = applyTextMark(result, mark)
  }
  return result
}

function applyTextMark(text: string, mark: AdfMark): string {
  switch (mark.type) {
    case 'strong':
      return `**${text}**`
    case 'em':
      return `*${text}*`
    case 'code':
      return `\`${text}\``
    case 'strike':
      return `~~${text}~~`
    case 'link': {
      const href = typeof mark.attrs?.href === 'string' ? mark.attrs.href : ''
      return `[${text}](${href})`
    }
    default:
      return text
  }
}

function formatMentionNode(node: AdfNode): string {
  const id = node.attrs?.id
  const text = node.attrs?.text
  return `@${String(id ?? text ?? '')}`
}

function formatEmojiNode(node: AdfNode): string {
  return typeof node.attrs?.shortName === 'string' ? node.attrs.shortName : ''
}

function formatImageNode(node: AdfNode): string {
  const src = typeof node.attrs?.src === 'string' ? node.attrs.src : ''
  return `![image](${src})`
}

/**
 * Convert Jira ADF (Atlas Document Format) description to markdown.
 *
 * Processes all block types including paragraphs, headings, lists, code blocks,
 * blockquotes, tables, and horizontal rules. Preserves formatting and structure.
 *
 * @param adfDoc - Jira ADF description object with content array
 * @returns Markdown-formatted text
 */
function adfToText(adfDoc: AdfContent | undefined): string {
  if (!adfDoc?.content) return ''

  const lines = adfDoc.content.flatMap(block => formatAdfBlock(block))
  return compactBlankLines(lines).join('\n')
}

function compactBlankLines(lines: string[]): string[] {
  const cleaned: string[] = []
  for (const current of lines) {
    const previous = cleaned.at(-1) ?? ''
    if (current.trim() || cleaned.length === 0 || previous.trim()) {
      cleaned.push(current)
    }
  }
  return cleaned
}

function formatAdfBlock(block: AdfNode): string[] {
  if (block.type === 'rule') return ['---']
  if (!block.content) return []

  switch (block.type) {
    case 'paragraph':
      return formatParagraph(block)
    case 'heading':
      return formatHeading(block)
    case 'bulletList':
      return formatBulletList(block)
    case 'orderedList':
      return formatOrderedList(block)
    case 'blockquote':
      return formatBlockquote(block)
    case 'codeBlock':
      return formatCodeBlock(block)
    case 'table':
      return formatTable(block)
    default:
      return []
  }
}

function formatParagraph(block: AdfNode): string[] {
  const text = block.content?.map(extractNodeText).join('') ?? ''
  return text.trim() ? [text] : []
}

function formatHeading(block: AdfNode): string[] {
  const level = (block.attrs?.level as number) || 1
  const text = block.content?.map(extractNodeText).join('') ?? ''
  return text.trim() ? ['#'.repeat(level) + ' ' + text] : []
}

function formatBulletList(block: AdfNode): string[] {
  return (block.content ?? [])
    .map(item => {
      const text = item.content?.map(extractNodeText).join('') ?? ''
      return text.trim() ? `- ${text}` : ''
    })
    .filter(Boolean)
}

function formatOrderedList(block: AdfNode): string[] {
  const lines: string[] = []
  let index = 1
  for (const item of block.content ?? []) {
    const text = item.content?.map(extractNodeText).join('') ?? ''
    if (!text.trim()) continue
    lines.push(`${index}. ${text}`)
    index++
  }
  return lines
}

function formatBlockquote(block: AdfNode): string[] {
  return (block.content ?? [])
    .map(extractNodeText)
    .filter(text => text.trim())
    .map(text => `> ${text}`)
}

function formatCodeBlock(block: AdfNode): string[] {
  const language = (block.attrs?.language as string) || ''
  const code = block.content?.map(extractNodeText).join('') ?? ''
  return code.trim() ? ['```' + language, code.trim(), '```'] : []
}

function formatTable(block: AdfNode): string[] {
  return (block.content ?? [])
    .filter(row => row.type === 'tableRow' && Boolean(row.content))
    .map(row => {
      const cells = row.content?.map(cell => cell.content?.map(extractNodeText).join('') ?? '').join(' | ') ?? ''
      return `| ${cells} |`
    })
}

/**
 * Create a safe, filesystem-friendly summary from a ticket title.
 *
 * Replaces spaces and slashes with underscores and truncates to 40 characters.
 *
 * @param summary - The ticket summary/title
 * @returns Safe summary for use in file paths
 */
function createSafeSummary(summary: string): string {
  const slug = summary
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+/g, '')
    .replaceAll(/-+$/g, '')
    .substring(0, 40)

  return slug || 'story'
}

function buildHeaderLines(input: {
  key: string
  summary: string
  jiraBaseUrl: string
  issueType: string
  status: string
  project: string
  epic: string
  priority: string
  labels: string
  created: string
  updated: string
  duedate?: string | null
  importedAt: string
}): string[] {
  return [
    `# ${input.key} - ${input.summary}`,
    '',
    '---',
    `Jira: [${input.key}](${input.jiraBaseUrl}/browse/${input.key})`,
    `Title: ${input.summary}`,
    `Type: ${input.issueType}`,
    `Status (Jira): ${input.status}`,
    `Project: ${input.project}`,
    `Epic: ${input.epic}`,
    `Priority: ${input.priority}`,
    `Labels: ${input.labels}`,
    `Created: ${input.created}`,
    `Updated: ${input.updated}`,
    ...(input.duedate ? [`Due Date: ${input.duedate}`] : []),
    `Imported: ${input.importedAt}`,
    '---',
    ''
  ]
}

function buildUserStoryLines(description: AdfContent | undefined): string[] {
  if (!description) return []
  const descriptionText = adfToText(description).trim()
  return descriptionText ? ['## User Story', '', descriptionText, ''] : []
}

interface ReferenceInput {
  links: JiraResponse['fields']['issuelinks']
  jiraBaseUrl: string
}

function buildReferenceLines(input: ReferenceInput): string[] {
  const links = input.links ?? []
  const references = links.flatMap(link => {
    const relType = link.type.name
    const lines: string[] = []
    if (link.inwardIssue) {
      lines.push(
        `- ${relType}: [${link.inwardIssue.key}](${input.jiraBaseUrl}/browse/${link.inwardIssue.key}) - ${link.inwardIssue.fields.summary}`
      )
    }
    if (link.outwardIssue) {
      lines.push(
        `- ${relType}: [${link.outwardIssue.key}](${input.jiraBaseUrl}/browse/${link.outwardIssue.key}) - ${link.outwardIssue.fields.summary}`
      )
    }
    return lines
  })

  return ['## References', '', ...references, '']
}

function buildAttachmentLines(attachments: JiraResponse['fields']['attachment']): string[] {
  const files = attachments ?? []
  if (files.length === 0) return []
  return ['## Attachments', '', ...files.map(file => `- [${file.filename}](${file.content})`), '']
}

function buildLocalSectionTemplateLines(): string[] {
  return [
    '## Acceptance Criteria',
    '',
    '_Add acceptance criteria here._',
    '',
    '## Non-Functional Requirements',
    '',
    '_Add any non-functional requirements here._',
    '',
    '## Task Breakdown',
    '',
    '_Break down the work required to complete this story._',
    '',
    '## Engineering Notes',
    '',
    '_Add implementation notes here._',
    '',
    '## Test Notes',
    '',
    '_Add testing notes and scenarios here._',
    '',
    '## Implementation Notes',
    '',
    '_Document decisions, gotchas, and important context._',
    ''
  ]
}

async function fetchJiraIssue(issueKey: string, auth: string): Promise<JiraResponse> {
  const response = await fetch(`${jiraBaseUrl}/rest/api/3/issue/${issueKey}?expand=changelog`, {
    method: 'GET',
    headers: {
      // eslint-disable-next-line @stylistic/quote-props
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ticket: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as JiraResponse
}

/**
 * Fetch a Jira ticket and write its contents to a local story.md file.
 *
 * This function:
 * 1. Authenticates to Jira using JIRA_EMAIL and JIRA_TOKEN
 * 2. Fetches the ticket metadata and description (ADF format)
 * 3. Converts ADF to Markdown
 * 4. Creates a story.md file in .backlog/-{key}-{summary}/ directory
 * 5. Includes sections for local planning (acceptance criteria, test strategy, task breakdown)
 *
 * @throws Exits with code 1 if authentication fails, ticket not found, or file write fails
 */
async function fetchAndWriteStory(): Promise<void> {
  // Fetch the Jira ticket
  const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64')
  const issue = await fetchJiraIssue(ticketId, auth)

  const {
    key,
    fields: {
      summary,
      description,
      issuetype,
      status,
      customfield_10014: epic,
      priority,
      labels,
      created,
      updated,
      project,
      duedate,
      issuelinks,
      attachment
    }
  } = issue

  // Validate required fields
  if (!issuetype?.name || !status?.name || !project?.name) {
    const missing: string[] = []
    if (!issuetype?.name) missing.push('issuetype')
    if (!status?.name) missing.push('status')
    if (!project?.name) missing.push('project')
    throw new Error(`Missing required Jira fields: ${missing.join(', ')}`)
  }

  // Create safe summary for path
  const safeSummary = createSafeSummary(summary)
  const today = new Date().toISOString().split('T')[0]
  const outputDir = `.backlog/${today}-${key}-${safeSummary}`
  const outputPath = `${outputDir}/story.md`

  // Ensure directory exists
  mkdirSync(outputDir, { recursive: true })

  const importedAt = new Date().toISOString()
  const lines: string[] = [
    ...buildHeaderLines({
      key,
      summary,
      jiraBaseUrl,
      issueType: issuetype.name,
      status: status.name,
      project: project.name,
      epic: epic?.name || 'N/A',
      priority: priority?.name || 'N/A',
      labels: labels?.join(', ') || 'N/A',
      created,
      updated,
      duedate,
      importedAt
    }),
    ...buildUserStoryLines(description),
    ...buildReferenceLines({ links: issuelinks, jiraBaseUrl }),
    ...buildAttachmentLines(attachment),
    ...buildLocalSectionTemplateLines()
  ]

  // Write to file
  writeFileSync(outputPath, lines.join('\n'))

  if (VERBOSE) {
    logger.info('Story details:')
    logger.raw(`  Key: ${key}`)
    logger.raw(`  Type: ${issuetype.name}`)
    logger.raw(`  Status: ${status.name}`)
    logger.raw(`  Project: ${project.name}`)
    logger.raw(`  Path: ${outputPath}`)
  }

  logger.success(`Story written to ${outputPath}`)
}

/**
 * Execute the main function and handle errors gracefully.
 * Logs fatal error message and exits with code 1 on failure.
 */
try {
  await fetchAndWriteStory()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  logger.error(`Fatal error: ${message}`)
  process.exit(1)
}
