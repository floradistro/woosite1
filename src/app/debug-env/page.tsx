'use client';

export default function DebugEnv() {
  const envVars = {
    'NEXT_PUBLIC_WOOCOMMERCE_STORE_URL': process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL,
    'NEXT_PUBLIC_WP_API': process.env.NEXT_PUBLIC_WP_API,
    'NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY': process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY ? '✓ Set' : '✗ Missing',
    'NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET': process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET ? '✓ Set' : '✗ Missing',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Environment Variables Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current Environment Variables</h2>
          
          <div className="space-y-3">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <code className="text-sm font-mono text-gray-700">{key}</code>
                <span className="text-sm text-gray-600">{value || '✗ Not set'}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">Quick Test</h3>
            <p className="text-sm text-blue-800">
              If you see "✗ Missing" or "✗ Not set" values, restart your development server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 