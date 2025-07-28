#!/usr/bin/env python3
"""
Setup Script for AVEN Firecrawl Integration
Initializes the complete knowledge base system
"""

import asyncio
import os
import sys
from pathlib import Path

# Add the project root to the path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

from scripts.firecrawl_integration import AVENWebScraper
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def setup_complete_system():
    """Setup the complete system from scratch"""
    logger.info("🚀 Starting AVEN Knowledge Base Setup")
    logger.info("=" * 60)
    
    try:
        # Initialize scraper
        logger.info("Initializing AVEN Web Scraper...")
        scraper = AVENWebScraper()
        
        # Check environment variables
        logger.info("Checking environment variables...")
        required_vars = ['FIRECRAWL_API_KEY', 'GEMINI_API_KEY', 'PINECONE_API_KEY']
        missing_vars = [var for var in required_vars if not os.getenv(var)]
        
        if missing_vars:
            logger.error(f"❌ Missing environment variables: {', '.join(missing_vars)}")
            logger.error("Please check your .env.local file")
            return False
        
        logger.info("✅ All environment variables present")
        
        # Setup Pinecone index
        logger.info("Setting up Pinecone index...")
        scraper.setup_pinecone_index()
        logger.info("✅ Pinecone index ready")
        
        # Run complete pipeline
        logger.info("Starting web scraping and indexing pipeline...")
        await scraper.run_full_pipeline()
        
        logger.info("🎉 Setup completed successfully!")
        logger.info("The knowledge base is now ready to use.")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Setup failed: {str(e)}")
        return False

async def quick_test():
    """Run a quick test of the system"""
    logger.info("🧪 Running quick system test...")
    
    try:
        scraper = AVENWebScraper()
        scraper.setup_pinecone_index()
        
        # Test query
        test_query = "What services does AVEN offer?"
        results = scraper.query_knowledge_base(test_query, top_k=3)
        
        if results:
            logger.info(f"✅ Test query successful!")
            logger.info(f"Query: '{test_query}'")
            logger.info(f"Found {len(results)} results:")
            
            for i, result in enumerate(results[:2], 1):
                logger.info(f"  {i}. {result['title']} (Score: {result['score']:.3f})")
        else:
            logger.warning("⚠️ No results found. The knowledge base might be empty.")
            
        return True
        
    except Exception as e:
        logger.error(f"❌ Test failed: {str(e)}")
        return False

def print_usage():
    """Print usage information"""
    print("\n🔥 AVEN Firecrawl Integration Setup")
    print("=" * 50)
    print("Usage: python setup_knowledge_base.py [command]")
    print("\nCommands:")
    print("  setup    - Initialize complete knowledge base system")
    print("  test     - Run quick test of existing system")
    print("  help     - Show this help message")
    print("\nEnvironment Variables Required:")
    print("  FIRECRAWL_API_KEY  - Your Firecrawl API key")
    print("  GEMINI_API_KEY     - Your Google Gemini API key") 
    print("  PINECONE_API_KEY   - Your Pinecone API key")
    print("  PINECONE_ENVIRONMENT - Your Pinecone environment")
    print("  PINECONE_INDEX_NAME  - Your Pinecone index name (optional)")
    print("\nWebsites that will be scraped:")
    print("  - https://www.aven.com/")
    print("  - https://www.aven.com/education")
    print("  - https://www.aven.com/reviews")
    print("  - https://www.aven.com/support")
    print("  - https://www.aven.com/app")
    print("  - https://www.aven.com/about")
    print("  - https://www.aven.com/contact")

async def main():
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "setup":
            success = await setup_complete_system()
            sys.exit(0 if success else 1)
        elif command == "test":
            success = await quick_test()
            sys.exit(0 if success else 1)
        elif command == "help":
            print_usage()
            sys.exit(0)
        else:
            print(f"Unknown command: {command}")
            print_usage()
            sys.exit(1)
    else:
        print_usage()
        
        # Interactive mode
        print("\n" + "=" * 50)
        choice = input("Choose an option (setup/test/help): ").strip().lower()
        
        if choice == "setup":
            await setup_complete_system()
        elif choice == "test":
            await quick_test()
        elif choice == "help":
            print_usage()
        else:
            print("Invalid choice.")

if __name__ == "__main__":
    asyncio.run(main())
