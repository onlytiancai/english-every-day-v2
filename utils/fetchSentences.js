export async function fetchSentences(token) {
  const response = await fetch('/api/sentences', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch sentences');
  }
  return await response.json();
}
