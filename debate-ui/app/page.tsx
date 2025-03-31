'use client';

import { useState } from 'react';
import DebateForm from '@/components/DebateForm';
import DebateArena from '@/components/DebateArena';
import DebateHistory from '@/components/DebateHistory';
import { submitDebateQuestion, Debate } from '@/lib/api';
import { motion } from 'framer-motion';

export default function Home() {
  const [currentDebate, setCurrentDebate] = useState<{
    query: string;
    rightWingResponse: string;
    leftWingResponse: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmitQuestion(question: string) {
    setIsLoading(true);
    setError(null);

    try {
      console.log(
        `Using API URL: ${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        }`
      );
      const response = await submitDebateQuestion(question);

      setCurrentDebate({
        query: question,
        rightWingResponse: response['Donald Trump thoughts 🧠:'],
        leftWingResponse: response['Joe Biden thoughts 🧠: '],
      });
    } catch (err) {
      console.error('Error submitting question:', err);

      // Create a more user-friendly error message
      let errorMessage = 'An unknown error occurred';

      if (err instanceof Error) {
        if (
          err.message.includes('Failed to fetch') ||
          err.message.includes('NetworkError')
        ) {
          errorMessage =
            'Network error: Cannot connect to the debate server. Please try again later.';
        } else if (err.message.includes('API error: 500')) {
          errorMessage =
            'Server error: The debate service is experiencing issues. Please try again later.';
        } else if (err.message.includes('API error: 429')) {
          errorMessage =
            'Rate limit exceeded: Please wait a moment before trying again.';
        } else if (err.message.includes('API error: 404')) {
          errorMessage =
            'Not found: The debate service endpoint could not be found.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectDebate(debate: Debate) {
    setCurrentDebate({
      query: debate.query,
      rightWingResponse: debate.right_wing_response,
      leftWingResponse: debate.left_wing_response,
    });
  }

  return (
    <main className='container mx-auto p-4 max-w-6xl'>
      <motion.h1
        className='text-3xl sm:text-4xl font-bold text-center my-6 sm:my-8'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Political Debate Arena
      </motion.h1>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DebateForm onSubmit={handleSubmitQuestion} isLoading={isLoading} />
        </motion.div>
      )}

      {error && (
        <motion.div
          className='mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className='font-medium'>Error: {error}</p>
          <p className='text-sm mt-1'>
            Please try again or use a different question.
          </p>
        </motion.div>
      )}

      {isLoading && (
        <motion.div
          className='my-8 p-4 sm:p-6 border border-blue-300 rounded-xl glass-effect text-center w-full'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className='flex flex-col items-center justify-center space-y-3 sm:space-y-4'>
            <div className='flex space-x-8 sm:space-x-16 my-2'>
              <div className='flex flex-col items-center float-animation'>
                <div className='rounded-full h-12 w-12 sm:h-16 sm:w-16 debate-indicator overflow-hidden border-2 border-red-400'>
                  <img
                    src='/dt.jpg'
                    alt='Donald Trump'
                    className='w-full h-full object-cover'
                  />
                </div>
                <span className='mt-2 sm:mt-4 text-xs sm:text-sm'>
                  Donald Trump
                </span>
              </div>
              <div
                className='flex flex-col items-center float-animation'
                style={{ animationDelay: '1s' }}
              >
                <div className='rounded-full h-12 w-12 sm:h-16 sm:w-16 debate-indicator overflow-hidden border-2 border-blue-400'>
                  <img
                    src='/jg.jpg'
                    alt='Joe Biden'
                    className='w-full h-full object-cover'
                  />
                </div>
                <span className='mt-2 sm:mt-4 text-xs sm:text-sm'>
                  Joe Biden
                </span>
              </div>
            </div>
            <p className='text-base sm:text-xl font-medium'>
              The politicians are preparing their responses...
            </p>
            <p className='text-xs sm:text-sm text-gray-500'>
              This usually takes 10-15 seconds
            </p>
          </div>
        </motion.div>
      )}

      {!isLoading && currentDebate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='my-8'
        >
          <DebateArena debate={currentDebate} />
        </motion.div>
      )}

      <DebateHistory onSelectDebate={handleSelectDebate} limit={100} />
    </main>
  );
}
