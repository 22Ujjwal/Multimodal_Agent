#!/usr/bin/env python3
"""
Firecrawl + Gemini + Pinecone Integration Script
Scrapes AVEN website pages, generates embeddings, and stores in Pinecone
"""

import os
import asyncio
import time
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging

# Import required libraries  
from firecrawl import AsyncFirecrawlApp
import google.generativeai as genai
from pinecone import Pinecone, ServerlessSpec
import pandas as pd
from dotenv import load_dotenv
import hashlib
import json
from scripts.aven_fallback_data import AVEN_FALLBACK_DATA

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('firecrawl_integration.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class AVENWebScraper:
    """Comprehensive web scraper and knowledge base builder for AVEN website"""
    
    def __init__(self):
        self.firecrawl_api_key = os.getenv('FIRECRAWL_API_KEY')
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        self.pinecone_api_key = os.getenv('PINECONE_API_KEY')
        self.pinecone_environment = os.getenv('PINECONE_ENVIRONMENT')
        self.pinecone_index_name = os.getenv('PINECONE_INDEX_NAME', 'customer-support-kb')
        
        # Validate API keys
        self._validate_api_keys()
        
        # Initialize services
        self.firecrawl = AsyncFirecrawlApp(api_key=self.firecrawl_api_key)
        genai.configure(api_key=self.gemini_api_key)
        self.pc = Pinecone(api_key=self.pinecone_api_key)
        
        # Initialize embedding model
        self.embedding_model = 'models/embedding-001'
        
        # Target URLs to scrape
        self.target_urls = [
            'https://www.aven.com/',
            'https://www.aven.com/education',
            'https://www.aven.com/reviews',
            'https://www.aven.com/support',
            'https://www.aven.com/app',
            'https://www.aven.com/about',
            'https://www.aven.com/contact'
        ]
        
        logger.info("AVENWebScraper initialized successfully")
    
    def _validate_api_keys(self):
        """Validate that all required API keys are present"""
        required_keys = [
            ('FIRECRAWL_API_KEY', self.firecrawl_api_key),
            ('GEMINI_API_KEY', self.gemini_api_key),
            ('PINECONE_API_KEY', self.pinecone_api_key),
        ]
        
        missing_keys = [key for key, value in required_keys if not value]
        
        if missing_keys:
            raise ValueError(f"Missing required API keys: {', '.join(missing_keys)}")
        
        logger.info("All API keys validated successfully")
    
    async def scrape_url(self, url: str) -> Optional[Dict[str, Any]]:
        """Scrape a single URL using Firecrawl"""
        try:
            logger.info(f"Scraping URL: {url}")
            
            # Perform the scrape with the new async API
            result = await self.firecrawl.scrape_url(
                url=url,
                formats=['markdown'],
                only_main_content=True,
                parse_pdf=False
            )
            
            if result and result.get('success', True):  # New API might not have 'success' field
                # Extract content from the new API response format
                content = result.get('markdown', '') or result.get('data', {}).get('markdown', '')
                title = result.get('metadata', {}).get('title', '') or result.get('data', {}).get('metadata', {}).get('title', '')
                
                content_data = {
                    'url': url,
                    'title': title,
                    'content': content,
                    'scraped_at': datetime.now().isoformat(),
                    'word_count': len(content.split()) if content else 0
                }
                
                logger.info(f"Successfully scraped {url} - {content_data['word_count']} words")
                return content_data
            else:
                logger.error(f"Failed to scrape {url}: {result}")
                return None
                
        except Exception as e:
            logger.error(f"Error scraping {url}: {str(e)}")
            # Try alternative URLs or skip this one
            return None
    
    async def scrape_all_urls(self) -> List[Dict[str, Any]]:
        """Scrape all target URLs"""
        scraped_data = []
        
        for url in self.target_urls:
            data = await self.scrape_url(url)
            if data:
                scraped_data.append(data)
            else:
                # Try to use fallback data
                fallback = self.get_fallback_data(url)
                if fallback:
                    logger.info(f"Using fallback data for {url}")
                    scraped_data.append(fallback)
            
            # Add delay between requests to be respectful
            await asyncio.sleep(2)
        
        # If no URLs were scraped successfully, use all fallback data
        if len(scraped_data) == 0:
            logger.warning("No URLs scraped successfully, using all fallback data")
            scraped_data = AVEN_FALLBACK_DATA
        
        logger.info(f"Successfully scraped {len(scraped_data)} out of {len(self.target_urls)} URLs")
        return scraped_data
    
    def get_fallback_data(self, url: str) -> Optional[Dict[str, Any]]:
        """Get fallback data for a URL if available"""
        for fallback in AVEN_FALLBACK_DATA:
            if fallback['url'] == url:
                return fallback
        return None
    
    def generate_embeddings(self, text: str) -> List[float]:
        """Generate embeddings using Gemini"""
        try:
            result = genai.embed_content(
                model=self.embedding_model,
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            return []
    
    def chunk_content(self, content: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """Split content into overlapping chunks"""
        if len(content) <= chunk_size:
            return [content]
        
        chunks = []
        start = 0
        
        while start < len(content):
            end = start + chunk_size
            chunk = content[start:end]
            
            # Try to break at a sentence boundary
            if end < len(content):
                last_period = chunk.rfind('.')
                last_newline = chunk.rfind('\n')
                break_point = max(last_period, last_newline)
                
                if break_point > start + chunk_size // 2:
                    chunk = content[start:break_point + 1]
                    end = break_point + 1
            
            chunks.append(chunk.strip())
            start = end - overlap
            
            if start >= len(content):
                break
        
        return chunks
    
    def setup_pinecone_index(self):
        """Setup or connect to Pinecone index"""
        try:
            # Check if index exists
            existing_indexes = [index.name for index in self.pc.list_indexes()]
            
            if self.pinecone_index_name not in existing_indexes:
                logger.info(f"Creating new Pinecone index: {self.pinecone_index_name}")
                self.pc.create_index(
                    name=self.pinecone_index_name,
                    dimension=768,  # Gemini embedding dimension
                    metric='cosine',
                    spec=ServerlessSpec(
                        cloud='gcp',
                        region=self.pinecone_environment or 'us-west1-gcp'
                    )
                )
                
                # Wait for index to be ready
                time.sleep(10)
            
            self.index = self.pc.Index(self.pinecone_index_name)
            logger.info(f"Connected to Pinecone index: {self.pinecone_index_name}")
            
        except Exception as e:
            logger.error(f"Error setting up Pinecone index: {str(e)}")
            raise
    
    def create_vector_id(self, url: str, chunk_index: int) -> str:
        """Create a unique vector ID"""
        content = f"{url}_{chunk_index}"
        return hashlib.md5(content.encode()).hexdigest()
    
    async def process_and_store_data(self, scraped_data: List[Dict[str, Any]]):
        """Process scraped data and store in Pinecone"""
        self.setup_pinecone_index()
        
        all_vectors = []
        
        for page_data in scraped_data:
            url = page_data['url']
            content = page_data['content']
            
            if not content:
                logger.warning(f"No content found for {url}")
                continue
            
            # Combine content with extracted data for richer context
            full_content = content
            if page_data.get('extracted_data'):
                extracted_str = json.dumps(page_data['extracted_data'], indent=2)
                full_content = f"{content}\n\nExtracted Information:\n{extracted_str}"
            
            # Chunk the content
            chunks = self.chunk_content(full_content)
            logger.info(f"Created {len(chunks)} chunks for {url}")
            
            for i, chunk in enumerate(chunks):
                if len(chunk.strip()) < 50:  # Skip very short chunks
                    continue
                
                # Generate embedding
                embedding = self.generate_embeddings(chunk)
                if not embedding:
                    continue
                
                # Create vector
                vector_id = self.create_vector_id(url, i)
                metadata = {
                    'url': url,
                    'title': page_data.get('title', ''),
                    'chunk_index': i,
                    'content': chunk[:1000],  # Store first 1000 chars in metadata
                    'scraped_at': page_data['scraped_at'],
                    'word_count': len(chunk.split()),
                    'source': 'aven_website'
                }
                
                vector = {
                    'id': vector_id,
                    'values': embedding,
                    'metadata': metadata
                }
                
                all_vectors.append(vector)
        
        # Batch upsert to Pinecone
        if all_vectors:
            batch_size = 100
            for i in range(0, len(all_vectors), batch_size):
                batch = all_vectors[i:i + batch_size]
                try:
                    self.index.upsert(vectors=batch)
                    logger.info(f"Upserted batch {i//batch_size + 1}/{(len(all_vectors)-1)//batch_size + 1}")
                except Exception as e:
                    logger.error(f"Error upserting batch: {str(e)}")
            
            logger.info(f"Successfully stored {len(all_vectors)} vectors in Pinecone")
        else:
            logger.warning("No vectors to store")
    
    def query_knowledge_base(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Query the knowledge base"""
        try:
            # Generate embedding for the query
            query_embedding = self.generate_embeddings(query)
            if not query_embedding:
                return []
            
            # Search Pinecone
            results = self.index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True
            )
            
            # Format results
            formatted_results = []
            for match in results['matches']:
                formatted_results.append({
                    'score': match['score'],
                    'url': match['metadata']['url'],
                    'title': match['metadata']['title'],
                    'content': match['metadata']['content'],
                    'chunk_index': match['metadata']['chunk_index']
                })
            
            return formatted_results
            
        except Exception as e:
            logger.error(f"Error querying knowledge base: {str(e)}")
            return []
    
    async def run_full_pipeline(self):
        """Run the complete scraping and indexing pipeline"""
        logger.info("Starting full pipeline...")
        
        try:
            # Step 1: Scrape all URLs
            logger.info("Step 1: Scraping websites...")
            scraped_data = await self.scrape_all_urls()
            
            if not scraped_data:
                logger.error("No data scraped. Exiting.")
                return
            
            # Step 2: Process and store data
            logger.info("Step 2: Processing and storing data...")
            await self.process_and_store_data(scraped_data)
            
            # Step 3: Test the system
            logger.info("Step 3: Testing the system...")
            test_queries = [
                "What is AVEN?",
                "How do HELOC loans work?",
                "What are the interest rates?",
                "How do I apply for a credit card?",
                "What customer support is available?"
            ]
            
            for query in test_queries:
                results = self.query_knowledge_base(query)
                logger.info(f"Query: '{query}' - Found {len(results)} results")
                if results:
                    logger.info(f"Top result: {results[0]['title']} (score: {results[0]['score']:.3f})")
            
            logger.info("Pipeline completed successfully!")
            
        except Exception as e:
            logger.error(f"Pipeline failed: {str(e)}")
            raise

async def main():
    """Main function to run the scraper"""
    scraper = AVENWebScraper()
    await scraper.run_full_pipeline()

if __name__ == "__main__":
    asyncio.run(main())
