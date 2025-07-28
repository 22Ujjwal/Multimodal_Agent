# AI Customer Support Agent Setup Guide

## Overview
This project builds an AI-powered customer support agent that combines:
- **Vapi AI** for voice and text interactions
- **Firecrawl** for intelligent web data scraping
- **Gemini API** for embeddings generation and LLM responses
- **Pinecone** for vector database (website data storage)
- **Next.js** for the web interface

## Architecture Flow
```
Data Flow: Firecrawl (Scraping) → Gemini (Embeddings) → Pinecone (Storage)
User Flow: User (Voice/Text) → Vapi → Your App → Pinecone (Vector Search) → Gemini (RAG) → Response → Vapi → User
```

## Setup Instructions

### 1. API Keys Configuration
1. Copy `.env.local` and fill in your API keys:
   ```bash
   # Get your keys from:
   # - Vapi: https://vapi.ai/dashboard
   # - Firecrawl: https://firecrawl.dev/app
   # - Gemini: https://aistudio.google.com/app/apikey
   # - Pinecone: https://app.pinecone.io/
   ```

### 2. Install Additional Dependencies
```bash
npm install @pinecone-database/pinecone @mendable/firecrawl-js @google/generative-ai @types/node dotenv
```

### 3. Pinecone Setup
1. Create a Pinecone index with:
   - **Dimension**: 768 (for Gemini embeddings)
   - **Metric**: cosine
   - **Name**: customer-support-kb

### 4. Data Preparation
You'll need to:
1. Use Firecrawl to intelligently scrape website data
2. Convert scraped content to embeddings using Gemini
3. Store embeddings in Pinecone

### 5. Vapi Assistant Configuration
Create a Vapi assistant with:
- **Model**: Gemini Pro or Gemini Flash
- **Voice**: Choose from Vapi's voice library
- **Functions**: Connect to your RAG endpoint

## Integration Steps

### Phase 1: RAG Backend
- [ ] Create API route for vector search
- [ ] Implement embedding generation
- [ ] Set up Pinecone queries

### Phase 2: Vapi Integration
- [ ] Configure Vapi assistant
- [ ] Set up function calling
- [ ] Connect voice/text interface

### Phase 3: Frontend
- [ ] Add Vapi web SDK
- [ ] Create chat interface
- [ ] Implement voice controls

## Security Notes
- ✅ `.env.local` is gitignored
- ✅ API keys are secure
- ✅ No secrets in code

## Next Steps
1. Fill in your API keys in `.env.local`
2. Run `npm install` for new dependencies
3. Set up your Pinecone index
4. Start with the RAG backend implementation
