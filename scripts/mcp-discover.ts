import { runShellCommand } from './utils'

async function checkPrerequisites() {
  try {
    await runShellCommand('command -v mcp-find && command -v mcp-add')
  } catch (error) {
    console.error('⚠️ This command requires dynamic-tools enabled.')
    console.error('')
    console.error('Enable it: docker mcp feature enable dynamic-tools')
    console.error('Then restart.')
    process.exit(1)
  }
}

checkPrerequisites()
