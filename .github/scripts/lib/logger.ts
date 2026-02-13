export type LogLevel = 'success' | 'info' | 'warn' | 'error'

export interface LogOptions {
  indent?: number
}

export interface Logger {
  success(message: string, options?: LogOptions): void
  info(message: string, options?: LogOptions): void
  warn(message: string, options?: LogOptions): void
  error(message: string, options?: LogOptions): void
  raw(message: string): void
}

interface LevelStyle {
  icon: string
  color: (text: string) => string
  stream: 'stdout' | 'stderr'
}

function isColorEnabled(): boolean {
  if (process.env.NO_COLOR) return false
  if (process.env.FORCE_COLOR === '0') return false
  return Boolean(process.stdout.isTTY)
}

function color(code: string): (text: string) => string {
  const enabled = isColorEnabled()
  const reset = '\u001b[0m'
  return enabled ? (text: string) => `${code}${text}${reset}` : (text: string) => text
}

const styles: Record<LogLevel, LevelStyle> = {
  success: { icon: '✓', color: color('\u001b[32m'), stream: 'stdout' },
  info: { icon: 'ℹ', color: color('\u001b[34m'), stream: 'stdout' },
  warn: { icon: '⚠', color: color('\u001b[33m'), stream: 'stderr' },
  error: { icon: '✖', color: color('\u001b[31m'), stream: 'stderr' }
}

function writeLine(stream: 'stdout' | 'stderr', line: string): void {
  if (stream === 'stderr') {
    console.error(line)
    return
  }

  console.log(line)
}

function formatLine(level: LogLevel, message: string, options?: LogOptions): string {
  const indent = options?.indent ?? 0
  const pad = indent > 0 ? ' '.repeat(indent) : ''
  const { icon, color: applyColor } = styles[level]
  return `${pad}${applyColor(icon)} ${message}`
}

function log(level: LogLevel, message: string, options?: LogOptions): void {
  const style = styles[level]

  const lines = message.split('\n')
  const first = lines[0] ?? ''
  writeLine(style.stream, formatLine(level, first, options))

  if (lines.length <= 1) return

  const continuationIndent = (options?.indent ?? 0) + 2
  for (const line of lines.slice(1)) {
    writeLine(style.stream, `${' '.repeat(continuationIndent)}${line}`)
  }
}

export const logger: Logger = {
  success: (message, options) => log('success', message, options),
  info: (message, options) => log('info', message, options),
  warn: (message, options) => log('warn', message, options),
  error: (message, options) => log('error', message, options),
  raw: message => console.log(message)
}
