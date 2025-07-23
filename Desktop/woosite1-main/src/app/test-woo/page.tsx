'use client';

import { useState, useEffect } from 'react';
import { wooCommerceAPI } from '../../lib/woocommerce';

export default function TestWooCommerce() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [envVars, setEnvVars] = useState<any>({});
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [directTestResult, setDirectTestResult] = useState<string>('');
  const [serverTestResult, setServerTestResult] = useState<string>('');

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      storeUrl: process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL,
      consumerKey: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY,
      consumerSecret: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET,
      useWooCommerce: process.env.NEXT_PUBLIC_USE_WOOCOMMERCE,
    });

    // Test WooCommerce API
    async function testAPI() {
      try {
        console.log('Testing WooCommerce API...');
        const result = await wooCommerceAPI.getProducts({ per_page: 20 });
        console.log('API Result:', result);
        setProducts(result);
        setRawResponse(result);
      } catch (err) {
        console.error('API Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setRawResponse({ error: err });
      } finally {
        setLoading(false);
      }
    }

    // Test Categories
    async function testCategories() {
      try {
        const result = await wooCommerceAPI.getCategories();
        console.log('Categories:', result);
        setCategories(result);
      } catch (err) {
        console.error('Categories Error:', err);
      }
    }

    // Direct fetch test
    async function directTest() {
      try {
        const url = `https://distropass.wpcomstaging.com/wp-json/wc/v3/products?consumer_key=ck_b05fd93fe568ef52be9eb7f75be2cfa8901c9524&consumer_secret=cs_74985b331a803f2fddd88ed1883c4572f89487df&per_page=20`;
        const response = await fetch(url);
        const data = await response.json();
        setDirectTestResult(JSON.stringify({ status: response.status, data }, null, 2));
      } catch (err) {
        setDirectTestResult(`Direct fetch error: ${err}`);
      }
    }

    // Server-side API test
    async function serverTest() {
      try {
        const response = await fetch('/api/test-woo');
        const data = await response.json();
        setServerTestResult(JSON.stringify({ status: response.status, data }, null, 2));
      } catch (err) {
        setServerTestResult(`Server API error: ${err}`);
      }
    }

    testAPI();
    testCategories();
    directTest();
    serverTest();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">WooCommerce Connection Test</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Environment Variables:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">API Status:</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {!loading && !error && <p className="text-green-600">Success!</p>}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Categories ({categories.length}):</h2>
        <div className="bg-purple-50 p-4 rounded text-sm overflow-x-auto max-h-96">
          {categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((cat, index) => (
                <div key={index} className="border-b pb-2">
                  <p><strong>ID:</strong> {cat.id} | <strong>Name:</strong> {cat.name} | <strong>Slug:</strong> {cat.slug}</p>
                  <p><strong>Count:</strong> {cat.count} products</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No categories found</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Direct Fetch Test:</h2>
        <pre className="bg-yellow-50 p-4 rounded text-sm overflow-x-auto max-h-96">
          {directTestResult || 'Loading...'}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Server-Side API Test:</h2>
        <pre className="bg-blue-50 p-4 rounded text-sm overflow-x-auto max-h-96">
          {serverTestResult || 'Loading...'}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Raw API Response:</h2>
        <pre className="bg-blue-50 p-4 rounded text-sm overflow-x-auto max-h-96">
          {JSON.stringify(rawResponse, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">All Products ({products.length}):</h2>
        {products.length > 0 ? (
          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={index} className="border p-4 rounded">
                <h3 className="font-semibold">{product.name}</h3>
                <p><strong>ID:</strong> {product.id}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Status:</strong> {product.status}</p>
                <p><strong>Type:</strong> {product.type}</p>
                <p><strong>Categories:</strong> {product.categories?.map((c: any) => c.name).join(', ') || 'None'}</p>
                <p><strong>Description:</strong> {product.short_description || 'No description'}</p>
                {product.images && product.images.length > 0 && (
                  <p><strong>Image:</strong> {product.images[0].src}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products found</p>
        )}
      </div>
    </div>
  );
} 