'use client';

import { useState } from 'react';

interface DebateFormProps {
  onSubmit: (question: string) => Promise<void>;
  isLoading: boolean;
}

export default function DebateForm({ onSubmit, isLoading }: DebateFormProps) {
  const [question, setQuestion] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    await onSubmit(question);
    // Clear the question immediately after submission starts
    setQuestion('');
  }

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      <div className='relative p-1 border-2 border-gray-700 rounded-xl glass-effect transition-all duration-300 focus-within:border-blue-500'>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder='Ask a political question...'
          className='w-full p-5 sm:p-5 p-3 bg-transparent border-none focus:ring-0 text-lg sm:text-lg text-base rounded-lg placeholder-gray-500'
          rows={2}
          disabled={isLoading}
        />

        <button
          type='submit'
          disabled={isLoading}
          className='absolute right-3 bottom-3 bg-blue-600 text-white px-5 py-2 sm:px-5 sm:py-2 px-3 py-1 text-sm sm:text-base rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-md'
        >
          {isLoading ? (
            <span className='flex items-center'>
              <svg
                className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              <span className='hidden sm:inline'>Processing...</span>
              <span className='sm:hidden'>...</span>
            </span>
          ) : (
            'Debate'
          )}
        </button>
      </div>

      <div className='mt-3 text-center text-sm text-gray-400'>
        See how different political perspectives would approach this issue
      </div>
    </form>
  );
}
