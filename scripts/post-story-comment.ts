/**
 * Post Story Comment Script
 *
 * Reads a story file, extracts the Jira ticket ID, and posts the story content
 * as a comment to the corresponding Jira ticket.
 *
 * Usage:
 *   npx tsx scripts/post-story-comment.ts <story-file-path>
 *
 * Environment Variables Required:
 *   JIRA_EMAIL - Jira account email
 *   JIRA_TOKEN - Jira API token
 *   JIRA_BASE_URL - Jira base URL (e.g., https://mycompany.atlassian.net)
 */

import 'dotenv/config'
import { readFileSync } from 'fs'
import { resolve } from 'path'

interface MetadataHeader {
  [key: string]: string
}

/**
 * Reads and parses the story file
 */
function readStoryFile(filePath: string): { content: string; metadata: MetadataHeader } {
  const absolutePath = resolve(filePath)
  const fileContent = readFileSync(absolutePath, 'utf-8')

  // Extract metadata block (between first and second --- markers)
  const metadataMatch = fileContent.match(/^---\n([\s\S]*?)\n---/m)
  if (!metadataMatch) {
    throw new Error('Story file does not contain a metadata header (delimited by ---)')
  }

  const metadataText = metadataMatch[1]
  const metadata: MetadataHeader = {}

  // Parse metadata key: value pairs
  metadataText.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length > 0) {
      const cleanKey = key.trim()
      const cleanValue = valueParts.join(':').trim()
      metadata[cleanKey] = cleanValue
    }
  })

  return { content: fileContent, metadata }
}

/**
 * Extracts the Jira ticket ID and key from metadata
 * Expected format: "Jira: [KEY](URL)"
 * Returns both the key and numeric ID (if available in URL)
 */
function extractTicketInfo(metadata: MetadataHeader): { key: string; id?: string } {
  // Prefer an explicit `Key:` metadata line if present
  const keyMeta = metadata['Key'] || metadata['key']
  if (keyMeta) {
    const key = keyMeta.trim()

    // If there's an explicit Ticket ID metadata line, use it
    const idMeta = metadata['Ticket ID'] || metadata['TicketID'] || metadata['ticket id'] || metadata['ticketid']
    if (idMeta) {
      return { key, id: idMeta.trim() }
    }

    // Otherwise try to extract numeric ID from the Jira link (if present)
    const jiraField = metadata['Jira']
    if (jiraField) {
      const idMatch = jiraField.match(/[?&]id=(\d+)/)
      const id = idMatch ? idMatch[1] : undefined
      return { key, id }
    }

    return { key }
  }

  // Fallback: parse the `Jira:` field in the form "[KEY](URL)"
  const jiraField = metadata['Jira']
  if (!jiraField) {
    throw new Error('Metadata does not contain "Key" or "Jira" field')
  }

  // Parse "[KEY](URL)" format
  const keyMatch = jiraField.match(/\[([A-Z]+-\d+)\]/)
  if (!keyMatch) {
    throw new Error(`Could not extract ticket key from Jira field: ${jiraField}`)
  }

  const key = keyMatch[1]

  // Try to extract numeric ID from URL if available
  // Format: https://instance.atlassian.net/browse/KEY?id=12345 or similar
  const idMatch = jiraField.match(/[?&]id=(\d+)/)
  const id = idMatch ? idMatch[1] : undefined

  return { key, id }
}

/**
 * Posts a comment to a Jira ticket
 * Uses numeric ID if available (preferred), falls back to key
 */
async function postCommentToJira(ticketKey: string, ticketId: string | undefined, commentBody: string): Promise<void> {
  const email = process.env.JIRA_EMAIL
  const token = process.env.JIRA_TOKEN
  const baseUrl = process.env.JIRA_BASE_URL

  if (!email || !token || !baseUrl) {
    throw new Error('Missing required environment variables: JIRA_EMAIL, JIRA_TOKEN, JIRA_BASE_URL')
  }

  // Use numeric ID if available (more reliable), otherwise use key
  const issueIdOrKey = ticketId || ticketKey
  const url = `${baseUrl}/rest/api/3/issue/${issueIdOrKey}/comment`

  // Jira API expects body in Atlassian Document Format (ADF)
  // Post markdown as a code block for proper formatting
  const payload = {
    body: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'codeBlock',
          attrs: { language: 'markdown' },
          content: [
            {
              type: 'text',
              text: commentBody
            }
          ]
        }
      ]
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Jira API error (${response.status}): ${errorText}`)
    }

    const result = await response.json()
    console.log(`✓ Posted comment to ${ticketKey}`)
    console.log(`  Comment ID: ${result.id}`)
  } catch (error) {
    throw new Error(`Failed to post comment to Jira: ${error}`)
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error('Usage: npx tsx scripts/post-story-comment.ts <story-file-path>')
    console.error('\nExample:')
    console.error('  npx tsx scripts/post-story-comment.ts .story/backlog/in-progress/SCRUM-1-First_User_story.md')
    process.exit(1)
  }

  const storyFilePath = args[0]

  try {
    console.log(`📖 Reading story file: ${storyFilePath}`)
    const { content, metadata } = readStoryFile(storyFilePath)

    console.log('🔍 Extracting ticket information...')
    const { key, id } = extractTicketInfo(metadata)
    console.log(`  Key: ${key}`)
    if (id) {
      console.log(`  ID: ${id}`)
    }

    console.log('📝 Preparing comment as markdown code block...')
    // Wrap the story content in a code block for better formatting
    const commentBody = `Story updated:\n\n${content}`

    console.log('🚀 Posting comment to Jira...')
    await postCommentToJira(key, id, commentBody)

    console.log('\n✅ Success!')
  } catch (error) {
    console.error(`\n❌ Error: ${error}`)
    process.exit(1)
  }
}

// Run the script
main()
