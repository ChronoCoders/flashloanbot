import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  animated = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: { container: 'w-8 h-8', text: 'text-sm', icon: 'w-4 h-4' },
    md: { container: 'w-12 h-12', text: 'text-lg', icon: 'w-6 h-6' },
    lg: { container: 'w-16 h-16', text: 'text-xl', icon: 'w-8 h-8' },
    xl: { container: 'w-20 h-20', text: 'text-2xl', icon: 'w-10 h-10' }
  };

  const currentSize = sizeClasses[size];

  const LogoIcon = () => (
    <div className={`${currentSize.container} relative ${className}`}>
      {/* Outer Ring with Gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-0.5">
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
          {/* Inner Content */}
          <div className="relative">
            {/* Lightning Bolt */}
            <svg 
              className={`${currentSize.icon} text-white relative z-10`}
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            
            {/* Glowing Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-sm opacity-30 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  const AnimatedLogo = () => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 0.8,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div
        animate={{ 
          boxShadow: [
            "0 0 20px rgba(168, 85, 247, 0.4)",
            "0 0 30px rgba(236, 72, 153, 0.6)",
            "0 0 20px rgba(168, 85, 247, 0.4)"
          ]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="rounded-2xl"
      >
        <LogoIcon />
      </motion.div>
    </motion.div>
  );

  return (
    <div className="flex items-center space-x-3">
      {animated ? <AnimatedLogo /> : <LogoIcon />}
      
      {showText && (
        <div className="flex flex-col">
          <motion.h1 
            className={`${currentSize.text} font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent`}
            initial={animated ? { opacity: 0, x: -20 } : {}}
            animate={animated ? { opacity: 1, x: 0 } : {}}
            transition={animated ? { duration: 0.8, delay: 0.3 } : {}}
          >
            Flash USDT Bot
          </motion.h1>
          <motion.p 
            className={`text-xs text-purple-300 font-medium tracking-wide`}
            initial={animated ? { opacity: 0, x: -20 } : {}}
            animate={animated ? { opacity: 1, x: 0 } : {}}
            transition={animated ? { duration: 0.8, delay: 0.5 } : {}}
          >
            Likidite Arbitraj Sistemi
          </motion.p>
        </div>
      )}
    </div>
  );
};

export default Logo;