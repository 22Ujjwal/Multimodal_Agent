// Configuration file for API clients
// This centralizes all API configurations and provides type safety

export const config = {
  // Vapi AI Configuration
  vapi: {
    publicKey: process.env.VAPI_PUBLIC_KEY!,
    privateKey: process.env.VAPI_PRIVATE_KEY!,
  },
  
  // Firecrawl Configuration
  firecrawl: {
    apiKey: process.env.FIRECRAWL_API_KEY!,
    baseUrl: 'https://api.firecrawl.dev',
  },
  
  // Gemini API Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY!,
    model: 'gemini-pro',
    embeddingModel: 'embedding-001',
  },
  
  // Pinecone Configuration
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
    indexName: process.env.PINECONE_INDEX_NAME || 'customer-support-kb',
    dimension: 768, // Gemini embedding dimension
  },
  
  // Application Configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
} as const;

// Type definitions for better TypeScript support
export type Config = typeof config;

// Validation function to ensure all required env vars are present
export function validateConfig() {
  const required = [
    'VAPI_PUBLIC_KEY',
    'VAPI_PRIVATE_KEY', 
    'FIRECRAWL_API_KEY',
    'GEMINI_API_KEY',
    'PINECONE_API_KEY',
    'PINECONE_ENVIRONMENT',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return true;
}
