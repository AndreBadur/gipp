/* eslint-disable @typescript-eslint/no-explicit-any */
export function logInfo(...args: any[]) {
  console.log('[INFO]', ...args)
}

export function logError(...args: any[]) {
  console.error('[ERROR]', ...args)
}

export function logToolCall(toolName: string, args: any) {
  console.log('[TOOL CALL]', {
    function: toolName,
    arguments: args,
  })
}

export function logToolResult(toolName: string, result: any) {
  console.log('[TOOL RESULT]', {
    function: toolName,
    result,
  })
}
