export const debugMessages = ref<string[]>([]);

export function logDebug(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  debugMessages.value.push(logMessage);
}
