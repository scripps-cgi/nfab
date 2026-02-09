/**
 * Jira Attachment Script
 *
 * Uploads a single file as an attachment to a single Jira ticket.
 *
 * Usage:
 *   npx tsx ./.github/scripts/jira-attach.ts <jira-ticket-key> <file-path>
 *
 * Environment Variables Required:
 *   JIRA_EMAIL - Jira account email
 *   JIRA_TOKEN - Jira API token
 *   JIRA_BASE_URL - Jira base URL (e.g., https://mycompany.atlassian.net)
 */

import 'dotenv/config'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { basename, extname, resolve } from 'node:path'
import { logger } from './lib/logger.ts'

/**
 * Infers a best-effort content type for the attachment.
 */
function inferContentType(fileName: string): string {
  const extension = extname(fileName).toLowerCase()

  switch (extension) {
    case '.md':
      return 'text/markdown'
    case '.txt':
      return 'text/plain'
    case '.json':
      return 'application/json'
    case '.pdf':
      return 'application/pdf'
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.gif':
      return 'image/gif'
    case '.csv':
      return 'text/csv'
    default:
      return 'application/octet-stream'
  }
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
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '')
  const url = `${normalizedBaseUrl}/rest/api/3/issue/${ticketKey}/attachments`
  const auth = Buffer.from(`${email}:${token}`).toString('base64')

  // Read file as buffer
  const fileContent = readFileSync(filePath)

  // Create FormData for multipart upload
  const formData = new FormData()
  const blob = new Blob([fileContent], { type: inferContentType(fileName) })
  formData.append('file', blob, fileName)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        // eslint-disable-next-line @stylistic/quote-props
        Authorization: `Basic ${auth}`,
        'X-Atlassian-Token': 'no-check'
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Jira API error (${response.status}): ${errorText}`)
    }

    logger.success(`Attached ${fileName}`, { indent: 2 })
  } catch (error) {
    throw new Error(`Failed to attach file to Jira: ${error}`)
  }
}

const args = process.argv.slice(2)

if (args.length !== 2) {
  logger.error('Usage: npx tsx ./.github/scripts/jira-attach.ts <jira-ticket-key> <file-path>')
  logger.info('Example: npx tsx ./.github/scripts/jira-attach.ts NFAB-42 ./.backlog/NFAB-42/readiness.md')
  process.exit(1)
}

const ticketKey = args[0].trim().toUpperCase()
const resolvedFilePath = resolve(args[1].trim())
const fileName = basename(resolvedFilePath)

if (!existsSync(resolvedFilePath)) {
  logger.error(`File not found: ${resolvedFilePath}`)
  process.exit(1)
}

const stats = statSync(resolvedFilePath)
if (!stats.isFile()) {
  logger.error(`Path is not a file: ${resolvedFilePath}`)
  process.exit(1)
}

try {
  const email = process.env.JIRA_EMAIL
  const token = process.env.JIRA_TOKEN
  const baseUrl = process.env.JIRA_BASE_URL

  if (!email || !token || !baseUrl) {
    throw new Error('Missing required environment variables: JIRA_EMAIL, JIRA_TOKEN, JIRA_BASE_URL')
  }

  logger.info(`Attaching ${fileName} to ${ticketKey}...`)
  await attachFileToJira(ticketKey, resolvedFilePath, fileName, email, token, baseUrl)
  logger.success(`Attached ${fileName} to ${ticketKey}`)
} catch (error) {
  logger.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
