export function useDebugLog() {
  // 使用 useState 创建跨页面共享状态
  const debugMessages = useState<string[]>('debug-messages', () => []);

  function logDebug(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    debugMessages.value.push(logMessage);
  }

  function clearDebugMessages() {
    debugMessages.value = [];
  }

  return {
    debugMessages,
    logDebug,
    clearDebugMessages
  };
}
