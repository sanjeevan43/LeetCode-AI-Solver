const API_BASE_URL = 'https://backend-dun-ten-29.vercel.app';

function formatSolution(solution) {
  // Decode HTML entities and remove markdown formatting
  let formatted = solution
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove **bold**
    .replace(/\*(.*?)\*/g, '$1');     // Remove *italic*
  
  // Add section headers if they don't exist
  
  // Check if solution already has proper structure
  if (!formatted.includes('##')) {
    // Split content into logical sections
    const parts = formatted.split(/\n\s*\n/);
    let structuredSolution = '';
    
    // Find code block
    const codeMatch = formatted.match(/class Solution[\s\S]*?(?=\n\n|Time Complexity|Space Complexity|Explanation|$)/i);
    if (codeMatch) {
      structuredSolution += '## 💻 Solution\n\n```cpp\n' + codeMatch[0].trim() + '\n```\n\n';
    }
    
    // Find complexity analysis
    const complexityMatch = formatted.match(/(Time Complexity[\s\S]*?Space Complexity[\s\S]*?)(?=\n\n|Explanation|$)/i);
    if (complexityMatch) {
      structuredSolution += '## ⏱️ Complexity Analysis\n\n' + complexityMatch[1].trim() + '\n\n';
    }
    
    // Find explanation
    const explanationMatch = formatted.match(/Explanation:[\s\S]*?(?=Edge Cases|Optimizations|$)/i);
    if (explanationMatch) {
      structuredSolution += '## 📝 Explanation\n\n' + explanationMatch[0].replace('Explanation:', '').trim() + '\n\n';
    }
    
    // Find edge cases
    const edgeCasesMatch = formatted.match(/Edge Cases[\s\S]*?(?=Optimizations|$)/i);
    if (edgeCasesMatch) {
      structuredSolution += '## 🔍 Edge Cases Handled\n\n' + edgeCasesMatch[0].replace(/Edge Cases[^:]*:?/i, '').trim() + '\n\n';
    }
    
    // Find optimizations
    const optimizationsMatch = formatted.match(/Optimizations:[\s\S]*$/i);
    if (optimizationsMatch) {
      structuredSolution += '## 🚀 Key Optimizations\n\n' + optimizationsMatch[0].replace('Optimizations:', '').trim();
    }
    
    return structuredSolution || formatted;
  }
  
  return formatted;
}

export const api = {
  async checkStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch {
      return false;
    }
  },

  async solveProblem(problem, language = 'python') {
    if (!problem?.trim()) {
      throw new Error('Problem description is required');
    }

    const response = await fetch(`${API_BASE_URL}/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem, language })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }
    
    const data = await response.json();
    return formatSolution(data.solution);
  }
};