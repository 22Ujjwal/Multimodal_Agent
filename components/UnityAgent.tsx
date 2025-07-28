'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface UnityAgentProps {
  isListening: boolean
  isTyping: boolean
}

export default function UnityAgent({ isListening, isTyping }: UnityAgentProps) {
  const [agentState, setAgentState] = useState<'idle' | 'listening' | 'speaking' | 'thinking'>('idle')

  useEffect(() => {
    if (isListening) {
      setAgentState('listening')
    } else if (isTyping) {
      setAgentState('thinking')
    } else {
      setAgentState('idle')
    }
  }, [isListening, isTyping])

  // Placeholder for Unity WebGL integration
  // In a real implementation, you would embed a Unity WebGL build here
  const renderUnityPlaceholder = () => {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* 3D Agent Avatar Placeholder */}
        <div className="relative z-10">
          <motion.div
            animate={{
              scale: agentState === 'listening' ? 1.1 : agentState === 'thinking' ? 0.95 : 1,
              rotateY: agentState === 'listening' ? 5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Agent Body */}
            <div className="relative">
              {/* Head */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 relative">
                <motion.div
                  animate={{
                    boxShadow: agentState === 'listening' 
                      ? '0 0 30px rgba(59, 130, 246, 0.8)' 
                      : agentState === 'thinking'
                      ? '0 0 20px rgba(147, 51, 234, 0.6)'
                      : '0 0 15px rgba(59, 130, 246, 0.4)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Eyes */}
                  <div className="absolute top-6 left-6 w-3 h-3 bg-white rounded-full" />
                  <div className="absolute top-6 right-6 w-3 h-3 bg-white rounded-full" />
                  
                  {/* Mouth - changes based on state */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    <motion.div
                      animate={{
                        scaleX: agentState === 'listening' ? 1.2 : agentState === 'thinking' ? 0.8 : 1,
                        scaleY: agentState === 'listening' ? 0.8 : agentState === 'thinking' ? 1.2 : 1,
                      }}
                    >
                      <div className="w-4 h-2 bg-white rounded-full" />
                    </motion.div>
                  </div>

                  {/* Voice indicator rings */}
                  {agentState === 'listening' && (
                    <>
                      <div className="absolute inset-0 border-2 border-blue-300 rounded-full">
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      <div className="absolute inset-0 border-2 border-blue-300 rounded-full">
                        <motion.div
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Body */}
              <div className="w-16 h-24 bg-gradient-to-b from-blue-500 to-purple-600 rounded-2xl mx-auto relative">
                <motion.div
                  animate={{
                    scaleY: agentState === 'thinking' ? 0.95 : 1,
                  }}
                >
                  {/* Chest indicator */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: agentState === 'thinking' ? [1, 1.2, 1] : 1,
                        opacity: agentState === 'thinking' ? [1, 0.7, 1] : 1,
                      }}
                      transition={{ duration: 1, repeat: agentState === 'thinking' ? Infinity : 0 }}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Arms */}
              <div className="absolute top-20 -left-6 w-4 h-16 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full">
                <motion.div
                  animate={{
                    rotate: agentState === 'listening' ? -10 : 0,
                  }}
                />
              </div>
              <div className="absolute top-20 -right-6 w-4 h-16 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full">
                <motion.div
                  animate={{
                    rotate: agentState === 'listening' ? 10 : 0,
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Status Text */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-white/80 text-sm font-medium">
              {agentState === 'listening' && '🎤 Listening...'}
              {agentState === 'thinking' && '🤔 Thinking...'}
              {agentState === 'idle' && '👋 Ready to help!'}
            </p>
          </motion.div>
        </div>

        {/* Unity Integration Note */}
        <div className="absolute top-4 right-4">
          <div className="glass-effect px-3 py-1 rounded-full text-xs text-white/60">
            Unity WebGL Ready
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full p-4">
      <div className="h-full">
        {/* Unity WebGL Container */}
        <div className="w-full h-2/3 mb-4">
          {renderUnityPlaceholder()}
        </div>

        {/* Agent Status Panel */}
        <div className="glass-effect p-4 rounded-2xl">
          <h4 className="text-white font-semibold mb-2">AVEN AI Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/70">Status:</span>
              <span className={`font-medium ${
                agentState === 'listening' ? 'text-blue-400' :
                agentState === 'thinking' ? 'text-purple-400' :
                'text-green-400'
              }`}>
                {agentState === 'listening' ? 'Listening' :
                 agentState === 'thinking' ? 'Processing' :
                 'Ready'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Voice:</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">AI Model:</span>
              <span className="text-blue-400">GPT-4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
