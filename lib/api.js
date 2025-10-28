const API_BASE_URL = 'https://backend-midtjbv0c-sanjeevans-projects-45db636c.vercel.app';

const fetchWithTimeout = (url, options, timeout = 15000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

export const api = {
  async checkStatus() {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors'
      }, 5000);
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
      const response = await fetchWithTimeout(`${API_BASE_URL}/solve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({ 
          problem: problem.trim(), 
          language: language 
        }),
      }, 30000);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.solution) {
        return data.solution;
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('No solution returned from server');
      }
    } catch (error) {
      console.error('API call failed:', error.message);
      if (error.message.includes('timeout')) {
        throw new Error('Request timed out. The problem might be complex. Please try again.');
      }
      throw new Error(error.message || 'API unavailable. Please try again later.');
    }
  }
};