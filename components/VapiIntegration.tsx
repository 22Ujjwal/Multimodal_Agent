'use client'

import { useEffect, useRef, useState } from 'react'

interface VapiIntegrationProps {
  isListening: boolean
  onTranscript: (text: string) => void
  onResponse: (text: string) => void
  audioEnabled: boolean
}

export default function VapiIntegration({ isListening, onTranscript, onResponse, audioEnabled }: VapiIntegrationProps) {
  const [isVapiReady, setIsVapiReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize Web Speech API as fallback
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        onTranscript(transcript)
      }
      
      recognitionRef.current.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`)
        console.error('Speech recognition error:', event.error)
      }
      
      recognitionRef.current.onend = () => {
        // Recognition ended
      }
    }

    // Initialize Vapi SDK with knowledge base integration
    const initializeVapi = async () => {
      try {
        const { default: Vapi } = await import('@vapi-ai/web')
        
        const vapi = new Vapi('a7bf0469-f92d-4e02-86df-0aafbd1e437e')

                // Start call with assistant configuration
        const startCall = () => {
          vapi.start('5b343f06-7353-43e4-bfdd-536d22fad54f')
        }

        vapi.on('call-start', () => {
          setIsVapiReady(true)
          console.log('Vapi call started')
        })

        vapi.on('call-end', () => {
          setIsVapiReady(false)
          console.log('Vapi call ended')
        })

        vapi.on('speech-start', () => {
          console.log('User started speaking')
        })

        vapi.on('speech-end', () => {
          console.log('User stopped speaking')
        })

        vapi.on('message', (message: any) => {
          console.log('Vapi message:', message)
          
          // Handle user speech transcription
          if (message.type === 'transcript' && message.transcriptType === 'final') {
            onTranscript(message.transcript)
          }
          
          // Handle assistant responses
          if (message.type === 'conversation-update' && message.conversation) {
            const lastMessage = message.conversation[message.conversation.length - 1]
            if (lastMessage && lastMessage.role === 'assistant') {
              onResponse(lastMessage.content)
            }
          }
          
          // Handle function call results
          if (message.type === 'function-call-result') {
            onResponse(message.result)
          }
          
          // Handle speech events
          if (message.type === 'speech') {
            onResponse(message.text)
          }
        })

        vapi.on('error', (error: any) => {
          setError(error.message || 'Voice assistant error')
          console.error('Vapi error:', error)
        })

        // Store vapi instance and start function
        ;(window as any).vapiInstance = vapi
        ;(window as any).startVapiCall = startCall
        
        // Add function to send text messages to Vapi
        ;(window as any).sendToVapi = (text: string) => {
          if (vapi) {
            vapi.send({
              type: 'add-message',
              message: {
                role: 'user',
                content: text
              }
            })
          }
        }
        
        console.log('Vapi initialized successfully')
        
      } catch (error) {
        console.error('Failed to initialize Vapi:', error)
        setError('Failed to initialize voice assistant')
      }
    }

    initializeVapi()

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTranscript, onResponse])

  useEffect(() => {
    if (isListening && (window as any).vapiInstance) {
      try {
        // Start Vapi call if not already active
        if (!isVapiReady) {
          (window as any).startVapiCall()
        }
        setError(null)
      } catch (err) {
        setError('Failed to start voice call')
        console.error('Vapi start error:', err)
      }
    } else if (!isListening && (window as any).vapiInstance && isVapiReady) {
      // Don't stop Vapi call when voice stops - keep it running for text chat
      // Only stop if user explicitly wants to end the conversation
    } else if (isListening && recognitionRef.current) {
      // Fallback to Web Speech API
      try {
        recognitionRef.current.start()
        setError(null)
      } catch (err) {
        setError('Failed to start speech recognition')
        console.error('Speech recognition start error:', err)
      }
    } else if (!isListening && recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [isListening, isVapiReady])

  // Auto-start Vapi when component mounts
  useEffect(() => {
    const autoStartVapi = () => {
      if ((window as any).startVapiCall && !isVapiReady) {
        try {
          (window as any).startVapiCall()
        } catch (error) {
          console.error('Failed to auto-start Vapi:', error)
        }
      }
    }

    // Start Vapi after a short delay to ensure initialization
    const timer = setTimeout(autoStartVapi, 2000)
    return () => clearTimeout(timer)
  }, [])

  // For now, return null as this is a background service
  // In a real implementation, you might want to show connection status
  return (
    <div className="hidden">
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg backdrop-blur-sm">
          {error}
        </div>
      )}
    </div>
  )
}
