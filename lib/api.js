const API_BASE_URL = 'https://backend-dun-ten-29.vercel.app';

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
        return True`,
  'reverse string': `class Solution:
    def reverseString(self, s):
        left, right = 0, len(s) - 1
        while left < right:
            s[left], s[right] = s[right], s[left]
            left += 1
            right -= 1`,
  'fizz buzz': `class Solution:
    def fizzBuzz(self, n):
        result = []
        for i in range(1, n + 1):
            if i % 15 == 0:
                result.append("FizzBuzz")
            elif i % 3 == 0:
                result.append("Fizz")
            elif i % 5 == 0:
                result.append("Buzz")
            else:
                result.append(str(i))
        return result`
};

function getFallbackSolution(problem) {
  const problemLower = problem.toLowerCase();
  for (const [key, solution] of Object.entries(fallbackSolutions)) {
    if (problemLower.includes(key)) {
      return solution;
    }
  }
  return `# LeetCode Solution Template
# Problem: ${problem.slice(0, 50)}...

class Solution:
    def solve(self):
        # Your solution here
        # This is a template - implement your logic
        pass
        
# Example usage:
# solution = Solution()
# result = solution.solve()`;
}

export const api = {
  async checkStatus() {
    try {
      const response = await fetch(API_BASE_URL);
      return response.ok;
    } catch {
      return false;
    }
  },

  async solveProblem(problem, language = 'python') {
    if (!problem?.trim()) {
      throw new Error('Problem description is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, language })
      });
      
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      return data.solution || getFallbackSolution(problem);
    } catch {
      return getFallbackSolution(problem);
    }
  }
};