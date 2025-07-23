'use client';

import { useState, useEffect } from 'react';

// Test if JavaScript works
console.log('🚀 JAVASCRIPT IS WORKING!');

export default function LabResultsPage() {
  const [message, setMessage] = useState('Loading...');
  const [coaFiles, setCoaFiles] = useState<string[]>([]);

  useEffect(() => {
    console.log('🚀 useEffect running!');
    setMessage('JavaScript is working!');
    
    // Test Supabase connection
    testSupabase();
  }, []);

  const testSupabase = async () => {
    try {
      console.log('🧪 Testing Supabase...');
      
      // Direct Supabase test
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        'https://sclisxgtuktqgmaanonf.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjbGlzeGd0dWt0cWdtYWFub25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NjMxNDAsImV4cCI6MjA2ODQzOTE0MH0.GpkqGjOCYJ59Bj6MNYxatESAVNjeoN1T1Hp7Px3EYeI'
      );
      
      console.log('✅ Supabase client created');
      
      const { data, error } = await supabase.storage
        .from('coa')
        .list('flower', { limit: 10 });
      
      if (error) {
        console.error('❌ Supabase error:', error);
        setMessage(`Error: ${error.message}`);
      } else {
        console.log('✅ Supabase success:', data);
        setMessage(`Found ${data?.length || 0} COA files!`);
        setCoaFiles(data?.map(f => f.name) || []);
      }
    } catch (err) {
      console.error('❌ Test failed:', err);
      setMessage(`Failed: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gradient-to-r from-green-900 to-green-700 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-center">Lab Results</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto text-center">
            View and download Certificate of Analysis (COA) documents for all our products.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">COA Documents</h2>
          
          <div className="mb-4">
            <p className="text-lg mb-2">Status: {message}</p>
          </div>
          
          {coaFiles.length > 0 && (
            <div>
              <h3 className="text-xl mb-2">Found COA Files:</h3>
              <ul className="list-disc list-inside">
                {coaFiles.map((file, index) => (
                  <li key={index} className="text-green-400">{file}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 