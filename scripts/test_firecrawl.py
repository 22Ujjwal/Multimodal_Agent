#!/usr/bin/env python3
"""
Firecrawl Testing and Utility Script
Quick tests and individual operations for the AVEN knowledge base
"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.firecrawl_integration import AVENWebScraper
import logging

# Configure logging for testing
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def test_single_url_scrape():
    """Test scraping a single URL"""
    scraper = AVENWebScraper()
    
    test_url = "https://www.aven.com/"
    logger.info(f"Testing single URL scrape: {test_url}")
    
    result = await scraper.scrape_url(test_url)
    if result:
        logger.info(f"✅ Successfully scraped {test_url}")
        logger.info(f"Title: {result['title']}")
        logger.info(f"Content length: {len(result['content'])} characters")
        logger.info(f"Word count: {result['word_count']}")
        
        # Show first 300 characters of content
        preview = result['content'][:300] + "..." if len(result['content']) > 300 else result['content']
        logger.info(f"Content preview: {preview}")
        
        return True
    else:
        logger.error(f"❌ Failed to scrape {test_url}")
        return False

async def test_embedding_generation():
    """Test embedding generation"""
    scraper = AVENWebScraper()
    
    test_text = "AVEN is a modern financial services company offering HELOC loans and credit cards with competitive rates."
    logger.info("Testing embedding generation...")
    
    embedding = scraper.generate_embeddings(test_text)
    if embedding and len(embedding) > 0:
        logger.info(f"✅ Successfully generated embedding with dimension: {len(embedding)}")
        logger.info(f"First 5 values: {embedding[:5]}")
        return True
    else:
        logger.error("❌ Failed to generate embedding")
        return False

async def test_pinecone_connection():
    """Test Pinecone connection and index setup"""
    scraper = AVENWebScraper()
    
    try:
        logger.info("Testing Pinecone connection...")
        scraper.setup_pinecone_index()
        
        # Test index stats
        stats = scraper.index.describe_index_stats()
        logger.info(f"✅ Successfully connected to Pinecone")
        logger.info(f"Index stats: {stats}")
        
        return True
    except Exception as e:
        logger.error(f"❌ Pinecone connection failed: {str(e)}")
        return False

async def test_query_system():
    """Test querying the knowledge base"""
    scraper = AVENWebScraper()
    
    try:
        scraper.setup_pinecone_index()
        
        test_queries = [
            "What is AVEN?",
            "HELOC loan information",
            "Interest rates and fees",
            "How to apply for credit card",
            "Customer support contact"
        ]
        
        logger.info("Testing query system...")
        
        for query in test_queries:
            logger.info(f"\n🔍 Query: '{query}'")
            results = scraper.query_knowledge_base(query, top_k=3)
            
            if results:
                logger.info(f"Found {len(results)} results:")
                for i, result in enumerate(results, 1):
                    logger.info(f"  {i}. {result['title']} (Score: {result['score']:.3f})")
                    logger.info(f"     URL: {result['url']}")
                    logger.info(f"     Preview: {result['content'][:100]}...")
            else:
                logger.info("No results found")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Query system test failed: {str(e)}")
        return False

async def scrape_specific_urls():
    """Scrape specific URLs for testing"""
    scraper = AVENWebScraper()
    
    # Test with a subset of URLs first
    test_urls = [
        "https://www.aven.com/",
        "https://www.aven.com/about"
    ]
    
    logger.info(f"Scraping {len(test_urls)} test URLs...")
    
    scraped_data = []
    for url in test_urls:
        result = await scraper.scrape_url(url)
        if result:
            scraped_data.append(result)
        await asyncio.sleep(1)  # Be respectful with requests
    
    if scraped_data:
        logger.info(f"✅ Successfully scraped {len(scraped_data)} URLs")
        
        # Process and store the data
        logger.info("Processing and storing data...")
        await scraper.process_and_store_data(scraped_data)
        
        return True
    else:
        logger.error("❌ No URLs scraped successfully")
        return False

async def run_comprehensive_test():
    """Run all tests in sequence"""
    logger.info("🚀 Starting comprehensive test suite...")
    
    tests = [
        ("Single URL Scrape", test_single_url_scrape),
        ("Embedding Generation", test_embedding_generation),
        ("Pinecone Connection", test_pinecone_connection),
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        logger.info(f"\n{'='*50}")
        logger.info(f"Running: {test_name}")
        logger.info(f"{'='*50}")
        
        try:
            results[test_name] = await test_func()
        except Exception as e:
            logger.error(f"Test '{test_name}' failed with exception: {str(e)}")
            results[test_name] = False
    
    # Summary
    logger.info(f"\n{'='*50}")
    logger.info("TEST SUMMARY")
    logger.info(f"{'='*50}")
    
    passed = sum(results.values())
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        logger.info(f"{status} - {test_name}")
    
    logger.info(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        logger.info("\n🎉 All tests passed! System is ready.")
        
        # Ask if user wants to run full scrape
        logger.info("\nRun full scrape of all AVEN URLs? This will:")
        logger.info("- Scrape all 7 AVEN website pages")
        logger.info("- Generate embeddings for all content")
        logger.info("- Store everything in Pinecone")
        logger.info("- Take approximately 2-3 minutes")
        
        return True
    else:
        logger.error(f"\n❌ {total - passed} tests failed. Please check configuration.")
        return False

async def main():
    """Main function with menu options"""
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "test":
            await run_comprehensive_test()
        elif command == "scrape":
            scraper = AVENWebScraper()
            await scraper.run_full_pipeline()
        elif command == "query":
            await test_query_system()
        elif command == "single":
            await test_single_url_scrape()
        else:
            print("Unknown command. Available commands:")
            print("  test    - Run comprehensive tests")
            print("  scrape  - Run full scraping pipeline")
            print("  query   - Test query system")
            print("  single  - Test single URL scrape")
    else:
        # Interactive menu
        print("\n🔥 Firecrawl + Gemini + Pinecone Integration")
        print("=" * 50)
        print("1. Run comprehensive tests")
        print("2. Scrape all AVEN URLs")
        print("3. Test query system")
        print("4. Test single URL scrape")
        print("5. Exit")
        
        choice = input("\nSelect an option (1-5): ").strip()
        
        if choice == "1":
            await run_comprehensive_test()
        elif choice == "2":
            scraper = AVENWebScraper()
            await scraper.run_full_pipeline()
        elif choice == "3":
            await test_query_system()
        elif choice == "4":
            await test_single_url_scrape()
        elif choice == "5":
            print("Goodbye!")
        else:
            print("Invalid choice. Exiting.")

if __name__ == "__main__":
    asyncio.run(main())
