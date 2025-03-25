'use client';

import Image from 'next/image';
import { useState } from 'react';

interface PerspectiveCardProps {
  title: string;
  avatar: string;
  name: string;
  content: string;
  color: 'red' | 'blue';
}

export default function PerspectiveCard({
  title,
  avatar,
  name,
  content,
  color,
}: PerspectiveCardProps) {
  const [expanded, setExpanded] = useState(false);

  const colorClasses = {
    red: 'bg-transparent border-red-300',
    blue: 'bg-transparent border-blue-300',
  };

  const headerClasses = {
    red: 'bg-red-600 text-white',
    blue: 'bg-blue-600 text-white',
  };

  const buttonClasses = {
    red: 'text-red-700 hover:text-red-900',
    blue: 'text-blue-700 hover:text-blue-900',
  };

  const formattedContent = content
    .split('.')
    .filter((sentence) => sentence.trim().length > 0)
    .map((sentence) => sentence.trim() + '.')
    .join(' ');

  return (
    <div
      className={`rounded-lg border overflow-hidden shadow-md ${colorClasses[color]} h-full flex flex-col`}
    >
      <div
        className={`p-4 sm:p-4 p-3 ${headerClasses[color]} flex items-center`}
      >
        <div className='w-12 h-12 sm:w-14 sm:h-14 relative rounded-full overflow-hidden mr-3 sm:mr-4 bg-white border-2 border-white'>
          <Image src={avatar} alt={name} fill className='object-cover' />
        </div>
        <div>
          <h3 className='font-bold text-lg sm:text-xl'>{title}</h3>
          <p className='text-xs sm:text-sm opacity-90'>{name}</p>
        </div>
      </div>

      <div className='p-4 sm:p-5 bg-transparent flex-grow'>
        <div
          className={`text-gray-800 text-base sm:text-lg leading-relaxed ${
            expanded ? '' : 'line-clamp-6'
          }`}
        >
          {formattedContent}
        </div>

        {content.length > 300 && (
          <button
            className={`mt-3 sm:mt-4 font-medium ${buttonClasses[color]} flex items-center text-sm sm:text-base`}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 sm:h-5 sm:w-5 mr-1'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z'
                    clipRule='evenodd'
                  />
                </svg>
                Show less
              </>
            ) : (
              <>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 sm:h-5 sm:w-5 mr-1'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
                Read more
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
