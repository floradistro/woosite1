interface FetchWithRetryOptions extends RequestInit {
  maxRetries?: number;
  timeoutMs?: number;
  retryDelayMs?: number;
}

export async function fetchWithRetry(
  url: string, 
  options: FetchWithRetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = 2,
    timeoutMs = 8000,
    retryDelayMs = 1000,
    ...fetchOptions
  } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok && attempt < maxRetries) {
        console.warn(`Attempt ${attempt + 1} failed for ${url}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, retryDelayMs * (attempt + 1))); // Exponential backoff
        continue;
      }

      return response;
    } catch (error: any) {
      if (attempt < maxRetries) {
        const isTimeout = error.name === 'AbortError' || error.code === 'UND_ERR_CONNECT_TIMEOUT';
        console.warn(`Attempt ${attempt + 1} failed for ${url} (${isTimeout ? 'timeout' : 'error'}), retrying...`);
        await new Promise(resolve => setTimeout(resolve, retryDelayMs * (attempt + 1))); // Exponential backoff
        continue;
      }
      
      console.error(`Fetch failed for ${url} after ${maxRetries + 1} attempts:`, error.message || error);
      throw error;
    }
  }
  
  throw new Error(`Fetch failed after ${maxRetries + 1} attempts`);
} 