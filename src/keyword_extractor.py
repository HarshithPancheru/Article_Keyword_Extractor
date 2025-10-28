import os
from dotenv import load_dotenv
from newsapi import NewsApiClient
import spacy
from collections import Counter

class ArticleKeywordExtractor:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Initialize NewsAPI client
        self.newsapi = NewsApiClient(api_key=os.getenv('NEWS_API_KEY'))
        
        # Load spaCy model
        self.nlp = spacy.load('en_core_web_sm')

    def fetch_articles(self, language='en', page=1, page_size=20, keyword=None):
        """
        Fetch articles from NewsAPI with pagination
        """
        try:
            if keyword:
                articles = self.newsapi.get_everything(
                    q=keyword,
                    language=language,
                    page=page,
                    page_size=page_size,
                    sort_by='relevancy'
                )
            else:
                articles = self.newsapi.get_top_headlines(
                    language=language,
                    page=page,
                    page_size=page_size
                )
            return articles['articles']
        except Exception as e:
            print(f"Error fetching articles: {e}")
            return []

    def extract_keywords(self, text, num_keywords=7):
        """
        Extract keywords from text using spaCy NLP
        """
        # Process text with spaCy
        doc = self.nlp(text)
        
        # Extract keywords (named entities and important noun phrases)
        keywords = []
        keywords.extend([ent.text.lower() for ent in doc.ents])
        keywords.extend([chunk.text.lower() for chunk in doc.noun_chunks 
                       if not all(token.is_stop for token in chunk)])
        
        # Count occurrences and get most common keywords
        word_freq = Counter(keywords)
        return [word for word, _ in word_freq.most_common(num_keywords)]