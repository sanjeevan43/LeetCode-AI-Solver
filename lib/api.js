const API_BASE_URL = 'https://backend-bice-omega.vercel.app';

export const api = {
  async checkStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        return data.message === 'LeetCode Solving AI is running';
      }
    } catch (error) {
      console.error('Health check failed:', error.message);
    }
    return false;
  },

  async solveProblem(problem, selectedLanguages = ['python']) {
    try {
      const response = await fetch(`${API_BASE_URL}/solve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ problem, languages: selectedLanguages }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.solution) {
          return data.solution;
        }
        throw new Error('Invalid response format');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('API call failed:', error.message);
      // Fallback to mock if API fails
      return this.generateMockSolution(problem, selectedLanguages);
    }
  },

  generateMockSolution(problem, selectedLanguages) {
    const solutions = {
      python: {
        code: `def solve_problem(nums, target):
    """
    Hash Map Approach - Most Efficient
    Time: O(n), Space: O(n)
    """
    seen = {}  # Dictionary to store number -> index
    
    for i, num in enumerate(nums):
        complement = target - num  # What we need to find
        
        if complement in seen:  # Found the pair!
            return [seen[complement], i]
        
        seen[num] = i  # Store current number and index
    
    return []  # No solution found`,
        explanation: `**How it works:**
1. Create empty dictionary 'seen' to store numbers we've visited
2. For each number, calculate what we need (complement = target - current)
3. Check if complement exists in our dictionary
4. If yes, return both indices. If no, store current number
5. This gives us O(n) time instead of O(n²) brute force`
      },
      
      javascript: {
        code: `function solveProblem(nums, target) {
    // Map for O(1) lookups - faster than objects
    const seen = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];  // What we're looking for
        
        if (seen.has(complement)) {  // Found our pair!
            return [seen.get(complement), i];
        }
        
        seen.set(nums[i], i);  // Remember this number
    }
    
    return [];  // No solution
}`,
        explanation: `**Key JavaScript concepts:**
1. Map() is better than {} for this - cleaner API
2. .has() checks existence, .get() retrieves value
3. .set() stores key-value pairs
4. Maps maintain insertion order (bonus feature)
5. More memory efficient than nested loops`
      },
      
      java: {
        code: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // HashMap for O(1) average case lookups
        Map<Integer, Integer> seen = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];  // Calculate needed value
            
            if (seen.containsKey(complement)) {  // Check if we've seen it
                return new int[]{seen.get(complement), i};
            }
            
            seen.put(nums[i], i);  // Store current number -> index
        }
        
        return new int[]{};  // Empty array if no solution
    }
}`,
        explanation: `**Java HashMap benefits:**
1. containsKey() is O(1) average case
2. get() and put() are also O(1) average
3. Auto-boxing handles int ↔ Integer conversion
4. HashMap allows null values (unlike Hashtable)
5. Not synchronized = faster for single-threaded use`
      },
      
      cpp: {
        code: `#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;  // Hash table for fast lookup
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];  // What we need
            
            if (seen.find(complement) != seen.end()) {  // Found it!
                return {seen[complement], i};
            }
            
            seen[nums[i]] = i;  // Store number -> index mapping
        }
        
        return {};  // Return empty vector
    }
};`,
        explanation: `**C++ optimization notes:**
1. unordered_map uses hash table (O(1) average)
2. map uses red-black tree (O(log n)) - slower
3. find() returns iterator, compare with end()
4. {} initializer creates vector efficiently
5. Pass vector by reference (&) to avoid copying`
      },
      
      csharp: {
        code: `public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        // Dictionary for fast O(1) lookups
        var seen = new Dictionary<int, int>();
        
        for (int i = 0; i < nums.Length; i++) {
            int complement = target - nums[i];  // Calculate what we need
            
            if (seen.ContainsKey(complement)) {  // Check if exists
                return new int[] { seen[complement], i };
            }
            
            seen[nums[i]] = i;  // Add to dictionary
        }
        
        return new int[] { };  // No solution found
    }
}`,
        explanation: `**C# Dictionary advantages:**
