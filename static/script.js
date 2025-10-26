document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingSpinner = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');

    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        
        if (!query) {
            showError('Please enter a search query');
            return;
        }

        try {
            showLoading();
            hideError();
            
            const response = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            displayResults(data);
        } catch (error) {
            showError('An error occurred while fetching the articles');
            console.error('Error:', error);
        } finally {
            hideLoading();
        }
    });

    function displayResults(articles) {
        resultsContainer.innerHTML = '';
        
        if (!articles.length) {
            showError('No articles found for this query');
            return;
        }

        articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            
            articleCard.innerHTML = `
                <h2 class="article-title">${article.title}</h2>
                <a href="${article.url}" target="_blank" class="article-link">Read Article</a>
                <div class="keywords">
                    ${article.keywords.map(keyword => 
                        `<span class="keyword">${keyword}</span>`
                    ).join('')}
                </div>
            `;
            
            resultsContainer.appendChild(articleCard);
        });
    }

    function showLoading() {
        loadingSpinner.style.display = 'block';
        resultsContainer.innerHTML = '';
    }

    function hideLoading() {
        loadingSpinner.style.display = 'none';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }
});