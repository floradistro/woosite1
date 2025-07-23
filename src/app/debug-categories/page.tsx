'use client';

import { useState, useEffect } from 'react';
import { wooCommerceAPI } from '../../lib/woocommerce';

export default function DebugCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, productsData] = await Promise.all([
          wooCommerceAPI.getCategories(),
          wooCommerceAPI.getProducts({ per_page: 50 })
        ]);
        
        setCategories(categoriesData);
        setProducts(productsData);


      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">WooCommerce Debug - Categories & Products</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Categories ({categories.length})</h2>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="border p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-sm text-gray-600">ID: {category.id} | Slug: {category.slug}</p>
                <p className="text-sm text-gray-600">Products: {category.count}</p>
                {category.description && (
                  <p className="text-sm mt-2">{category.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Products ({products.length})</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {products.map((product) => (
              <div key={product.id} className="border p-4 rounded-lg">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">ID: {product.id} | Type: {product.type}</p>
                <p className="text-sm text-gray-600">Price: ${product.price}</p>
                <p className="text-sm text-gray-600">
                  Categories: {product.categories?.map((c: any) => c.name).join(', ') || 'None'}
                </p>
                <p className="text-sm text-gray-600">
                  Tags: {product.tags?.map((t: any) => t.name).join(', ') || 'None'}
                </p>
                {product.images && product.images.length > 0 && (
                  <div className="mt-2">
                    <img 
                      src={product.images[0].src} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 