1. Generic Dictionary<TKey, TValue> is type-safe
2. ContainsKey() method is very readable
3. Indexer syntax seen[key] for get/set
4. 'var' keyword for type inference
5. Arrays initialized with new int[] { } syntax`
      },
      
      go: {
        code: `func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)  // Create hash map
    
    for i, num := range nums {  // Iterate with index and value
        complement := target - num  // What we're looking for
        
        if idx, exists := seen[complement]; exists {  // Check existence
            return []int{idx, i}  // Return slice with both indices
        }
        
        seen[num] = i  // Store number -> index
    }
    
    return []int{}  // Empty slice
}`,
        explanation: `**Go language features:**
1. make(map[int]int) creates hash map
2. range gives both index and value
3. Multiple assignment: idx, exists := ...
4. Comma ok idiom for checking map existence
5. []int{} creates slice literal
6. No classes - just functions and structs`
      },
      
      rust: {
        code: `use std::collections::HashMap;

impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        let mut seen = HashMap::new();  // Mutable hash map
        
        for (i, &num) in nums.iter().enumerate() {  // Iterate with index
            let complement = target - num;  // Calculate needed value
            
            if let Some(&idx) = seen.get(&complement) {  // Pattern matching
                return vec![idx as i32, i as i32];  // Convert usize to i32
            }
            
            seen.insert(num, i);  // Insert into map
        }
        
        vec![]  // Empty vector
    }
}`,
        explanation: `**Rust safety features:**
1. mut keyword for mutable variables
2. &num destructures reference in loop
3. if let Some() for safe option handling
4. No null pointers - Option<T> instead
5. as i32 for explicit type conversion
6. Memory safe without garbage collector`
      },
      
      typescript: {
        code: `function twoSum(nums: number[], target: number): number[] {
    const seen = new Map<number, number>();  // Typed Map
    
    for (let i = 0; i < nums.length; i++) {
        const complement: number = target - nums[i];  // Type annotation
        
        if (seen.has(complement)) {  // Check if key exists
            return [seen.get(complement)!, i];  // ! asserts non-null
        }
        
        seen.set(nums[i], i);  // Store in map
    }
    
    return [];  // Empty array
}`,
        explanation: `**TypeScript benefits:**
1. Static type checking catches errors early
2. Map<number, number> specifies key/value types
3. ! operator asserts value is not undefined
4. Type annotations make code self-documenting
5. Compiles to clean JavaScript
6. Great IDE support with autocomplete`
      }
    };
    
    let response = `## 🎯 Problem Analysis
**Algorithm**: Hash Map / Dictionary Lookup
**Time Complexity**: O(n) - Single pass
**Space Complexity**: O(n) - Hash map storage

## 🧠 Learning Approach
**Core Concept**: Instead of checking every pair (O(n²)), we store what we've seen and check if we need it later (O(n))

**The "Aha!" Moment**: For each number, ask "What number would complete this pair?" Then check if we've seen that number before.

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
        response += `## ${langNames[lang]} Solution

${lang}
${solutions[lang].code}

### 📚 ${langNames[lang]} Teaching Notes
${solutions[lang].explanation}

`;
      }
    });
    
    response += `## 🎓 Key Learning Points
1. **Hash Maps are your friend** - O(1) lookup beats O(n) searching
2. **Think backwards** - "What do I need?" instead of "What do I have?"
3. **Trade space for time** - Use extra memory to get faster algorithms
4. **One pass is enough** - No need to check every combination

## 🚀 Next Steps
- Try implementing this in your preferred language
- Test with different inputs: [2,7,11,15], target=9
- Think about edge cases: duplicates, no solution, negative numbers`;
    
    return response;
  }
};