export default function IconVerification() {
  const icons = [
    { name: 'Vape Icon', path: '/icons/vapeicon2.png' },
    { name: 'Concentrate Icon', path: '/icons/concentrate.png' },
    { name: 'Pre-roll Icon', path: '/icons/pre-roll.png' },
    { name: 'Gummy Icon', path: '/icons/newGummy.webp' },
    { name: 'Flower Icon', path: '/icons/FLOWER.png' },
    { name: 'Merch Icon', path: '/icons/MERCH.png' },
    { name: 'Moonwater Icon', path: '/icons/Moonwater.png' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Icon Verification Page</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {icons.map((icon) => (
          <div key={icon.name} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold mb-2">{icon.name}</h3>
            <img 
              src={icon.path} 
              alt={icon.name}
              className="w-full h-32 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.border = '2px solid red';
                target.alt = `Failed to load: ${icon.path}`;
              }}
            />
            <p className="text-xs text-gray-500 mt-2">{icon.path}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-blue-50 rounded">
        <p className="text-sm">
          <strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Loading...'}
        </p>
        <p className="text-sm mt-2">
          <strong>Note:</strong> If you're viewing this on floradistro.com and icons aren't loading, 
          it's because that domain points to Shopify, not this Vercel deployment.
        </p>
        <p className="text-sm mt-2">
          <strong>Vercel URLs to check:</strong>
        </p>
        <ul className="text-sm mt-1 list-disc list-inside">
          <li><a href="https://woosite1.vercel.app/icon-verification" className="text-blue-600 underline">https://woosite1.vercel.app/icon-verification</a></li>
          <li><a href="https://woosite1-floradistros-projects.vercel.app/icon-verification" className="text-blue-600 underline">https://woosite1-floradistros-projects.vercel.app/icon-verification</a></li>
        </ul>
      </div>
    </div>
  );
} 