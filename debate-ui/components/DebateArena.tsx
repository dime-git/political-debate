'use client';

import { motion } from 'framer-motion';
import PerspectiveCard from './PerspectiveCard';

interface DebateArenaProps {
  debate: {
    query: string;
    rightWingResponse: string;
    leftWingResponse: string;
  };
  className?: string;
}

export default function DebateArena({
  debate,
  className = '',
}: DebateArenaProps) {
  if (!debate) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className='grid md:grid-cols-2 gap-4'>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PerspectiveCard
            title='Republican View'
            avatar='/dt.jpg'
            name='Donald Trump'
            content={debate.rightWingResponse}
            color='red'
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <PerspectiveCard
            title='Democratic View'
            avatar='/jg.jpg'
            name='Joe Biden'
            content={debate.leftWingResponse}
            color='blue'
          />
        </motion.div>
      </div>

      <motion.div
        className='mt-4 bg-transparent border border-gray-300 p-4 rounded-lg'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className='font-medium text-gray-700'>Question:</h3>
        <p className='mt-1 text-lg font-semibold'>{debate.query}</p>
      </motion.div>
    </div>
  );
}
