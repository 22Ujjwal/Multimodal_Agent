# Firecrawl + Gemini + Pinecone Integration

This integration provides intelligent web scraping and knowledge base functionality for the AVEN AI Agent using:

- **Firecrawl** for advanced web scraping
- **Google Gemini** for embeddings generation  
- **Pinecone** for vector storage and similarity search

## 🚀 Quick Start

### 1. Environment Setup

Make sure your `.env.local` file has these keys:

```bash
# Firecrawl API Key (get from https://firecrawl.dev/app)
FIRECRAWL_API_KEY=your_firecrawl_api_key_here

# Google Gemini API Key (get from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Pinecone Configuration (get from https://app.pinecone.io/)
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here
PINECONE_INDEX_NAME=customer-support-kb
```

### 2. Install Python Dependencies

The Python environment is already configured. Dependencies include:

- `firecrawl-py` - Firecrawl Python client
- `google-generativeai` - Gemini API client
- `pinecone-client` - Pinecone vector database client
- Other supporting libraries

### 3. Initialize Knowledge Base

Run the setup script to scrape AVEN website and build the knowledge base:

```bash
# Method 1: Direct execution
python scripts/setup_knowledge_base.py setup

# Method 2: Interactive mode
python scripts/setup_knowledge_base.py
```

This will:
- Scrape all 7 AVEN website pages
- Generate embeddings for all content
- Store vectors in Pinecone
- Take approximately 2-3 minutes

### 4. Test the System

```bash
# Run comprehensive tests
python scripts/test_firecrawl.py test

# Test individual components
python scripts/test_firecrawl.py single    # Test single URL scrape
python scripts/test_firecrawl.py query     # Test knowledge base queries
```

## 📁 File Structure

```
scripts/
├── firecrawl_integration.py    # Main integration class
├── setup_knowledge_base.py     # Setup and initialization
├── test_firecrawl.py          # Testing utilities
└── query_knowledge_base.py    # API query handler

app/api/
└── knowledge-base/
    └── route.ts               # Next.js API endpoint
```

## 🔧 Components

### AVENWebScraper Class

Main class that handles:

```python
# Initialize scraper
scraper = AVENWebScraper()

# Scrape all AVEN URLs
scraped_data = await scraper.scrape_all_urls()

# Process and store in Pinecone
await scraper.process_and_store_data(scraped_data)

# Query knowledge base
results = scraper.query_knowledge_base("What is AVEN?", top_k=5)
```

### Target URLs

The system scrapes these AVEN pages:

- `https://www.aven.com/` - Homepage
- `https://www.aven.com/education` - Educational content
- `https://www.aven.com/reviews` - Customer reviews
- `https://www.aven.com/support` - Support information
- `https://www.aven.com/app` - App information
- `https://www.aven.com/about` - About page
- `https://www.aven.com/contact` - Contact information

### Firecrawl Configuration

Optimized scraping parameters:

```python
scrape_params = {
    'pageOptions': {
        'onlyMainContent': True,
        'includeHtml': False,
        'waitFor': 2000  # Wait for dynamic content
    },
    'extractorOptions': {
        'mode': 'llm-extraction',
        'extractionPrompt': 'Extract AVEN service information...'
    }
}
```

## 🤖 AI Integration

### Frontend Integration

The AI Agent component now queries the knowledge base:

```typescript
// Query knowledge base through API
const response = await fetch('/api/knowledge-base', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: userInput }),
})

const data = await response.json()
// Use data.results for contextual responses
```

### Contextual Responses

The AI now provides responses based on actual AVEN website content:

- HELOC information from scraped pages
- Current rates and terms
- Application processes
- Support contact information
- Educational content

## 📊 Monitoring

### Logs

All operations are logged to:
- Console output
- `firecrawl_integration.log` file

### Vector Database Stats

Check Pinecone index status:

```python
scraper = AVENWebScraper()
scraper.setup_pinecone_index()
stats = scraper.index.describe_index_stats()
print(stats)
```

## 🔍 Usage Examples

### Query Knowledge Base

```python
# Initialize scraper
scraper = AVENWebScraper()
scraper.setup_pinecone_index()

# Query examples
queries = [
    "What is AVEN?",
    "How do HELOC loans work?", 
    "What are the interest rates?",
    "How do I apply for a credit card?",
    "What customer support is available?"
]

for query in queries:
    results = scraper.query_knowledge_base(query, top_k=3)
    print(f"Query: {query}")
    for result in results:
        print(f"- {result['title']} (Score: {result['score']:.3f})")
```

### Update Knowledge Base

To refresh the knowledge base with new content:

```bash
# Re-run the setup (will update existing vectors)
python scripts/setup_knowledge_base.py setup
```

## 🛠️ Troubleshooting

### Common Issues

1. **Missing API Keys**
   ```
   Error: Missing required API keys
   Solution: Check .env.local file has all required keys
   ```

2. **Pinecone Connection Failed**
   ```
   Error: Pinecone connection failed
   Solution: Verify PINECONE_API_KEY and PINECONE_ENVIRONMENT
   ```

3. **Firecrawl Rate Limits**
   ```
   Error: Rate limit exceeded
   Solution: Wait and retry, or upgrade Firecrawl plan
   ```

4. **Empty Knowledge Base**
   ```
   Error: No results found
   Solution: Run setup_knowledge_base.py to populate data
   ```

### Debug Mode

Enable detailed logging:

```python
import logging
logging.getLogger().setLevel(logging.DEBUG)
```

## 📈 Performance

### Metrics

- **Scraping**: ~30-60 seconds for all 7 URLs
- **Embedding Generation**: ~768 dimensions per chunk
- **Vector Storage**: ~100-200 vectors per page
- **Query Response**: ~200-500ms average

### Optimization

- Content is chunked with 200-character overlap
- Batch upsert to Pinecone (100 vectors per batch)
- Embeddings cached during processing
- Rate limiting between requests

## 🔄 Maintenance

### Regular Updates

Recommended to refresh knowledge base:
- Weekly for dynamic content
- After major website updates
- When adding new pages to scrape

### Monitoring

Check system health:

```bash
# Quick system test
python scripts/test_firecrawl.py test

# Check specific components
python scripts/test_firecrawl.py single
python scripts/test_firecrawl.py query
```

## 🎯 Next Steps

- [ ] Add more AVEN pages to scraping
- [ ] Implement incremental updates
- [ ] Add content freshness tracking
- [ ] Integrate with Vapi for voice responses
- [ ] Add analytics and usage tracking

## 📞 Support

For issues with this integration:

1. Check logs in `firecrawl_integration.log`
2. Run diagnostic tests with `test_firecrawl.py`
3. Verify all API keys and environment variables
4. Check Pinecone index status and limits
