import { useState } from 'react';
import { Send, Loader, Code, BookOpen, Lightbulb, Copy, Check } from 'lucide-react';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { api } from './lib/api';

export default function LeetCodeHelper() {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState(['python', 'javascript', 'java', 'cpp']);

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'typescript', label: 'TypeScript' }
  ];

  const copyToClipboard = async (text, index) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getSectionColor = (title, type) => {
    if (type === 'code') return 'bg-blue-50 border-blue-200';
    if (title.toLowerCase().includes('problem')) return 'bg-purple-50 border-purple-200';
    if (title.toLowerCase().includes('approach')) return 'bg-green-50 border-green-200';
    if (title.toLowerCase().includes('complexity')) return 'bg-orange-50 border-orange-200';
    if (title.toLowerCase().includes('explanation')) return 'bg-yellow-50 border-yellow-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getBadgeColor = (title, type) => {
    if (type === 'code') return 'bg-blue-100 text-blue-800';
    if (title.toLowerCase().includes('problem')) return 'bg-purple-100 text-purple-800';
    if (title.toLowerCase().includes('approach')) return 'bg-green-100 text-green-800';
    if (title.toLowerCase().includes('complexity')) return 'bg-orange-100 text-orange-800';
    if (title.toLowerCase().includes('explanation')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleGetSolution = async () => {
    if (!problem.trim()) return;

    setLoading(true);
    setSolution('🤖 Analyzing your problem and generating solutions...');

    try {
      const result = await api.solveProblem(problem, selectedLanguages);
      setSolution(result);
    } catch (error) {
      setSolution(`❌ Error: ${error.message}\n\nPlease try again or check your internet connection.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">LeetCode Helper</h1>
          <p className="text-muted-foreground">Get AI-powered solutions for LeetCode problems</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Problem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Programming Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map(lang => (
                      <Button
                        key={lang.value}
                        variant={selectedLanguages.includes(lang.value) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setSelectedLanguages(prev => 
                            prev.includes(lang.value) 
                              ? prev.filter(l => l !== lang.value)
                              : [...prev, lang.value]
                          );
                        }}
                      >
                        {lang.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <Textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Paste your LeetCode problem here..."
                  className="h-64 font-mono text-sm resize-none"
                />
                <Button
                  onClick={handleGetSolution}
                  disabled={loading || !problem.trim() || selectedLanguages.length === 0}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Get Solution ({selectedLanguages.length} languages)
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-y-auto">
                {solution ? (
                  <div className="p-4 space-y-4">
                    {(() => {
                      const sections = [];
                      const lines = solution.split('\n');
                      let currentSection = { type: 'text', content: [], title: '' };
                      
                      lines.forEach(line => {
                        if (line.startsWith('## ')) {
                          if (currentSection.content.length > 0) {
                            sections.push(currentSection);
                          }
                          currentSection = { type: 'text', content: [], title: line.replace('## ', '') };
                        } else if (line.trim() === 'python' || line.trim() === 'javascript' || line.trim() === 'java' || line.trim() === 'cpp' || line.trim() === 'csharp' || line.trim() === 'go' || line.trim() === 'rust' || line.trim() === 'typescript') {
                          if (currentSection.content.length > 0) {
                            sections.push(currentSection);
                          }
                          currentSection = { type: 'code', content: [], title: line.trim() };
                        } else if (line.trim()) {
                          currentSection.content.push(line);
                        }
                      });
                      
                      if (currentSection.content.length > 0) {
                        sections.push(currentSection);
                      }
                      
                      return sections.map((section, index) => (
                        <div key={index} className="space-y-2">
                          {section.title && (
                            <div className="flex items-center gap-2 mb-2">
                              {section.type === 'code' ? <Code className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                              <Badge className={getBadgeColor(section.title, section.type)}>
                                {section.title}
                              </Badge>
                            </div>
                          )}
                          {section.type === 'code' ? (
                            <div className={`relative ${getSectionColor(section.title, 'code')} p-4 rounded-md border`}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2 h-8 w-8 p-0"
                                onClick={() => copyToClipboard(section.content.join('\n'), index)}
                              >
                                {copiedIndex === index ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                              <pre className="text-sm overflow-x-auto font-mono leading-relaxed pr-12">
                                {section.content.join('\n')}
                              </pre>
                            </div>
                          ) : (
                            <div className={`${getSectionColor(section.title, 'text')} p-3 rounded-md border text-sm leading-relaxed`}>
                              {section.content.map((line, i) => (
                                <p key={i} className={line.startsWith('- ') ? 'ml-4' : ''}>
                                  {line.replace(/^- /, '• ')}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ));
                    })()
                    }
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <div className="text-2xl mb-2">💡</div>
                      <p className="text-sm">Your AI solution will appear here</p>
                      <p className="text-xs mt-1">Paste a problem and click "Get Solution"</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}