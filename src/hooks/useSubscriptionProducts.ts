'use client';

import { useState, useEffect } from 'react';

export interface SubscriptionProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  regular_price: number;
  sale_price: number | null;
  description: string;
  short_description: string;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  attributes: any[];
  acf: any;
  meta_data: any[];
  savings: number;
}

export function useSubscriptionProducts() {
  const [products, setProducts] = useState<SubscriptionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try multiple search approaches
        const searchTerms = ['subscription', 'club', 'drop', 'vault', 'bundle', 'all'];
        let allProducts: SubscriptionProduct[] = [];
        
        for (const searchTerm of searchTerms) {
          try {
            const response = await fetch(`/api/woo-subscriptions?search=${searchTerm}`);
            const data = await response.json();

            if (response.ok && data.products && data.products.length > 0) {
              // Add products that aren't already in the list
              const newProducts = data.products.filter((newProduct: SubscriptionProduct) => 
                !allProducts.some(existingProduct => existingProduct.id === newProduct.id)
              );
              allProducts = [...allProducts, ...newProducts];
              
              // If we found products with a specific search term, we can break
              if (searchTerm !== 'all' && data.products.length > 0) {
                break;
              }
            }
          } catch (searchError) {
            console.warn(`Search term "${searchTerm}" failed:`, searchError);
          }
        }

        setProducts(allProducts);
        
        if (allProducts.length === 0) {
          console.warn('No subscription products found with any search term');
        }
        
      } catch (err) {
        console.error('Error fetching subscription products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch subscription products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionProducts();
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const searchTerms = ['subscription', 'club', 'drop', 'vault', 'bundle', 'all'];
      let allProducts: SubscriptionProduct[] = [];
      
      for (const searchTerm of searchTerms) {
        try {
          const response = await fetch(`/api/woo-subscriptions?search=${searchTerm}`);
          const data = await response.json();

          if (response.ok && data.products && data.products.length > 0) {
            const newProducts = data.products.filter((newProduct: SubscriptionProduct) => 
              !allProducts.some(existingProduct => existingProduct.id === newProduct.id)
            );
            allProducts = [...allProducts, ...newProducts];
            
            if (searchTerm !== 'all' && data.products.length > 0) {
              break;
            }
          }
        } catch (searchError) {
          console.warn(`Refetch search term "${searchTerm}" failed:`, searchError);
        }
      }

      setProducts(allProducts);
    } catch (err) {
      console.error('Error refetching subscription products:', err);
      setError(err instanceof Error ? err.message : 'Failed to refetch subscription products');
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    refetch
  };
} 