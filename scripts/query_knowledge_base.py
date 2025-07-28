#!/usr/bin/env python3
"""
Query Knowledge Base Script
Called by Next.js API to query the Pinecone knowledge base
"""

import sys
import json
import asyncio
import os
from pathlib import Path

# Add the project root to the path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

from scripts.firecrawl_integration import AVENWebScraper
import logging

# Suppress logs for API usage
logging.getLogger().setLevel(logging.ERROR)

async def query_knowledge_base(query: str, top_k: int = 5):
    """Query the knowledge base and return results as JSON"""
    try:
        scraper = AVENWebScraper()
        scraper.setup_pinecone_index()
        
        results = scraper.query_knowledge_base(query, top_k=top_k)
        
        # Format results for API response
        formatted_results = []
        for result in results:
            formatted_results.append({
                'score': float(result['score']),
                'url': result['url'],
                'title': result['title'],
                'content': result['content'],
                'chunk_index': result['chunk_index']
            })
        
        return {
            'success': True,
            'query': query,
            'results': formatted_results,
            'total_results': len(formatted_results)
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'query': query,
            'results': []
        }

def main():
    if len(sys.argv) != 2:
        print(json.dumps({
            'success': False,
            'error': 'Query parameter required',
            'results': []
        }))
        sys.exit(1)
    
    query = sys.argv[1]
    result = asyncio.run(query_knowledge_base(query))
    print(json.dumps(result))

if __name__ == "__main__":
    main()
