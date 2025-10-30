const API_BASE_URL = 'https://backend-dun-ten-29.vercel.app';

const formatSolution = (solution) => {
  if (!solution) return '';
  
  // Clean up markdown formatting and HTML entities
  return solution
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
    .replace(/&gt;/g, '>')          // Fix HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
};

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
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate solution`);
    }
    
    const data = await response.json();
    const solutionText = data.solution || data.response || data;
    const cleanSolution = formatSolution(solutionText);
    
    // Return structured data that App.jsx expects
    return {
      solution: cleanSolution,
      approach: true,
      algorithm: true,
      complexity: true,
      example: true
    };
  }
};

export { formatSolution };