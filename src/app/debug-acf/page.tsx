'use client';

import { useState, useEffect } from 'react';
import { wooCommerceAPI } from '../../lib/woocommerce';

export default function DebugACF() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testProduct, setTestProduct] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch products with ACF fields
        const productsData = await wooCommerceAPI.getProducts({ per_page: 10 });
        setProducts(productsData);
        
        // Test single product fetch if we have products
        if (productsData.length > 0) {
          const singleProduct = await wooCommerceAPI.getProduct(productsData[0].id);
          setTestProduct(singleProduct);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
        <p>Loading ACF fields...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-black text-red-500 p-8">
      <h1 className="text-3xl font-bold mb-4">Error Loading ACF Fields</h1>
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
        <p className="mb-2"><strong>Error:</strong> {error}</p>
        <p className="text-sm text-red-300">Check your WooCommerce API configuration and ensure ACF fields are properly set up.</p>
      </div>
    </div>
  );

  const acfFieldsCount = products.filter(p => p.acf && Object.keys(p.acf).length > 0).length;
  const expectedACFFields = {
    'edibles/moonwater': ['strength_mg', 'effects'],
    'flower/vape/concentrate': ['thca_%', 'strain_type', 'nose', 'effects', 'dominent_terpene', 'lineage']
  };

  // Check field mapping for edibles specifically
  const edibleProducts = products.filter(p => 
    p.categories?.some((cat: any) => 
      ['edibles', 'edible', 'moonwater'].includes(cat.name.toLowerCase())
    )
  );
  
  const ediblesWithACF = edibleProducts.filter(p => 
    p.acf && (p.acf.strength_mg || p.acf.effects)
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">ACF Fields Integration Status</h1>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-green-400">{products.length}</h3>
            <p className="text-gray-300">Total Products</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-blue-400">{acfFieldsCount}</h3>
            <p className="text-gray-300">Products with ACF</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-orange-400">{edibleProducts.length}</h3>
            <p className="text-gray-300">Edible Products</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-purple-400">{ediblesWithACF.length}</h3>
            <p className="text-gray-300">Edibles with ACF</p>
          </div>
        </div>

        {/* Expected ACF Fields */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Expected ACF Fields</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(expectedACFFields).map(([category, fields]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2 capitalize">
                  {category.replace('/', ' / ')}
                </h3>
                <ul className="space-y-1">
                  {fields.map(field => (
                    <li key={field} className="text-gray-300 text-sm">
                      • <code className="bg-gray-800 px-2 py-1 rounded">{field}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Edible Products Specific Analysis */}
        {edibleProducts.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">🍯 Edible Products Field Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Field Coverage</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Products with strength_mg:</span>
                    <span className="text-green-400">
                      {edibleProducts.filter(p => p.acf?.strength_mg).length}/{edibleProducts.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Products with effects:</span>
                    <span className="text-green-400">
                      {edibleProducts.filter(p => p.acf?.effects).length}/{edibleProducts.length}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Sample Values</h3>
                {ediblesWithACF.length > 0 && (
                  <div className="space-y-1 text-sm">
                    <div>
                      <strong>Sample strength_mg:</strong>
                      <div className="text-gray-300 ml-2">
                        {ediblesWithACF.filter(p => p.acf?.strength_mg)
                          .slice(0, 3)
                          .map(p => `"${p.acf.strength_mg}"`)
                          .join(', ') || 'None found'}
                      </div>
                    </div>
                    <div>
                      <strong>Sample effects:</strong>
                      <div className="text-gray-300 ml-2">
                        {ediblesWithACF.filter(p => p.acf?.effects)
                          .slice(0, 2)
                          .map(p => `"${p.acf.effects?.substring(0, 50)}..."`)
                          .join(', ') || 'None found'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Single Product Test */}
        {testProduct && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Single Product API Test</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-400 mb-2">{testProduct.name}</h3>
              <p className="text-sm text-gray-400 mb-4">Testing individual product fetch with ID: {testProduct.id}</p>
              
              {testProduct.acf ? (
                <div className="space-y-2">
                  <p className="text-emerald-400 font-medium">✅ ACF Fields Found:</p>
                  {Object.entries(testProduct.acf).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="text-blue-300 w-32">{key}:</span>
                      <span className="text-white">{value as string || 'Empty'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-red-400">❌ No ACF fields found in single product fetch</p>
              )}
            </div>
          </div>
        )}
        
        {/* Products List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Products with ACF Data</h2>
          {products.map((product) => (
            <div key={product.id} className="border border-gray-700 rounded-lg p-6 bg-gray-900">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                  <p className="text-gray-400">ID: {product.id} | Price: ${product.price}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.acf && Object.keys(product.acf).length > 0 
                      ? 'bg-green-600/20 text-green-400 border border-green-500/50' 
                      : 'bg-red-600/20 text-red-400 border border-red-500/50'
                  }`}>
                    {product.acf && Object.keys(product.acf).length > 0 ? 'ACF ✅' : 'No ACF ❌'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-lg font-medium mb-2 text-blue-400">Basic Info</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Categories:</strong> {product.categories?.map((cat: any) => cat.name).join(', ') || 'None'}</p>
                    <p><strong>Tags:</strong> {product.tags?.map((tag: any) => tag.name).join(', ') || 'None'}</p>
                    <p><strong>Status:</strong> {product.status}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2 text-emerald-400">ACF Fields</h4>
                  {product.acf && Object.keys(product.acf).length > 0 ? (
                    <div className="space-y-1 text-sm">
                      {Object.entries(product.acf).map(([key, value]) => (
                        <div key={key} className="flex">
                          <span className="text-gray-400 w-20 flex-shrink-0">{key}:</span>
                          <span className="text-white break-words">{value as string || 'Empty'}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No ACF fields found</p>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2 text-purple-400">Raw Data</h4>
                  <div className="bg-gray-800 rounded p-2 text-xs overflow-auto max-h-32">
                    <pre className="text-gray-300">
                      {JSON.stringify({ 
                        id: product.id, 
                        acf: product.acf,
                        categories: product.categories?.map((c: any) => c.slug),
                        meta_data: product.meta_data?.slice(0, 3) // Show first 3 meta items
                      }, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Troubleshooting Guide */}
        {acfFieldsCount === 0 && (
          <div className="mt-8 bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">🔧 Troubleshooting Guide</h3>
            <div className="space-y-3 text-sm">
              <p><strong>1. Check ACF Plugin:</strong> Ensure Advanced Custom Fields is installed and active in WordPress</p>
              <p><strong>2. Verify Field Groups:</strong> Make sure your ACF field groups are published and assigned to product categories</p>
              <p><strong>3. API Permissions:</strong> Check that your WooCommerce API user has read access to custom fields</p>
              <p><strong>4. Field Values:</strong> Ensure your products have ACF field values filled in WordPress admin</p>
              <p><strong>5. REST API:</strong> Try accessing: <code className="bg-gray-800 px-2 py-1 rounded">your-site.com/wp-json/wc/v3/products?acf_format=standard</code></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 