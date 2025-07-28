'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Mic, 
  MicOff, 
  Send, 
  X, 
  Volume2, 
  VolumeX,
  Bot,
  User
} from 'lucide-react'
import UnityAgent from './UnityAgent'
import dynamic from 'next/dynamic'

const VapiIntegration = dynamic(() => import('./VapiIntegration'), { ssr: false })

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function AIAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi There! Welcome to AVEN! How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Send message to Vapi instead of generating local response
    if ((window as any).vapiInstance && (window as any).sendToVapi) {
      try {
        // Send message through Vapi
        (window as any).sendToVapi(text.trim())
        // Vapi will handle the response through the message event listener
      } catch (error) {
        console.error('Failed to send message to Vapi:', error)
        // Fallback to local response
        setTimeout(async () => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: await generateAIResponse(text),
            isUser: false,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, aiResponse])
          setIsTyping(false)
        }, 1500)
      }
    } else {
      // Fallback if Vapi is not available
      setTimeout(async () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: await generateAIResponse(text),
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiResponse])
        setIsTyping(false)
      }, 1500)
    }
  }

  // Handle Vapi responses
  const handleVapiResponse = (text: string) => {
    const aiResponse: Message = {
      id: Date.now().toString(),
      text: text,
      isUser: false,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiResponse])
    setIsTyping(false)
  }

  const generateAIResponse = async (userInput: string): Promise<string> => {
    const input = userInput.toLowerCase()
    
    try {
      // Query the knowledge base first
      const response = await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userInput }),
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.results && data.results.length > 0) {
          // Use knowledge base results to generate contextual response
          const topResult = data.results[0]
          const context = topResult.content
          
          // Generate response based on context and user input
          if (input.includes('heloc') || input.includes('home equity')) {
            return `Based on AVEN's information: A HELOC (Home Equity Line of Credit) allows you to borrow against your home's equity. ${context.substring(0, 200)}... Would you like me to help you calculate your potential credit line or learn more about our application process?`
          }
          
          if (input.includes('rate') || input.includes('interest')) {
            return `Here's what I found about AVEN's rates: ${context.substring(0, 250)}... Our rates are competitive and based on your creditworthiness. Would you like to see if you pre-qualify?`
          }
          
          if (input.includes('apply') || input.includes('application')) {
            return `Great! I can help you with the application process. ${context.substring(0, 200)}... The process typically takes about 10 minutes and you'll get an instant pre-approval decision. Shall we begin?`
          }
          
          // General response using context
          return `Based on AVEN's information: ${context.substring(0, 300)}... How else can I help you with your HELOC or credit needs?`
        }
      }
    } catch (error) {
      console.error('Knowledge base query failed:', error)
    }
    
    // Fallback responses if knowledge base fails
    if (input.includes('heloc') || input.includes('home equity')) {
      return "A HELOC (Home Equity Line of Credit) allows you to borrow against your home's equity. With our competitive rates starting at 6.5% APR, you could access up to 80% of your home's value. Would you like me to calculate your potential credit line?"
    }
    
    if (input.includes('rate') || input.includes('interest')) {
      return "Our current HELOC rates start at 6.5% APR for qualified borrowers. Rates are variable and based on your creditworthiness, loan-to-value ratio, and current market conditions. Would you like to see if you pre-qualify?"
    }
    
    if (input.includes('apply') || input.includes('application')) {
      return "Great! I can help you start your HELOC application right now. The process takes about 10 minutes and you'll get an instant pre-approval decision. Shall we begin with some basic information about your home and financial situation?"
    }
    
    if (input.includes('credit card')) {
      return "We offer premium credit cards with competitive rates and rewards. Our HELOC Credit Card combines the flexibility of a credit card with the low rates of a home equity line. Would you like to learn more about our credit card options?"
    }
    
    return "I'd be happy to help you with your HELOC and credit needs! I can assist with rate quotes, application processes, eligibility requirements, or answer any questions about our products. What specific information would you like to know?"
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputText)
    }
  }

  return (
    <>
      {/* Floating AI Button */}
      <motion.div
        className="floating-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-white">AVEN AI</div>
            <div className="text-xs text-white/70">Ask me anything</div>
          </div>
        </div>
      </motion.div>

      {/* Chat Dashboard */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Main Dashboard */}
            <div className="relative w-full max-w-4xl h-[80vh] glass-effect rounded-3xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AVEN AI Assistant</h3>
                    <p className="text-sm text-white/70">HELOC & Credit Expert</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`p-2 rounded-lg transition-colors ${
                      audioEnabled ? 'glass-button' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="glass-button p-2 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex h-[calc(100%-5rem)]">
                {/* Unity 3D Agent */}
                <div className="w-1/3 border-r border-white/10">
                  <UnityAgent isListening={isListening} isTyping={isTyping} />
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.isUser 
                              ? 'bg-primary-600' 
                              : 'bg-gradient-to-br from-blue-500 to-purple-600'
                          }`}>
                            {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <div className={`p-3 rounded-2xl ${
                            message.isUser 
                              ? 'bg-primary-600 text-white rounded-br-md' 
                              : 'glass-effect text-white rounded-bl-md'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="glass-effect p-3 rounded-2xl rounded-bl-md">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-6 border-t border-white/10">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setIsListening(!isListening)}
                        className={`p-3 rounded-full transition-all duration-300 ${
                          isListening 
                            ? 'bg-red-500 text-white animate-pulse' 
                            : 'glass-button hover:scale-105'
                        }`}
                      >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                      
                      <div className="flex-1 relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message or use voice..."
                          className="w-full glass-effect rounded-full px-6 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <button
                        onClick={() => handleSendMessage(inputText)}
                        disabled={!inputText.trim()}
                        className="p-3 rounded-full glass-button hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vapi Integration */}
      <VapiIntegration 
        isListening={isListening}
        onTranscript={(text) => {
          if (text) {
            handleSendMessage(text)
            setIsListening(false)
          }
        }}
        onResponse={handleVapiResponse}
        audioEnabled={audioEnabled}
      />
    </>
  )
}
