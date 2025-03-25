'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getDebateById, Debate } from '@/lib/api';
import DebateArena from '@/components/DebateArena';
import { formatDistanceToNow } from 'date-fns';

export default function DebatePage() {
  const params = useParams();
  const [debate, setDebate] = useState<Debate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDebate() {
      if (!params.id) {
        setError('No debate ID provided');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const debateData = await getDebateById(params.id as string);
        if (!debateData) {
          setError('Debate not found');
        } else {
          setDebate(debateData);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading debate:', err);
        setError('Failed to load debate');
      } finally {
        setIsLoading(false);
      }
    }

    loadDebate();
  }, [params.id]);

  if (isLoading) {
    return (
      <main className='container mx-auto p-4 max-w-6xl'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/2 mb-4'></div>
          <div className='h-4 bg-gray-200 rounded w-1/4 mb-8'></div>

          <div className='grid md:grid-cols-2 gap-4'>
            <div className='h-64 bg-gray-200 rounded'></div>
            <div className='h-64 bg-gray-200 rounded'></div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='container mx-auto p-4 max-w-6xl'>
        <div className='text-center py-8 sm:py-12'>
          <h1 className='text-2xl sm:text-3xl font-bold text-red-600 mb-4'>
            Error
          </h1>
          <p className='text-base sm:text-lg text-gray-700 mb-6'>{error}</p>
          <Link href='/debates' className='text-blue-500 hover:text-blue-700'>
            ← Back to all debates
          </Link>
        </div>
      </main>
    );
  }

  if (!debate) {
    return null;
  }

  return (
    <main className='container mx-auto p-4 max-w-6xl'>
      <div className='mb-6 sm:mb-8'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <h1 className='text-2xl sm:text-3xl font-bold'>{debate.query}</h1>
          <Link href='/debates' className='text-blue-500 hover:text-blue-700'>
            ← Back to all debates
          </Link>
        </div>
        <p className='text-xs sm:text-sm text-gray-500 mt-2'>
          {formatDistanceToNow(new Date(debate.created_at), {
            addSuffix: true,
          })}
        </p>
      </div>

      <DebateArena
        debate={{
          query: debate.query,
          rightWingResponse: debate.right_wing_response,
          leftWingResponse: debate.left_wing_response,
        }}
      />

      <div className='mt-12 flex justify-center'>
        <Link
          href='/'
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          Start a new debate
        </Link>
      </div>
    </main>
  );
}
