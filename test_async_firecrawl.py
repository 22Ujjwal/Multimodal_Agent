# Install with: pip install firecrawl-py
import asyncio
from firecrawl import AsyncFirecrawlApp

urls = [
    "https://www.aven.com/",
    "https://www.aven.com/education",
    "https://www.aven.com/reviews",
    "https://www.aven.com/support",
    "https://www.aven.com/app",
    "https://www.aven.com/about",
    "https://www.aven.com/contact"
]

async def scrape_url(app, url):
    response = await app.scrape_url(
        url=url,
        formats=['markdown'],
        only_main_content=True,
        parse_pdf=False
    )
    print(f"--- Scraped {url} ---\n")
    print(response)
    return response

async def main():
    app = AsyncFirecrawlApp(api_key='fc-7e746c399d9f49ce88affe7c2b1244aa')
    tasks = [scrape_url(app, url) for url in urls]
    results = await asyncio.gather(*tasks)

    # Optional: Do something with `results`, like save to files or pass to embedding
    return results

if __name__ == "__main__":
    asyncio.run(main())
