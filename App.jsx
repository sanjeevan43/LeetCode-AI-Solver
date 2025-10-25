import { useState, useEffect } from 'react';
import { Send, Loader, Code2, Brain, Copy, Check, Wifi, WifiOff, Terminal, Sparkles, Play, Zap } from 'lucide-react';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
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
    { value: 'typescript', label: '🔷 TypeScript' },
    { value: 'php', label: '🐘 PHP' },
    { value: 'ruby', label: '💎 Ruby' },
    { value: 'swift', label: '🍎 Swift' },
    { value: 'kotlin', label: '🟣 Kotlin' },
    { value: 'scala', label: '🔴 Scala' },
    { value: 'dart', label: '🎯 Dart' }
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
    const isOnline = await api.checkStatus();
    setApiStatus(isOnline ? 'online' : 'offline');
  };

  const handleGetSolution = async () => {
    if (!problem.trim()) return;
    setLoading(true);
    setSolution('🤖 Analyzing your problem and generating solutions...');
    try {
      const result = await api.solveProblem(problem, [selectedLanguage]);
      setSolution(result);
    } catch (error) {
      setSolution(`❌ Error: ${error.message}\n\nPlease try again or check your internet connection.`);
    } finally {
      setLoading(false);
    }
  };

  const renderSolution = () => {
    if (!solution) return (
      <div className="flex flex-col items-center justify-center h-full py-16">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce"></div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Ready to Solve!</h3>
        <p className="text-center text-gray-600 text-sm max-w-md leading-relaxed">
          Paste your LeetCode problem above and get AI-powered solutions with detailed explanations and optimized code
        </p>
      </div>
    );

    const sections = [];
    const lines = solution.split('\n');
    let currentSection = { type: 'text', content: [], title: '' };
    
    lines.forEach(line => {
      if (line.startsWith('## ')) {
        if (currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        currentSection = { type: 'text', content: [], title: line.replace('## ', '') };
      } else if (line.trim() === 'python' || line.trim() === 'javascript' || line.trim() === 'java' || line.trim() === 'cpp' || line.trim() === 'csharp' || line.trim() === 'go' || line.trim() === 'rust' || line.trim() === 'typescript' || line.trim() === 'php' || line.trim() === 'ruby' || line.trim() === 'swift' || line.trim() === 'kotlin' || line.trim() === 'scala' || line.trim() === 'dart') {
        if (currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        currentSection = { type: 'code', content: [], title: line.trim() };
      } else if (line.startsWith('### ')) {
        if (currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        currentSection = { type: 'text', content: [], title: line.replace('### ', '') };
      } else if (line.trim()) {
        currentSection.content.push(line);
      }
    });
    
    if (currentSection.content.length > 0) {
      sections.push(currentSection);
    }
    
    return (
      <div className="space-y-6">
        {sections
          .filter(section => section.type !== 'code' || section.title === selectedLanguage)
          .map((section, index) => (
            <div key={index} className="space-y-3">
              {section.title && (
                <div className="flex items-center gap-2">
                  {section.type === 'code' ? (
                    <Terminal className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  )}
                  <Badge variant="secondary" className="font-medium">
                    {section.title}
                  </Badge>
                </div>
              )}
              {section.type === 'code' ? (
                <div className="relative bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-300 font-mono font-medium">
                        {languages.find(l => l.value === section.title)?.label || section.title}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
                      onClick={() => copyToClipboard(section.content.join('\n'), index)}
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <pre className="p-4 text-sm text-gray-100 font-mono overflow-x-auto leading-relaxed bg-gray-900">
                    {section.content.join('\n')}
                  </pre>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-xl p-5 shadow-sm">
                  <div className="prose prose-sm max-w-none">
                    {section.content.map((line, i) => (
                      <p key={i} className={`text-gray-700 leading-relaxed mb-3 last:mb-0 ${
                        line.startsWith('- ') ? 'ml-4' : ''
                      }`}>
                        {line.replace(/^- /, '• ').split('**').map((part, j) => 
                          j % 2 === 1 ? <strong key={j} className="font-semibold text-gray-900">{part}</strong> : part
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        }
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LeetCode AI Solver
                </h1>
                <p className="text-sm text-gray-600">AI-powered coding solutions</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200">
              {apiStatus === 'online' ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">Online</span>
                </>
              ) : apiStatus === 'offline' ? (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">Offline</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <Loader className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-sm font-medium text-blue-600">Connecting...</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
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
                  placeholder="Paste your LeetCode problem description here...\n\nExample:\nGiven an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
                  className="h-80 font-mono text-sm resize-none border-2 focus:border-blue-500 transition-all duration-200 rounded-xl"
                />
              </div>
              
              <Button
                onClick={handleGetSolution}
                disabled={loading || !problem.trim()}
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    Generating Solution...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Solve Problem
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                AI Solution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {renderSolution()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}