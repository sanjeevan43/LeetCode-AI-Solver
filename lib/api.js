const API_BASE_URL = 'http://localhost:5000';

export const api = {
  async checkStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error.message);
      return false;
    }
  },

  async solveProblem(problem, selectedLanguages = ['python']) {
    if (!problem || !problem.trim()) {
      throw new Error('Problem description is required');
    }

    const language = selectedLanguages[0] || 'python';
    
    try {
      const response = await fetch(`${API_BASE_URL}/solve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          problem: problem.trim(), 
          language: language 
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.solution) {
        return data.solution;
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('No solution returned');
      }
    } catch (error) {
      console.error('API call failed:', error.message);
      throw new Error(error.message || 'API unavailable. Please try again later.');
    }
  }
};