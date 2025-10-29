import { useState, useEffect } from 'react';
import { Loader, Copy, Check, Terminal, Sparkles, Zap, Lightbulb, BookOpen, Brain, Clock, Play, Search, RefreshCw } from 'lucide-react';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { api } from './lib/api';

export default function LeetCodeHelper() {
  const [problem, setProblem] = useState('');
  const [solutionData, setSolutionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [languageSearch, setLanguageSearch] = useState('');


  const languages = [
    { value: 'python', label: '🐍 Python' },
    { value: 'javascript', label: '🟨 JavaScript' },
    { value: 'java', label: '☕ Java' },
    { value: 'cpp', label: '⚡ C++' },
    { value: 'c', label: '🔧 C' },
    { value: 'csharp', label: '🔷 C#' },
    { value: 'go', label: '🐹 Go' },
    { value: 'rust', label: '🦀 Rust' },
    { value: 'kotlin', label: '🎯 Kotlin' },
    { value: 'swift', label: '🍎 Swift' },
    { value: 'php', label: '🐘 PHP' },
    { value: 'ruby', label: '💎 Ruby' },
    { value: 'scala', label: '🎭 Scala' },
    { value: 'typescript', label: '🔷 TypeScript' },
    { value: 'dart', label: '🎯 Dart' },
    { value: 'r', label: '📊 R' },
    { value: 'matlab', label: '🧮 MATLAB' },
    { value: 'perl', label: '🐪 Perl' },
    { value: 'lua', label: '🌙 Lua' },
    { value: 'haskell', label: '🎓 Haskell' },
    { value: 'clojure', label: '🔄 Clojure' },
    { value: 'elixir', label: '💧 Elixir' },
    { value: 'fsharp', label: '🔷 F#' },
    { value: 'vb', label: '📘 Visual Basic' }
  ];

  const copyToClipboard = async (text, index) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };



  const handleGetSolution = async () => {
    if (!problem.trim()) return;
    
    setLoading(true);
    setSolutionData(null);
    
    try {
      // Convert problem name to a more detailed description for the API
      const problemDescription = `Solve the LeetCode problem: ${problem.trim()}`;
      const data = await api.solveProblem(problemDescription, selectedLanguage);
      console.log('API Response:', data);
      setSolutionData(data);
    } catch (error) {
      console.error('API Error:', error);
      setSolutionData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };



  const renderSolution = () => {
    if (!solutionData) return (
      <div className="flex flex-col items-center justify-center h-full py-16">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-gray-100">
            <img src="./logo.png" alt="LeetCode AI Solver" className="w-16 h-16 object-contain rounded-xl" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Ready to Generate!</h3>
        <p className="text-center text-gray-600 text-sm max-w-md leading-relaxed">
          Enter your LeetCode problem description and select your preferred programming language to get an optimized solution.
        </p>
      </div>
    );

    if (loading) return (
      <div className="flex flex-col items-center justify-center h-full py-16">
        <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Generating Solution...</h3>
        <p className="text-gray-500 text-sm">Our AI is analyzing your problem</p>
      </div>
    );

    if (solutionData?.error) {
      const isServiceUnavailable = solutionData.error.includes('AI service unavailable') || solutionData.error.includes('503');
      return (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            <div className="space-y-2">
              <p><strong>Error:</strong> {solutionData.error}</p>
              {isServiceUnavailable && (
                <div className="text-sm">
                  <p>The AI service is temporarily unavailable. This usually means:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>The backend AI service is starting up (cold start)</li>
                    <li>High traffic causing temporary overload</li>
                    <li>Backend maintenance in progress</li>
                  </ul>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleGetSolution}
                      disabled={loading}
                      className="text-xs"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Retry
                    </Button>
                    <span className="text-xs text-gray-600">Try again in a few moments</span>
                  </div>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    if (!solutionData?.solution) {
      console.log('Solution data:', solutionData);
      return (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-yellow-800">
            No solution data received. Please try again.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-8">
        {/* Solution Code */}
        <Card className="overflow-hidden shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold">Solution Code</span>
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">
                  {languages.find(l => l.value === selectedLanguage)?.label || selectedLanguage}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700"
                onClick={() => {
                  // Extract only the function code, removing docstrings, comments, and test cases
                  const lines = solutionData?.solution?.split('\n') || [];
                  const codeLines = [];
                  let inFunction = false;
                  let inDocstring = false;
                  let braceCount = 0;
                  
                  for (const line of lines) {
                    const trimmed = line.trim();
                    
                    // Skip empty lines at start
                    if (!inFunction && !trimmed) continue;
                    
                    // Start of function
                    if (trimmed.startsWith('def ') || trimmed.startsWith('class ') || 
                        trimmed.includes('function') || trimmed.includes('{')) {
                      inFunction = true;
                    }
                    
                    // Skip docstrings
                    if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
                      inDocstring = !inDocstring;
                      continue;
                    }
                    if (inDocstring) continue;
                    
                    // Skip comments and test cases
                    if (trimmed.startsWith('#') || trimmed.startsWith('//') || 
                        trimmed.startsWith('nums = ') || trimmed.startsWith('target = ') ||
                        trimmed.startsWith('result = ') || trimmed.startsWith('print(')) {
                      continue;
                    }
                    
                    // Skip explanation sections
                    if (trimmed.startsWith('**') || trimmed.startsWith('*Time') || 
                        trimmed.startsWith('*Space') || trimmed.includes('Explanation:')) {
                      break;
                    }
                    
                    if (inFunction && trimmed) {
                      codeLines.push(line);
                    }
                  }
                  
                  const cleanCode = codeLines.join('\n').trim();
                  copyToClipboard(cleanCode, 0);
                }}
              >
                {copiedIndex === 0 ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <pre className="p-6 text-sm text-slate-100 font-mono overflow-x-auto leading-relaxed bg-slate-900 min-h-[200px]">
              {(() => {
                // Display only the clean function code
                const lines = solutionData?.solution?.split('\n') || [];
                const codeLines = [];
                let inFunction = false;
                let inDocstring = false;
                
                for (const line of lines) {
                  const trimmed = line.trim();
                  
                  if (!inFunction && !trimmed) continue;
                  
                  if (trimmed.startsWith('def ') || trimmed.startsWith('class ') || 
                      trimmed.includes('function') || trimmed.includes('{')) {
                    inFunction = true;
                  }
                  
                  if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
                    inDocstring = !inDocstring;
                    continue;
                  }
                  if (inDocstring) continue;
                  
                  if (trimmed.startsWith('#') || trimmed.startsWith('//') || 
                      trimmed.startsWith('nums = ') || trimmed.startsWith('target = ') ||
                      trimmed.startsWith('result = ') || trimmed.startsWith('print(')) {
                    continue;
                  }
                  
                  if (trimmed.startsWith('**') || trimmed.startsWith('*Time') || 
                      trimmed.startsWith('*Space') || trimmed.includes('Explanation:')) {
                    break;
                  }
                  
                  if (inFunction && trimmed) {
                    codeLines.push(line);
                  }
                }
                
                return codeLines.join('\n').trim();
              })()}
            </pre>
          </CardContent>
        </Card>

        {/* Approach */}
        {solutionData?.approach && (
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-blue-800">Solution Approach</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-700 text-base leading-relaxed">
                {(() => {
                  // Extract approach from the full solution text
                  const fullText = solutionData?.solution || '';
                  const lines = fullText.split('\n');
                  const approachLines = [];
                  let inExplanation = false;
                  
                  for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line.includes('Explanation:') || line.includes('Algorithm:') || line.includes('Approach:')) {
                      inExplanation = true;
                      continue;
                    }
                    if (inExplanation && line.startsWith('1.') && line.includes('function')) {
                      // Found the main explanation section
                      for (let j = i; j < Math.min(i + 3, lines.length); j++) {
                        const explanationLine = lines[j].trim();
                        if (explanationLine && !explanationLine.startsWith('2.') && !explanationLine.startsWith('3.')) {
                          approachLines.push(explanationLine.replace(/^\d+\.\s*/, ''));
                        }
                      }
                      break;
                    }
                  }
                  
                  return approachLines.length > 0 ? approachLines.join(' ') : 
                    'Use a hash map to store numbers and their indices for O(1) lookup time, enabling single-pass solution.';
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Algorithm Steps */}
        {solutionData?.algorithm && (
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-purple-800">Step-by-Step Algorithm</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  // Extract algorithm steps from the full solution text
                  const fullText = solutionData?.solution || '';
                  const lines = fullText.split('\n');
                  const steps = [];
                  
                  for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line.match(/^\d+\./)) {
                      // Found a numbered step
                      const stepText = line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '');
                      if (stepText.length > 10 && !stepText.includes('function')) {
                        steps.push(stepText);
                      }
                    }
                  }
                  
                  // Fallback steps if none found
                  if (steps.length === 0) {
                    steps.push(
                      'Initialize an empty hash map to store numbers and indices',
                      'Iterate through the array with index and value',
                      'Calculate the complement needed to reach target',
                      'Check if complement exists in hash map',
                      'Return indices if found, otherwise store current number'
                    );
                  }
                  
                  return steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 bg-white rounded-lg border border-purple-200">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-slate-700 text-base leading-relaxed">{step}</span>
                    </div>
                  ));
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complexity */}
        {solutionData?.complexity && (
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-green-800">Performance Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="text-slate-700 text-base leading-relaxed font-medium">
                  {(() => {
                    // Extract complexity from the full solution text
                    const fullText = solutionData?.solution || '';
                    const lines = fullText.split('\n');
                    let timeComplexity = '';
                    let spaceComplexity = '';
                    
                    for (const line of lines) {
                      if (line.includes('Time Complexity:') || line.includes('Time:')) {
                        timeComplexity = line.replace(/.*Time.*?:/i, '').trim().replace(/[\*\-]/g, '').trim();
                      }
                      if (line.includes('Space Complexity:') || line.includes('Space:')) {
                        spaceComplexity = line.replace(/.*Space.*?:/i, '').trim().replace(/[\*\-]/g, '').trim();
                      }
                    }
                    
                    if (!timeComplexity && !spaceComplexity) {
                      return 'Time Complexity: O(n) - Single pass through array. Space Complexity: O(n) - Hash map storage.';
                    }
                    
                    return (
                      <div className="space-y-2">
                        {timeComplexity && <div><strong>Time:</strong> {timeComplexity}</div>}
                        {spaceComplexity && <div><strong>Space:</strong> {spaceComplexity}</div>}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Example Walkthrough */}
        {solutionData?.example && (
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <span className="text-orange-800">Example Walkthrough</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-6 border border-orange-200">
                <pre className="text-sm text-green-400 whitespace-pre-wrap font-mono leading-relaxed">
                  {(() => {
                    // Extract example from the full solution text
                    const fullText = solutionData?.solution || '';
                    const lines = fullText.split('\n');
                    const exampleLines = [];
                    let inExample = false;
                    
                    for (const line of lines) {
                      if (line.includes('nums = [') || line.includes('target = ') || line.includes('result = ')) {
                        inExample = true;
                        exampleLines.push(line);
                      } else if (inExample && line.includes('print(')) {
                        exampleLines.push(line);
                      } else if (inExample && line.trim() === '') {
                        continue;
                      } else if (inExample && !line.trim().startsWith('nums') && !line.trim().startsWith('target') && !line.trim().startsWith('result') && !line.trim().startsWith('print')) {
                        break;
                      }
                    }
                    
                    if (exampleLines.length === 0) {
                      return 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: nums[0] + nums[1] = 2 + 7 = 9';
                    }
                    
                    return exampleLines.join('\n');
                  })()}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">🎉 Solution Ready!</h3>
                <p className="text-blue-100">Copy the code above and paste it directly into the LeetCode editor to submit your solution.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl shadow-lg overflow-hidden">
                <img src="./logo.png" alt="LeetCode AI Solver" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LeetCode AI Solver
                </h1>
                <p className="text-sm text-gray-600">Clean code ready for LeetCode</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-4 md:px-4 md:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 md:gap-8">
              {/* Input Panel */}
              <div className="lg:col-span-2">
                <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 lg:sticky lg:top-24">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      Problem Input
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        Programming Language
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search languages..."
                          value={languageSearch}
                          onChange={(e) => setLanguageSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                        />
                      </div>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="h-10 md:h-12 border-2 hover:border-blue-300 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages
                            .filter(lang => lang.label.toLowerCase().includes(languageSearch.toLowerCase()))
                            .map(lang => (
                            <SelectItem key={lang.value} value={lang.value} className="py-2 md:py-3">
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        Problem Name
                      </label>
                      <input
                        type="text"
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="Enter problem name (e.g., Two Sum, Valid Parentheses, Merge Two Sorted Lists)"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 focus:border-blue-500 focus:outline-none text-sm"
                      />
                      {problem.trim().length > 0 && problem.trim().length < 3 && (
                        <p className="text-xs text-red-600">Problem name must be at least 3 characters long</p>
                      )}
                    </div>
                    
                    <Button
                      onClick={handleGetSolution}
                      disabled={!problem.trim() || problem.trim().length < 3 || loading}
                      className="w-full h-10 md:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 text-sm md:text-base"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                          Generate Solution
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Solution Panel */}
              <div className="lg:col-span-3 mt-4 lg:mt-0">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-2 md:gap-3 mb-4">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Terminal className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                    <h2 className="text-lg md:text-2xl font-bold text-gray-900">Generated Solution</h2>
                  </div>
                  {renderSolution()}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}