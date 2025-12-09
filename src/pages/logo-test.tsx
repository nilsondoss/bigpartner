 /**
 * Logo Test Page
 * 
 * This page tests different ways to display the logo to diagnose display issues
 */

export default function LogoTest() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Logo Display Test</h1>
      
      <div className="space-y-6">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Test 1: Direct Path</h2>
          <img src="/assets/Logo.png" alt="Logo Test 1" className="h-16" />
          <p className="text-sm text-muted-foreground mt-2">Path: /assets/Logo.png</p>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Test 2: Absolute Path</h2>
          <img src="https://lmnesop1a2.preview.c24.airoapp.ai/assets/Logo.png" alt="Logo Test 2" className="h-16" />
          <p className="text-sm text-muted-foreground mt-2">Path: Full URL</p>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Test 3: Different Sizes</h2>
          <div className="flex gap-4 items-end">
            <div>
              <img src="/assets/Logo.png" alt="Logo Small" className="h-8" />
              <p className="text-xs">h-8 (32px)</p>
            </div>
            <div>
              <img src="/assets/Logo.png" alt="Logo Medium" className="h-16" />
              <p className="text-xs">h-16 (64px)</p>
            </div>
            <div>
              <img src="/assets/Logo.png" alt="Logo Large" className="h-24" />
              <p className="text-xs">h-24 (96px)</p>
            </div>
          </div>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Test 4: Background Image</h2>
          <div 
            className="h-16 w-64 bg-contain bg-no-repeat bg-center" 
            style={{ backgroundImage: 'url(/assets/Logo.png)' }}
          />
          <p className="text-sm text-muted-foreground mt-2">Using background-image CSS</p>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Test 5: With Error Handler</h2>
          <img 
            src="/assets/Logo.png" 
            alt="Logo with error handler" 
            className="h-16"
            onError={(e) => {
              console.error('Logo failed to load');
              e.currentTarget.style.border = '2px solid red';
            }}
            onLoad={() => {
              console.log('Logo loaded successfully');
            }}
          />
          <p className="text-sm text-muted-foreground mt-2">Check browser console for load status</p>
        </div>

        <div className="border p-4 rounded bg-muted">
          <h2 className="text-xl font-semibold mb-4">Diagnostic Info</h2>
          <div className="space-y-2 text-sm font-mono">
            <p>Current URL: {window.location.href}</p>
            <p>Origin: {window.location.origin}</p>
            <p>Expected Logo Path: {window.location.origin}/assets/Logo.png</p>
          </div>
        </div>
      </div>
    </div>
  );
}
