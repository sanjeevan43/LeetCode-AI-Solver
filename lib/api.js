const API_BASE_URLS = [
  'https://backend-fl5mva3dw-sanjeevans-projects-45db636c.vercel.app'
];

export const api = {
  async checkStatus() {
    for (const url of API_BASE_URLS) {
      try {
        const response = await fetch(`${url}/`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        if (response.ok) {
          return true;
        }
      } catch (error) {
        console.error(`Health check failed for ${url}:`, error.message);
      }
    }
    return false;
  },

  async solveProblem(problem, selectedLanguages = ['python']) {
    const language = selectedLanguages[0] || 'python';
    
    for (const url of API_BASE_URLS) {
      try {
        const response = await fetch(`${url}/solve`, {
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

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success' && data.solution) {
            return data.solution;
          }
        }
      } catch (error) {
        console.error(`API call failed for ${url}:`, error.message);
      }
    }
    
    return 'Unable to solve problem at this time.';
  }
};