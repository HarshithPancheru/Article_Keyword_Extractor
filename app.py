from flask import Flask, render_template, request, jsonify
from src.keyword_extractor import ArticleKeywordExtractor
import os

app = Flask(__name__)
keyword_extractor = ArticleKeywordExtractor()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/articles')
def get_articles():
    try:
        page = request.args.get('page', 1, type=int)
        articles = keyword_extractor.fetch_articles(page=page)
        processed_articles = []
        
        for article in articles:
            if article.get('content') and article.get('title'):
                keywords = keyword_extractor.extract_keywords(article['title'] + ' ' + article['content'])
                processed_articles.append({
                    'title': article['title'],
                    'description': article['description'],
                    'url': article['url'],
                    'urlToImage': article.get('urlToImage'),
                    'keywords': keywords
                })
                
        return jsonify(processed_articles)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/articles/keyword/<keyword>')
def get_articles_by_keyword(keyword):
    try:
        page = request.args.get('page', 1, type=int)
        articles = keyword_extractor.fetch_articles(keyword=keyword, page=page)
        processed_articles = []
        
        for article in articles:
            if article.get('content') and article.get('title'):
                keywords = keyword_extractor.extract_keywords(article['title'] + ' ' + article['content'])
                processed_articles.append({
                    'title': article['title'],
                    'description': article['description'],
                    'url': article['url'],
                    'urlToImage': article.get('urlToImage'),
                    'keywords': keywords
                })
                
        return jsonify(processed_articles)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)