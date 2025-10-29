const API_BASE_URL = 'https://backend-8yiyyv6uf-sanjeevans-projects-45db636c.vercel.app';

export const api = {
  async checkStatus() {
    return true;
  },

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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate solution');
    }
    
    const data = await response.json();
    return data.solution;
  }
};