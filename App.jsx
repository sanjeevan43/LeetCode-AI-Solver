import { useState, useEffect } from 'react';
import { Loader, Code2, Brain, Copy, Check, Wifi, WifiOff, Terminal, Sparkles, Zap, RefreshCw, Lightbulb } from 'lucide-react';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { api } from './lib/api';

export default function LeetCodeHelper() {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [apiStatus, setApiStatus] = useState('checking');

  const languages = [
    { value: 'python', label: '🐍 Python' },
    { value: 'javascript', label: '🟨 JavaScript' },
    { value: 'java', label: '☕ Java' },
    { value: 'cpp', label: '⚡ C++' },
    { value: 'csharp', label: '🔷 C#' },
    { value: 'go', label: '🐹 Go' },
    { value: 'rust', label: '🦀 Rust' },
    { value: 'typescript', label: '🔷 TypeScript' }
  ];

  const copyToClipboard = async (text, index) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    setApiStatus('checking');
    try {
      const isOnline = await api.checkStatus();
      setApiStatus(isOnline ? 'online' : 'offline');
    } catch (error) {
      setApiStatus('offline');
    }
  };

  const handleGetSolution = async () => {
    if (!problem.trim()) return;
    setLoading(true);
    setSolution('🤖 Generating LeetCode solution...');
    
    try {
      const solution = await api.solveProblem(problem, selectedLanguage);
      setSolution(solution);
    } catch (error) {
      setSolution('Error generating solution. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatSolution = (solutionText) => {
    const sections = solutionText.split(/## /g).filter(Boolean);
    return sections.map((section, index) => {
      const lines = section.split('\n');
      const title = lines[0];
      const content = lines.slice(1).join('\n').trim();
      
      if (title.includes('💻 Solution')) {
        const codeMatch = content.match(/```\w+\n([\s\S]*?)```/);
        const code = codeMatch ? codeMatch[1] : content;
        return {
          type: 'code',
          title: '💻 Solution',
          content: code
        };
      } else if (title.includes('⏱️ Complexity')) {
        return {
          type: 'complexity',
          title: '⏱️ Complexity Analysis',
          content: content
        };
      } else if (title.includes('📝 Explanation')) {
        return {
          type: 'explanation',
          title: '📝 Explanation',
          content: content
        };
      } else if (title.includes('🚀 Key Optimizations')) {
        return {
          type: 'optimizations',
          title: '🚀 Key Optimizations',
          content: content
        };
      } else if (title.includes('🔍 Edge Cases')) {
        return {
          type: 'edge-cases',
          title: '🔍 Edge Cases Handled',
          content: content
        };
      }
      return null;
    }).filter(Boolean);
  };

  const renderSolution = () => {
    if (!solution) return (
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

    // Check if solution is structured (contains ##)
    if (solution.includes('##')) {
      const sections = formatSolution(solution);
      return (
        <div className="space-y-6">
          {sections.map((section, index) => {
            if (section.type === 'code') {
              return (
                <div key={index} className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <Badge variant="secondary" className="bg-slate-700 text-slate-200 hover:bg-slate-600">
                        {languages.find(l => l.value === selectedLanguage)?.label || selectedLanguage}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
                      onClick={() => copyToClipboard(section.content, index)}
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <pre className="p-6 text-sm text-slate-100 font-mono overflow-x-auto leading-relaxed bg-slate-900">
                    {section.content}
                  </pre>
                </div>
              );
            } else if (section.type === 'complexity') {
              const timeMatch = section.content.match(/\*\*Time Complexity:\*\* (.+)/)
              const spaceMatch = section.content.match(/\*\*Space Complexity:\*\* (.+)/)
              return (
                <Card key={index} className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {timeMatch && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        Time: {timeMatch[1]}
                      </Badge>
                    )}
                    {spaceMatch && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                        Space: {spaceMatch[1]}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            } else {
              return (
                <Card key={index} className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {section.content.split('\n').map((line, i) => {
                        if (line.startsWith('- ')) {
                          return (
                            <div key={i} className="flex items-start gap-2 mb-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-slate-700">{line.substring(2)}</span>
                            </div>
                          );
                        }
                        return line && <p key={i} className="text-slate-700 mb-2">{line}</p>;
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            }
          })}
          <Alert className="bg-blue-50 border-blue-200">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Solution ready! Copy the code above and paste it directly into the LeetCode editor.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    // Fallback for unstructured solution
    return (
      <div className="space-y-4">
        <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <Badge variant="secondary" className="bg-slate-700 text-slate-200 hover:bg-slate-600">
                {languages.find(l => l.value === selectedLanguage)?.label || selectedLanguage}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
              onClick={() => copyToClipboard(solution, 0)}
            >
              {copiedIndex === 0 ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <pre className="p-6 text-sm text-slate-100 font-mono overflow-x-auto leading-relaxed bg-slate-900">
            {solution}
          </pre>
        </div>
        <Alert className="bg-blue-50 border-blue-200">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Solution ready! Copy the code above and paste it directly into the LeetCode editor.
          </AlertDescription>
        </Alert>
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
            <div className="flex items-center gap-3">
              <Badge 
                variant={apiStatus === 'online' ? 'default' : apiStatus === 'offline' ? 'destructive' : 'secondary'}
                className={`px-3 py-1 ${apiStatus === 'online' ? 'bg-green-100 text-green-700 border-green-200' : 
                  apiStatus === 'offline' ? 'bg-red-100 text-red-700 border-red-200' : 
                  'bg-blue-100 text-blue-700 border-blue-200'}`}
              >
                {apiStatus === 'online' ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <Wifi className="w-3 h-3 mr-1" />
                    Online
                  </>
                ) : apiStatus === 'offline' ? (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <WifiOff className="w-3 h-3 mr-1" />
                    Offline
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    <Loader className="w-3 h-3 animate-spin mr-1" />
                    Connecting
                  </>
                )}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={checkApiStatus}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Input Panel */}
              <div className="lg:col-span-2">
                <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 sticky top-24">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      Problem Input
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        Programming Language
                      </label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map(lang => (
                            <SelectItem key={lang.value} value={lang.value} className="py-3">
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        LeetCode Problem Description
                      </label>
                      <Textarea
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="Paste your LeetCode problem description here..."
                        className="min-h-[200px] border-2 hover:border-blue-300 focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>
                    
                    <Button
                      onClick={handleGetSolution}
                      disabled={!problem.trim() || loading}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" />
                          Generating Solution...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Solution
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Solution Panel */}
              <div className="lg:col-span-3">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Terminal className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Generated Solution</h2>
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