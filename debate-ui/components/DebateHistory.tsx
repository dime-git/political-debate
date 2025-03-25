'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRecentDebates, Debate } from '../lib/api';
import { formatDistanceToNow } from 'date-fns';

interface DebateHistoryProps {
  onSelectDebate?: (debate: Debate) => void;
  limit?: number;
  showViewAll?: boolean;
}

export default function DebateHistory({
  onSelectDebate,
  limit = 100,
  showViewAll = true,
}: DebateHistoryProps) {
  const [debates, setDebates] = useState<Debate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDebates() {
      setIsLoading(true);
      try {
        const recentDebates = await getRecentDebates(limit);
        setDebates(recentDebates);
        setError(null);
      } catch (err) {
        console.error('Error loading debates:', err);
        setError('Failed to load recent debates');
      } finally {
        setIsLoading(false);
      }
    }

    loadDebates();
  }, [limit]);

  function handleDebateClick(debate: Debate) {
    if (onSelectDebate) {
      onSelectDebate(debate);
    }
  }

  if (isLoading) {
    return (
      <div className='mt-8 space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Recent Debates</h2>
          {showViewAll && (
            <Link href='/debates' className='text-blue-500 hover:text-blue-700'>
              View all →
            </Link>
          )}
        </div>
        <div className='space-y-2'>
          {[...Array(limit)].map((_, i) => (
            <div key={i} className='p-3 border rounded-lg animate-pulse'>
              <div className='h-5 bg-gray-200 rounded w-3/4 mb-2'></div>
              <div className='h-4 bg-gray-200 rounded w-1/4'></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='mt-8'>
        <h2 className='text-xl font-semibold'>Recent Debates</h2>
        <div className='mt-2 p-4 bg-red-50 text-red-500 rounded-lg'>
          {error}
        </div>
      </div>
    );
  }

  if (debates.length === 0) {
    return (
      <div className='mt-8'>
        <h2 className='text-xl font-semibold'>Recent Debates</h2>
        <div className='mt-2 p-4 bg-gray-50 rounded-lg text-gray-500'>
          No debates yet. Be the first to ask a question!
        </div>
      </div>
    );
  }

  return (
    <div className='mt-8 space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Recent Debates</h2>
        {showViewAll && (
          <Link href='/debates' className='text-blue-500 hover:text-blue-700'>
            View all →
          </Link>
        )}
      </div>

      <div className='space-y-2'>
        {debates.map((debate) => (
          <div
            key={debate.id}
            className='p-3 sm:p-4 border border-gray-300 rounded-lg hover:border-blue-400 cursor-pointer transition-colors'
            onClick={() => handleDebateClick(debate)}
          >
            <p className='font-medium text-sm sm:text-base'>{debate.query}</p>
            <p className='text-xs sm:text-sm text-gray-500'>
              {formatDistanceToNow(new Date(debate.created_at), {
                addSuffix: true,
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
