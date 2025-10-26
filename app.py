from flask import Flask, render_template, request, jsonify
from src.keyword_extractor import ArticleKeywordExtractor
import os

app = Flask(__name__)
keyword_extractor = ArticleKeywordExtractor()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    query = data.get('query', '')
    
    if not query:
        return jsonify({'error': 'Query is required'}), 400
    
    try:
        results = keyword_extractor.process_articles(query)
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)