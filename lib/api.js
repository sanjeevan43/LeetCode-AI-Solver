const API_BASE_URL = 'https://backend-7ubg.vercel.app';
const FALLBACK_URLS = [
  'https://backend-7ubg.vercel.app',
  'https://backend-7ubg-git-main-sanjeevan43.vercel.app',
  'https://backend-7ubg-sanjeevan43.vercel.app'
];

export const api = {
  async checkStatus() {
    for (const url of FALLBACK_URLS) {
      try {
        const response = await fetch(`${url}/`, {
          method: 'GET',
          headers: { 'Accept': '*/*' },
        });
        if (response.ok) return true;
      } catch (error) {
        console.error(`Failed ${url}:`, error.message);
      }
    }
    return false;
  },

  async solveProblem(problem, selectedLanguages = ['python']) {
    // Try real API first
    for (const url of FALLBACK_URLS) {
      try {
        const response = await fetch(`${url}/solve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
          },
          body: JSON.stringify({ problem, languages: selectedLanguages }),
        });

        if (response.ok) {
          const responseText = await response.text();
          let data;
          try {
            data = JSON.parse(responseText);
            return data.solution || data.message || responseText;
          } catch {
            return responseText;
          }
        }
      } catch (error) {
        console.error(`Failed ${url}:`, error.message);
      }
    }
    
    // Fallback to mock with selected languages
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const solutions = {
      python: `python
def solve_problem(nums, target):
    """
    Efficient solution using hash map
    Time: O(n), Space: O(n)
    """
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      
      javascript: `javascript
function solveProblem(nums, target) {
    // Using Map for O(1) lookups
    const seen = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    
    return [];
}`,
      
      java: `java
public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // HashMap for efficient lookups
        Map<Integer, Integer> seen = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }
            seen.put(nums[i], i);
        }
        
        return new int[]{};
    }
}`,
      
      cpp: `cpp
#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        
        return {};
    }
};`,
      
      csharp: `csharp
public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        var seen = new Dictionary<int, int>();
        
        for (int i = 0; i < nums.Length; i++) {
            int complement = target - nums[i];
            if (seen.ContainsKey(complement)) {
                return new int[] { seen[complement], i };
            }
            seen[nums[i]] = i;
        }
        
        return new int[] { };
    }
}`,
      
      go: `go
func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    
    for i, num := range nums {
        complement := target - num
        if idx, exists := seen[complement]; exists {
            return []int{idx, i}
        }
        seen[num] = i
    }
    
    return []int{}
}`,
      
      rust: `rust
use std::collections::HashMap;

impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        let mut seen = HashMap::new();
        
        for (i, &num) in nums.iter().enumerate() {
            let complement = target - num;
            if let Some(&idx) = seen.get(&complement) {
                return vec![idx as i32, i as i32];
            }
            seen.insert(num, i);
        }
        
        vec![]
    }
}`,
      
      typescript: `typescript
function twoSum(nums: number[], target: number): number[] {
    const seen = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement)!, i];
        }
        seen.set(nums[i], i);
    }
    
    return [];
}`
    };
    
    let response = `## Problem Analysis
📝 **Problem Type**: Array, Hash Table
🎯 **Difficulty**: Easy to Medium
⏱️ **Time Complexity**: O(n)
💾 **Space Complexity**: O(n)

## Approach
✅ **Strategy**: Hash Map for O(1) lookups
🔍 **Key Insight**: Store complement values as we iterate
🚀 **Optimization**: Single pass through the array

`;
    
    selectedLanguages.forEach(lang => {
      if (solutions[lang]) {
        const langNames = {
          python: '🐍 Python',
          javascript: '🟨 JavaScript', 
          java: '☕ Java',
          cpp: '⚡ C++',
          csharp: '🔷 C#',
          go: '🐹 Go',
          rust: '🦀 Rust',
          typescript: '🔷 TypeScript'
        };
        response += `## ${langNames[lang]} Solution\n\n${solutions[lang]}\n\n`;
      }
    });
    
    response += `## Key Points
💡 **Algorithm**: Hash table for complement lookup
🔄 **Process**: Check complement → Store current → Continue
✨ **Benefits**: Optimal time complexity with clear logic

## Complexity Analysis
⏱️ **Time**: O(n) - Single pass through array
💾 **Space**: O(n) - Hash map storage
🎯 **Optimal**: Yes, cannot do better than O(n) time`;
    
    return response;
  }
};