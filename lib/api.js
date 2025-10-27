const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://backend-midtjbv0c-sanjeevans-projects-45db636c.vercel.app';

const fallbackSolutions = {
  'two sum': `class Solution:
    def twoSum(self, nums, target):
        num_map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in num_map:
                return [num_map[complement], i]
            num_map[num] = i
        return []`,
  
  'valid parentheses': `class Solution:
    def isValid(self, s):
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in mapping:
                if not stack or stack.pop() != mapping[char]:
                    return False
            else:
                stack.append(char)
        return not stack`,
        
  'palindrome': `class Solution:
    def isPalindrome(self, s):
        left, right = 0, len(s) - 1
        while left < right:
            while left < right and not s[left].isalnum():
                left += 1
            while left < right and not s[right].isalnum():
                right -= 1
            if s[left].lower() != s[right].lower():
                return False
            left += 1
            right -= 1
        return True`
};

function getFallbackSolution(problem) {
  const problemLower = problem.toLowerCase();
  
  for (const [key, solution] of Object.entries(fallbackSolutions)) {
    if (problemLower.includes(key)) {
      return solution;
    }
  }
  
  return `# Unable to generate solution - API unavailable
# Using fallback template

class Solution:
    def solve(self):
        # Your solution here
        pass`;
}

export const api = {
  async checkStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors'
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

    try {
      const response = await fetch(`${API_BASE_URL}/solve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({ 
          problem: problem.trim(), 
          language: selectedLanguages[0] || 'python'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.solution) {
          return data.solution;
        }
      }
    } catch (error) {
      console.error('API call failed:', error.message);
    }
    
    // Use fallback solution
    return getFallbackSolution(problem);
  }
};