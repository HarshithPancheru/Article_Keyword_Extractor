# Article Keyword Extractor

This project is a Python application that extracts keywords from news articles using Natural Language Processing (NLP) techniques. It fetches articles using the NewsAPI and processes them using NLTK and spaCy libraries to extract relevant keywords.

## Features

- Fetch news articles using NewsAPI
- Extract keywords using NLP techniques
- Named Entity Recognition using spaCy
- Noun phrase extraction
- Frequency-based keyword ranking

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and add your NewsAPI key:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and replace `your_newsapi_key_here` with your actual NewsAPI key.

4. Install spaCy language model:
   ```bash
   python -m spacy download en_core_web_sm
   ```

## Usage

Run the main script:
```bash
python main.py
```

The program will:
1. Fetch relevant articles
2. Extract keywords from each article
3. Display the results with article titles, URLs, and extracted keywords
4. When keyword is clicked, it will display articles related to that keyword

## How it Works

The keyword extraction process uses multiple NLP techniques:
1. Named Entity Recognition (NER) using spaCy
2. Noun phrase extraction
3. Tokenization and stop word removal
4. Frequency-based ranking of potential keywords

## Requirements

- Python 3.8+
- NewsAPI key (get one at https://newsapi.org)
- Dependencies listed in requirements.txt
