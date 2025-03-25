'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRecentDebates, Debate } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

export default function DebatesPage() {
  const [debates, setDebates] = useState<Debate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDebates() {
      setIsLoading(true);
      try {
        const recentDebates = await getRecentDebates(100); // Get up to 100 debates
        setDebates(recentDebates);
        setError(null);
      } catch (err) {
        console.error('Error loading debates:', err);
        setError('Failed to load debates');
      } finally {
        setIsLoading(false);
      }
    }

    loadDebates();
  }, []);

  return (
    <main className='container mx-auto p-4 max-w-6xl'>
      <div className='flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-4'>
        <h1 className='text-2xl sm:text-3xl font-bold'>All Debates</h1>
        <Link href='/' className='text-blue-500 hover:text-blue-700'>
          ← Back to Debate Arena
        </Link>
      </div>

      {isLoading ? (
        <div className='space-y-4'>
          {[...Array(10)].map((_, i) => (
            <div key={i} className='p-4 border rounded-lg animate-pulse'>
              <div className='h-6 bg-gray-200 rounded w-3/4 mb-3'></div>
              <div className='h-4 bg-gray-200 rounded w-1/4'></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className='p-4 bg-red-50 text-red-600 rounded-lg'>{error}</div>
      ) : debates.length === 0 ? (
        <div className='p-8 bg-gray-50 rounded-lg text-center'>
          <p className='text-gray-600 text-lg'>
            No debates have been recorded yet.
          </p>
          <Link
            href='/'
            className='inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
          >
            Start a new debate
          </Link>
        </div>
      ) : (
        <div className='space-y-4'>
          {debates.map((debate) => (
            <Link
              key={debate.id}
              href={`/debate/${debate.id}`}
              className='block p-3 sm:p-4 border border-gray-300 rounded-lg hover:border-blue-400 transition-colors'
            >
              <h2 className='text-base sm:text-xl font-medium'>
                {debate.query}
              </h2>
              <div className='flex flex-wrap gap-2 sm:gap-4 mt-2'>
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                  Republican
                </span>
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                  Democrat
                </span>
                <span className='text-xs sm:text-sm text-gray-500'>
                  {formatDistanceToNow(new Date(debate.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
