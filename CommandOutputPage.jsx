import { CommandOutput } from "./components/CommandOutput"

function CommandOutputPage() {
  const buildOutput = `> leet-code-ai@0.0.0 build
> vite build

vite v4.5.14 building for production...
transforming...

✓ 1340 modules transformed.

rendering chunks...
computing gzip size...
dist/index.html                   0.47 kB │ gzip:  0.30 kB
dist/assets/index-4587ccc7.css   24.99 kB │ gzip:  5.15 kB
dist/assets/index-c6e90e4c.js   257.06 kB │ gzip: 84.27 kB
✓ built in 20.17s`

  const buildExplanation = `Build completed successfully! The Vite build process transformed 1340 modules and generated optimized production files in the dist/ folder. The main bundle is 257KB (84KB gzipped) with CSS at 25KB (5KB gzipped). Total build time was 20.17 seconds.`

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Command Output Display</h1>
        
        <CommandOutput 
          command="npm run build"
          output={buildOutput}
          explanation={buildExplanation}
          status="success"
        />
      </div>
    </div>
  )
}

export default CommandOutputPage