from src.keyword_extractor import ArticleKeywordExtractor

def main():
    # Initialize the keyword extractor
    extractor = ArticleKeywordExtractor()
    
    # Get user input for search query
    query = input("Enter a topic to search for articles: ")
    
    # Process articles and extract keywords
    results = extractor.process_articles(query)
    
    # Display results
    print("\nResults:")
    print("-" * 50)
    
    for article in results:
        print(f"\nTitle: {article['title']}")
        print(f"URL: {article['url']}")
        print(f"Keywords: {', '.join(article['keywords'])}")
        print("-" * 50)

if __name__ == "__main__":
    main()