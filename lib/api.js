const API_BASE_URL = 'https://backend-dun-ten-29.vercel.app';

export const api = {
  async solveProblem(problem, language = 'python') {
    if (!problem?.trim()) {
      throw new Error('Problem description is required');
    }

    const payload = { problem: problem.trim(), language };

    const response = await fetch(`${API_BASE_URL}/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('API Error Response:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate solution`);
    }
    
    const data = await response.json();
    console.log('API Success Response:', data);
    return data;
  }
};