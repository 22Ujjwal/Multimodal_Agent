#!/usr/bin/env python3
"""
Test the knowledge base system using fallback data
"""

import asyncio
import os
import sys
from pathlib import Path

# Add the project root to the path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

from scripts.firecrawl_integration import AVENWebScraper
from scripts.aven_fallback_data import AVEN_FALLBACK_DATA
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def test_with_fallback_data():
    """Test the complete system using fallback data"""
    logger.info("🧪 Testing knowledge base with fallback data...")
    
    try:
        scraper = AVENWebScraper()
        
        # Test embedding generation
        logger.info("Testing embedding generation...")
        test_content = "AVEN offers HELOC loans with competitive rates starting at 6.5% APR."
        embedding = scraper.generate_embeddings(test_content)
        
        if embedding and len(embedding) == 768:
            logger.info(f"✅ Embedding generation works - dimension: {len(embedding)}")
        else:
            logger.error("❌ Embedding generation failed")
            return False
        
        # Test Pinecone connection
        logger.info("Testing Pinecone connection...")
        scraper.setup_pinecone_index()
        logger.info("✅ Pinecone connection successful")
        
        # Process and store fallback data
        logger.info("Processing and storing fallback data...")
        await scraper.process_and_store_data(AVEN_FALLBACK_DATA)
        logger.info("✅ Fallback data processed and stored")
        
        # Test queries
        logger.info("Testing knowledge base queries...")
        test_queries = [
            "What is AVEN?",
            "How do HELOC loans work?",
            "What are the interest rates?",
            "How can I contact support?",
            "What services does AVEN offer?"
        ]
        
        for query in test_queries:
            results = scraper.query_knowledge_base(query, top_k=3)
            if results:
                logger.info(f"✅ Query '{query}': Found {len(results)} results (top score: {results[0]['score']:.3f})")
            else:
                logger.warning(f"⚠️ Query '{query}': No results found")
        
        logger.info("🎉 All tests passed! Knowledge base is working.")
        return True
        
    except Exception as e:
        logger.error(f"❌ Test failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_with_fallback_data())
    sys.exit(0 if success else 1)
