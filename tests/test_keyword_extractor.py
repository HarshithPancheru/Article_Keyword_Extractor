import pytest
from src.keyword_extractor import ArticleKeywordExtractor

def test_keyword_extractor_initialization():
    extractor = ArticleKeywordExtractor()
    assert extractor is not None

def test_extract_keywords():
    extractor = ArticleKeywordExtractor()
    text = "Natural language processing is a fascinating field."
    keywords = extractor.extract_keywords(text)
    assert isinstance(keywords, list)
    assert len(keywords) > 0

def test_empty_text():
    extractor = ArticleKeywordExtractor()
    keywords = extractor.extract_keywords("")
    assert keywords == []

def test_invalid_input():
    extractor = ArticleKeywordExtractor()
    with pytest.raises(TypeError):
        extractor.extract_keywords(123)