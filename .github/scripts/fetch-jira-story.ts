#!/usr/bin/env node

import { writeFileSync, mkdirSync } from 'node:fs'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const JIRA_EMAIL = process.env.JIRA_EMAIL
const JIRA_TOKEN = process.env.JIRA_TOKEN
const JIRA_BASE_URL = process.env.JIRA_BASE_URL

if (!JIRA_EMAIL || !JIRA_TOKEN || !JIRA_BASE_URL) {
  console.error('Missing environment variables: JIRA_EMAIL, JIRA_TOKEN, JIRA_BASE_URL')
  process.exit(1)
}

const ticketId = process.argv[2]?.toUpperCase().trim()
const VERBOSE = process.env.VERBOSE === 'true'

if (!ticketId) {
  console.error('Usage: tsx fetch-jira-story.ts <JIRA_TICKET_ID>')
  console.error('\nExample: tsx fetch-jira-story.ts SCRUM-1')
  process.exit(1)
}

// Validate ticket ID format (PROJECT-NUMBER)
if (!/^[A-Z]+-\d+$/.test(ticketId)) {
  console.error(`❌ Invalid ticket ID format: ${ticketId}`)
  console.error('Expected format: PROJECT-NUMBER (e.g., SCRUM-1, NFAB-42)')
  process.exit(1)
}

