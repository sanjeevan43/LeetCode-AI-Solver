import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

export function CommandOutput({ command, output, explanation, status = "success" }) {
  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant={status === "success" ? "default" : "destructive"}>
          {status === "success" ? "✓ Success" : "✗ Error"}
        </Badge>
        <span className="text-sm text-muted-foreground">Command: {command}</span>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap">
              {output}
            </pre>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-sm leading-relaxed">{explanation}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}