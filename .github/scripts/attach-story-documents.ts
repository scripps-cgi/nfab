/**
 * Attach Story Documents Script
 *
 * Attaches story planning documents to a Jira ticket:
 * - Readiness
 * - Test Plan
 * - Test Scenarios
 * - Task Breakdown
 *
 * Usage:
 *   npx tsx scripts/attach-story-documents.ts <jira-ticket-key> <story-directory-path>
 *
 * Environment Variables Required:
 *   JIRA_EMAIL - Jira account email
 *   JIRA_TOKEN - Jira API token
 *   JIRA_BASE_URL - Jira base URL (e.g., https://mycompany.atlassian.net)
 */

import 'dotenv/config'
import { readFileSync, existsSync } from 'fs'
import { resolve, join } from 'path'

/**
 * Finds and collects available story documents in the directory
 */
function collectStoryDocuments(dirPath: string): { name: string; path: string }[] {
  const documentNames = ['readiness.md', 'test-plan.md', 'test-scenarios.md', 'task-breakdown.md']

  const documents: { name: string; path: string }[] = []

  for (const docName of documentNames) {
    const docPath = join(dirPath, docName)
    if (existsSync(docPath)) {
      documents.push({ name: docName, path: docPath })
    }
  }

  return documents
}

/**
 * Attaches a file to a Jira ticket
 */
async function attachFileToJira(
  ticketKey: string,
  filePath: string,
  fileName: string,
  email: string,
  token: string,
  baseUrl: string
): Promise<void> {
  const url = `${baseUrl}/rest/api/3/issue/${ticketKey}/attachments`

  // Read file as buffer
  const fileContent = readFileSync(filePath)

  // Create FormData for multipart upload
  const formData = new FormData()
  const blob = new Blob([fileContent], { type: 'text/markdown' })
  formData.append('file', blob, fileName)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`,
        'X-Atlassian-Token': 'no-check'
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Jira API error (${response.status}): ${errorText}`)
    }

    console.log(`  ✓ Attached ${fileName}`)
  } catch (error) {
    throw new Error(`Failed to attach file to Jira: ${error}`)
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.error('Usage: npx tsx scripts/attach-story-documents.ts <jira-ticket-key> <story-directory-path>')
    console.error('\nExample:')
    console.error('  npx tsx scripts/attach-story-documents.ts NFAB-42 .backlog/2024-01-15-NFAB-42-Feature_Name/')
    process.exit(1)
  }

  const ticketKey = args[0].toUpperCase()
  const storyDirPath = resolve(args[1])

  try {
    const email = process.env.JIRA_EMAIL
    const token = process.env.JIRA_TOKEN
    const baseUrl = process.env.JIRA_BASE_URL

    if (!email || !token || !baseUrl) {
      throw new Error('Missing required environment variables: JIRA_EMAIL, JIRA_TOKEN, JIRA_BASE_URL')
    }

    console.log(`📄 Looking for story documents in: ${storyDirPath}`)
    const documents = collectStoryDocuments(storyDirPath)

    if (documents.length === 0) {
      console.warn('⚠️  No story documents found in directory')
      console.warn('  Expected files: readiness.md, test-plan.md, test-scenarios.md, task-breakdown.md')
      process.exit(1)
    }

    console.log(`  Found ${documents.length} document(s)`)

    console.log(`\n🚀 Attaching documents to ${ticketKey}...`)

    for (const doc of documents) {
      await attachFileToJira(ticketKey, doc.path, doc.name, email, token, baseUrl)
    }

    console.log(`\n✅ Success! Attached ${documents.length} document(s) to ${ticketKey}`)
  } catch (error) {
    console.error(`\n❌ Error: ${error}`)
    process.exit(1)
  }
}

// Run the script
main()