interface JiraResponse {
  key: string
  fields: {
    summary: string
    description?: {
      content: Array<{
        type: string
        content: Array<{
          type: string
          text?: string
          content?: Array<{ text?: string }>
        }>
      }>
    }
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
      inwardIssue?: { key: string; fields: { summary: string } }
      outwardIssue?: { key: string; fields: { summary: string } }
    }>
    attachment?: Array<{
      id: string
      filename: string
      content: string
      mimeType: string
    }>
    updated: string
    project: { key: string; name: string }
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
 * @param depth - Current recursion depth (for debugging)
 * @returns Formatted markdown text
 */
function extractNodeText(node: AdfNode | undefined, depth: number = 0): string {
  if (!node) return ''

  // Handle text nodes
  if (node.type === 'text') {
    let text = node.text || ''
    // Apply text formatting if present
    if (node.marks) {
      for (const mark of node.marks) {
        if (mark.type === 'strong') text = `**${text}**`
        if (mark.type === 'em') text = `*${text}*`
        if (mark.type === 'code') text = `\`${text}\``
        if (mark.type === 'strike') text = `~~${text}~~`
        if (mark.type === 'link') {
          const href = mark.attrs?.href || ''
          text = `[${text}](${href})`
        }
      }
    }
    return text
  }

  // Handle breaks
  if (node.type === 'softbreak') return ' '
  if (node.type === 'hardbreak') return '\n'

  // Handle mentions
  if (node.type === 'mention') {
    return `@${node.attrs?.id || node.attrs?.text || ''}`
  }

  // Handle emojis
  if (node.type === 'emoji') {
    return node.attrs?.shortName || ''
  }

  // Handle inline images
  if (node.type === 'image') {
    return `![image](${node.attrs?.src || ''})`
  }

  // Handle nested content
  if (node.content && Array.isArray(node.content)) {
    return node.content.map((child: AdfNode) => extractNodeText(child, depth + 1)).join('')
  }

  return ''
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
  if (!adfDoc || !adfDoc.content) return ''

  const lines: string[] = []

  for (const block of adfDoc.content) {
    if (block.type === 'paragraph' && block.content) {
      const text = block.content.map((node: AdfNode) => extractNodeText(node)).join('')
      if (text.trim()) {
        lines.push(text)
      }
    } else if (block.type === 'heading' && block.content) {
      const level = (block.attrs?.level as number) || 1
      const headingText = block.content.map((node: AdfNode) => extractNodeText(node)).join('')
      if (headingText.trim()) {
        lines.push('#'.repeat(level) + ' ' + headingText)
      }
    } else if (block.type === 'bulletList' && block.content) {
      for (const item of block.content) {
        if (item.content) {
          const text = item.content.map((node: AdfNode) => extractNodeText(node)).join('')
          if (text.trim()) {
            lines.push(`- ${text}`)
          }
        }
      }
    } else if (block.type === 'orderedList' && block.content) {
      let index = 1
      for (const item of block.content) {
        if (item.content) {
          const text = item.content.map((node: AdfNode) => extractNodeText(node)).join('')
          if (text.trim()) {
            lines.push(`${index}. ${text}`)
            index++
          }
        }
      }
    } else if (block.type === 'blockquote' && block.content) {
      for (const node of block.content) {
        const text = extractNodeText(node)
        if (text.trim()) {
          lines.push(`> ${text}`)
        }
      }
    } else if (block.type === 'codeBlock' && block.content) {
      const language = (block.attrs?.language as string) || ''
      const code = block.content.map((node: AdfNode) => extractNodeText(node)).join('')
      if (code.trim()) {
        lines.push('```' + language)
        lines.push(code.trim())
        lines.push('```')
      }
    } else if (block.type === 'rule') {
      lines.push('---')
    } else if (block.type === 'table' && block.content) {
      // Handle table rows
      for (const row of block.content) {
        if (row.type === 'tableRow' && row.content) {
          const cells = row.content
            .map((cell: AdfNode) => {
              if (cell.content) {
                return cell.content.map((node: AdfNode) => extractNodeText(node)).join('')
              }
              return ''
            })
            .join(' | ')
          lines.push(`| ${cells} |`)
        }
      }
    }
  }

  // Clean up multiple consecutive blank lines
  const cleaned: string[] = []
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() || i === 0 || lines[i - 1].trim()) {
      cleaned.push(lines[i])
    }
  }

  return cleaned.join('\n')
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
  return summary.replace(/[/\s]+/g, '_').substring(0, 40)
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
  try {
    // Fetch the Jira ticket
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64')

    const response = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/${ticketId}?expand=changelog`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error(`Failed to fetch ticket: ${response.status} ${response.statusText}`)
      process.exit(1)
    }

    const issue: JiraResponse = await response.json()

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
      console.error('❌ Missing required Jira fields')
      if (!issuetype?.name) console.error('  - issuetype')
      if (!status?.name) console.error('  - status')
      if (!project?.name) console.error('  - project')
      process.exit(1)
    }

    // Create safe summary for path
    const safeSummary = createSafeSummary(summary)
    const today = new Date().toISOString().split('T')[0]
    const outputDir = `.backlog/${today}-${key}-${safeSummary}`
    const outputPath = `${outputDir}/story.md`

    // Ensure directory exists
    mkdirSync(outputDir, { recursive: true })

    // Build markdown content
    const lines: string[] = []

    // Title
    lines.push(`# ${key} - ${summary}`)
    lines.push('')

    // Metadata header
    lines.push('---')
    lines.push(`Jira: [${key}](${JIRA_BASE_URL}/browse/${key})`)
    lines.push(`Title: ${summary}`)
    lines.push(`Type: ${issuetype?.name || 'N/A'}`)
    lines.push(`Status (Jira): ${status?.name || 'N/A'}`)
    lines.push(`Project: ${project?.name || 'N/A'}`)
    lines.push(`Epic: ${epic?.name || 'N/A'}`)
    lines.push(`Priority: ${priority?.name || 'N/A'}`)
    lines.push(`Labels: ${labels?.join(', ') || 'N/A'}`)
    lines.push(`Created: ${created}`)
    lines.push(`Updated: ${updated}`)
    if (duedate) {
      lines.push(`Due Date: ${duedate}`)
    }
    lines.push(`Imported: ${new Date().toISOString()}`)
    lines.push('---')
    lines.push('')

    // Description / User Story
    if (description) {
      const descriptionText = adfToText(description)
      if (descriptionText.trim()) {
        lines.push('## User Story')
        lines.push('')
        lines.push(descriptionText)
        lines.push('')
      }
    }

    // Issue Links / References
    if (issuelinks && issuelinks.length > 0) {
      const references: string[] = []
      for (const link of issuelinks) {
        const relType = link.type.name
        if (link.inwardIssue) {
          references.push(
            `- ${relType}: [${link.inwardIssue.key}](${JIRA_BASE_URL}/browse/${link.inwardIssue.key}) - ${link.inwardIssue.fields.summary}`
          )
        }
        if (link.outwardIssue) {
          references.push(
            `- ${relType}: [${link.outwardIssue.key}](${JIRA_BASE_URL}/browse/${link.outwardIssue.key}) - ${link.outwardIssue.fields.summary}`
          )
        }
      }
      if (references.length > 0) {
        lines.push('## References')
        lines.push('')
        lines.push(...references)
        lines.push('')
      }
    }

    // Attachments
    if (attachment && attachment.length > 0) {
      lines.push('## Attachments')
      lines.push('')
      for (const file of attachment) {
        lines.push(`- [${file.filename}](${file.content})`)
      }
      lines.push('')
    }

    // Acceptance Criteria section (local editing)
    lines.push('## Acceptance Criteria')
    lines.push('')
    lines.push('_Add acceptance criteria here._')
    lines.push('')

    // Non-Functional Requirements section (local editing)
    lines.push('## Non-Functional Requirements')
    lines.push('')
    lines.push('_Add any non-functional requirements here._')
    lines.push('')

    // Task Breakdown section (local only)
    lines.push('## Task Breakdown')
    lines.push('')
    lines.push('_Break down the work required to complete this story._')
    lines.push('')

    // Engineering notes section (local only)
    lines.push('## Engineering Notes')
    lines.push('')
    lines.push('_Add implementation notes here._')
    lines.push('')

    // Test Notes section (local only)
    lines.push('## Test Notes')
    lines.push('')
    lines.push('_Add testing notes and scenarios here._')
    lines.push('')

    // Implementation Notes section (local only)
    lines.push('## Implementation Notes')
    lines.push('')
    lines.push('_Document decisions, gotchas, and important context._')
    lines.push('')

    // Write to file
    writeFileSync(outputPath, lines.join('\n'))

    if (VERBOSE) {
      console.log(`\n📋 Story details:`)
      console.log(`  Key: ${key}`)
      console.log(`  Type: ${issuetype?.name}`)
      console.log(`  Status: ${status?.name}`)
      console.log(`  Project: ${project?.name}`)
      console.log(`  Path: ${outputPath}`)
    }

    console.log(`✓ Story written to ${outputPath}`)
  } catch (error) {
    console.error('Error fetching Jira story:', error)
    process.exit(1)
  }
}

/**
 * Execute the main function and handle errors gracefully.
 * Logs fatal error message and exits with code 1 on failure.
 */
fetchAndWriteStory().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`❌ Fatal error: ${message}`)
  process.exit(1)
})
