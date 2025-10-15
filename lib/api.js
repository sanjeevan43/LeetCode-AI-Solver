const API_BASE_URLS = [
  'https://backend-6vcy6d5tg-kings-projects-9e686403.vercel.app',
  'https://backend-bice-omega.vercel.app'
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
          const data = await response.json();
          if (data.message === 'LeetCode Solving AI is running') {
            return true;
          }
        }
      } catch (error) {
        console.error(`Health check failed for ${url}:`, error.message);
      }
    }
    return false;
  },

  async solveProblem(problem, selectedLanguages = ['python']) {
    for (const url of API_BASE_URLS) {
      try {
        const response = await fetch(`${url}/solve`, {
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
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error(`API error from ${url}:`, errorData.error || response.status);
        }
      } catch (error) {
        console.error(`API call failed for ${url}:`, error.message);
      }
    }
    
    // Fallback to mock if all APIs fail
    console.log('All APIs failed, using mock solution');
    return this.generateMockSolution(problem, selectedLanguages);
  },

  generateMockSolution(problem, selectedLanguages) {
    // Analyze the problem to determine the type
    const problemLower = problem.toLowerCase();
    let problemType = 'general';
    let algorithmType = 'iterative';
    
    if (problemLower.includes('two sum') || problemLower.includes('target sum')) {
      problemType = 'two_sum';
      algorithmType = 'hash_map';
    } else if (problemLower.includes('palindrome')) {
      problemType = 'palindrome';
      algorithmType = 'two_pointer';
    } else if (problemLower.includes('reverse') && problemLower.includes('string')) {
      problemType = 'reverse_string';
      algorithmType = 'two_pointer';
    } else if (problemLower.includes('fibonacci')) {
      problemType = 'fibonacci';
      algorithmType = 'dynamic_programming';
    } else if (problemLower.includes('binary search') || problemLower.includes('search')) {
      problemType = 'binary_search';
      algorithmType = 'divide_conquer';
    } else if (problemLower.includes('linked list')) {
      problemType = 'linked_list';
      algorithmType = 'pointer_manipulation';
    } else if (problemLower.includes('tree') || problemLower.includes('binary tree')) {
      problemType = 'binary_tree';
      algorithmType = 'recursion';
    } else if (problemLower.includes('array') || problemLower.includes('maximum') || problemLower.includes('minimum')) {
      problemType = 'array_problem';
      algorithmType = 'sliding_window';
    }
    
    const solutions = this.getSolutionTemplates(problemType, algorithmType);
    
    const solutionData = {
      python: {
        code: solutions.python,
        explanation: this.getExplanation('python', problemType, algorithmType)
      },
      javascript: {
        code: solutions.javascript,
        explanation: this.getExplanation('javascript', problemType, algorithmType)
      },
      java: {
        code: solutions.java,
        explanation: this.getExplanation('java', problemType, algorithmType)
      },
      cpp: {
        code: solutions.cpp,
        explanation: this.getExplanation('cpp', problemType, algorithmType)
      },
      csharp: {
        code: solutions.csharp,
        explanation: this.getExplanation('csharp', problemType, algorithmType)
      },
      go: {
        code: solutions.go,
        explanation: this.getExplanation('go', problemType, algorithmType)
      },
      rust: {
        code: solutions.rust,
        explanation: this.getExplanation('rust', problemType, algorithmType)
      },
      typescript: {
        code: solutions.typescript,
        explanation: this.getExplanation('typescript', problemType, algorithmType)
      }
    };
    
    const algorithmInfo = this.getAlgorithmInfo(problemType, algorithmType);
    
    let response = `## 🎯 Problem Analysis
**Problem Type**: ${algorithmInfo.type}
**Algorithm**: ${algorithmInfo.algorithm}
**Time Complexity**: ${algorithmInfo.timeComplexity}
**Space Complexity**: ${algorithmInfo.spaceComplexity}

## 🧠 Learning Approach
**Core Concept**: ${algorithmInfo.concept}

**The "Aha!" Moment**: ${algorithmInfo.insight}

`;
    
    selectedLanguages.forEach(lang => {
      if (solutionData[lang]) {
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
${solutionData[lang].code}

### 📚 ${langNames[lang]} Teaching Notes
${solutionData[lang].explanation}

`;
      }
    });
    
    response += `## 🎓 Key Learning Points
${algorithmInfo.keyPoints}

## 🚀 Next Steps
${algorithmInfo.nextSteps}`;
    
    return response;
  },

  getSolutionTemplates(problemType, algorithmType) {
    const templates = {
      two_sum: {
        python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
        javascript: `function twoSum(nums, target) {
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
        java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
        cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.find(complement) != seen.end()) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`,
        csharp: `public int[] TwoSum(int[] nums, int target) {
    var seen = new Dictionary<int, int>();
    for (int i = 0; i < nums.Length; i++) {
        int complement = target - nums[i];
        if (seen.ContainsKey(complement)) {
            return new int[] { seen[complement], i };
        }
        seen[nums[i]] = i;
    }
    return new int[] { };
}`,
        go: `func twoSum(nums []int, target int) []int {
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
        rust: `pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    let mut seen = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        let complement = target - num;
        if let Some(&idx) = seen.get(&complement) {
            return vec![idx as i32, i as i32];
        }
        seen.insert(num, i);
    }
    vec![]
}`,
        typescript: `function twoSum(nums: number[], target: number): number[] {
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
      },
      palindrome: {
        python: `def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True`,
        javascript: `function isPalindrome(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`,
        java: `public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`,
        cpp: `bool isPalindrome(string s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s[left] != s[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`,
        csharp: `public bool IsPalindrome(string s) {
    int left = 0, right = s.Length - 1;
    while (left < right) {
        if (s[left] != s[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`,
        go: `func isPalindrome(s string) bool {
    left, right := 0, len(s)-1
    for left < right {
        if s[left] != s[right] {
            return false
        }
        left++
        right--
    }
    return true
}`,
        rust: `pub fn is_palindrome(s: String) -> bool {
    let chars: Vec<char> = s.chars().collect();
    let mut left = 0;
    let mut right = chars.len() - 1;
    while left < right {
        if chars[left] != chars[right] {
            return false;
        }
        left += 1;
        right -= 1;
    }
    true
}`,
        typescript: `function isPalindrome(s: string): boolean {
    let left = 0, right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`
      },
      general: {
        python: `def solve_problem(input_data):
    # Analyze the problem requirements
    # Choose appropriate data structures
    # Implement step by step
    
    result = []
    # Your solution logic here
    
    return result`,
        javascript: `function solveProblem(inputData) {
    // Analyze the problem requirements
    // Choose appropriate data structures
    // Implement step by step
    
    let result = [];
    // Your solution logic here
    
    return result;
}`,
        java: `public class Solution {
    public int[] solveProblem(int[] inputData) {
        // Analyze the problem requirements
        // Choose appropriate data structures
        // Implement step by step
        
        List<Integer> result = new ArrayList<>();
        // Your solution logic here
        
        return result.stream().mapToInt(i -> i).toArray();
    }
}`,
        cpp: `vector<int> solveProblem(vector<int>& inputData) {
    // Analyze the problem requirements
    // Choose appropriate data structures
    // Implement step by step
    
    vector<int> result;
    // Your solution logic here
    
    return result;
}`,
        csharp: `public int[] SolveProblem(int[] inputData) {
    // Analyze the problem requirements
    // Choose appropriate data structures
    // Implement step by step
    
    var result = new List<int>();
    // Your solution logic here
    
    return result.ToArray();
}`,
        go: `func solveProblem(inputData []int) []int {
    // Analyze the problem requirements
    // Choose appropriate data structures
    // Implement step by step
    
    result := []int{}
    // Your solution logic here
    
    return result
}`,
        rust: `pub fn solve_problem(input_data: Vec<i32>) -> Vec<i32> {
    // Analyze the problem requirements
    // Choose appropriate data structures
    // Implement step by step
    
    let mut result = Vec::new();
    // Your solution logic here
    
    result
}`,
        typescript: `function solveProblem(inputData: number[]): number[] {
    // Analyze the problem requirements
    // Choose appropriate data structures
    // Implement step by step
    
    const result: number[] = [];
    // Your solution logic here
    
    return result;
}`
      }
    };
    
    return templates[problemType] || templates.general;
  },

  getExplanation(language, problemType, algorithmType) {
    const explanations = {
      two_sum: {
        python: "Hash map approach using dictionary for O(1) lookups. Enumerate gives both index and value.",
        javascript: "Map object provides clean API for key-value storage with has() and get() methods.",
        java: "HashMap with containsKey() for existence check and put() for storage.",
        cpp: "unordered_map for hash table implementation with find() method.",
        csharp: "Dictionary<TKey, TValue> with ContainsKey() method for type-safe operations.",
        go: "Built-in map with comma ok idiom for existence checking.",
        rust: "HashMap with pattern matching using if let Some() for safe access.",
        typescript: "Typed Map with generic parameters for compile-time safety."
      },
      palindrome: {
        python: "Two-pointer technique comparing characters from both ends.",
        javascript: "Two pointers moving inward with strict equality check.",
        java: "charAt() method for character access with two-pointer approach.",
        cpp: "Direct string indexing with two pointers for efficiency.",
        csharp: "String indexing with two-pointer technique.",
        go: "Slice indexing with two pointers moving toward center.",
        rust: "Convert to char vector for safe indexing with bounds checking.",
        typescript: "Type-safe string manipulation with two-pointer technique."
      },
      general: {
        python: "General problem-solving approach with clear structure and comments.",
        javascript: "Flexible solution template adaptable to various problem types.",
        java: "Object-oriented approach with proper data structure usage.",
        cpp: "Efficient C++ implementation with STL containers.",
        csharp: "Clean C# solution using LINQ and modern language features.",
        go: "Idiomatic Go code with simple and readable structure.",
        rust: "Memory-safe Rust implementation with ownership principles.",
        typescript: "Type-safe solution with clear interfaces and error handling."
      }
    };
    
    return explanations[problemType]?.[language] || explanations.general[language];
  },

  getAlgorithmInfo(problemType, algorithmType) {
    const info = {
      two_sum: {
        type: "Array, Hash Table",
        algorithm: "Hash Map Lookup",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        concept: "Instead of checking every pair (O(n²)), store complements and check existence (O(n))",
        insight: "For each number, ask 'What number would complete this pair?' then check if we've seen it.",
        keyPoints: "1. **Hash Maps are your friend** - O(1) lookup beats O(n) searching\n2. **Think backwards** - 'What do I need?' instead of 'What do I have?'\n3. **Trade space for time** - Use extra memory for faster algorithms",
        nextSteps: "- Try with different inputs: [2,7,11,15], target=9\n- Handle edge cases: duplicates, no solution, negative numbers\n- Consider follow-up: what if array is sorted?"
      },
      palindrome: {
        type: "String, Two Pointers",
        algorithm: "Two Pointer Technique",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        concept: "Compare characters from both ends moving inward until pointers meet",
        insight: "If it's a palindrome, characters at symmetric positions must match",
        keyPoints: "1. **Two pointers save space** - No need to reverse or copy\n2. **Early termination** - Stop as soon as mismatch found\n3. **Symmetric comparison** - Check from outside in",
        nextSteps: "- Handle case sensitivity and special characters\n- Try with different string lengths\n- Consider Unicode and multi-byte characters"
      },
      general: {
        type: "General Problem",
        algorithm: "Problem-Specific Approach",
        timeComplexity: "Depends on solution",
        spaceComplexity: "Depends on solution",
        concept: "Analyze the problem, choose appropriate data structures, implement step by step",
        insight: "Break down complex problems into smaller, manageable parts",
        keyPoints: "1. **Understand the problem** - Read carefully and identify patterns\n2. **Choose right tools** - Arrays, hashmaps, trees, etc.\n3. **Start simple** - Get working solution first, optimize later",
        nextSteps: "- Test with various inputs\n- Consider edge cases\n- Optimize time/space complexity if needed"
      }
    };
    
    return info[problemType] || info.general;
  }
};