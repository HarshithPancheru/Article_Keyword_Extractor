document.addEventListener('DOMContentLoaded', function() {
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingSpinner = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');

    // State variables for infinite scrolling
    let currentPage = 1;
    let isLoading = false;
    let hasMore = true;
    let currentKeyword = null;

    // Fetch initial articles
    fetchArticles();

    async function fetchArticles(keyword = null, reset = false) {
        if (isLoading || (!hasMore && !reset)) return;

        try {
            isLoading = true;
            showLoading();
            hideError();

            if (reset) {
                currentPage = 1;
                hasMore = true;
                resultsContainer.innerHTML = '';
            }

            if (keyword !== null) {
                currentKeyword = keyword;
            }

            const url = currentKeyword
                ? `/articles/keyword/${encodeURIComponent(currentKeyword)}?page=${currentPage}`
                : `/articles?page=${currentPage}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
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
    }

    function displayResults(articles) {
        if (articles.length === 0) {
            if (currentPage === 1) {
                showError('No articles available at the moment');
            }
            hasMore = false;
            return;
        }

        // Remove the loading trigger if it exists
        const existingTrigger = document.querySelector('.loading-trigger');
        if (existingTrigger) {
            existingTrigger.remove();
        }

        if (currentPage === 1) {
            resultsContainer.innerHTML = '';
            // Create a header for the section
            let sectionHeader = document.getElementById("section-header");
            sectionHeader.innerText = currentKeyword 
                ? `Articles related to "${currentKeyword}"`
                : 'Latest Articles';
        }

        // Set isLoading to false since we're done loading
        isLoading = false;
        
        // Increment page for next fetch
        currentPage++;

        articles.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.className = 'article-card';
            
            const keywordLinks = article.keywords.map(keyword => 
                `<a href="#" class="keyword-tag" data-keyword="${keyword}">${keyword}</a>`
            ).join(' ');
            
            articleElement.innerHTML = `
                <div class="article-content">
                    ${article.urlToImage ? 
                        `<div class="article-image">
                            <img src="${article.urlToImage}" alt="${article.title}" onerror="this.style.display='none'">
                        </div>` : ''
                    }
                    <div class="article-text">
                        <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                        <p>${article.description || 'No description available'}</p>
                        <div class="keywords">
                            <strong>Key Topics:</strong> 
                            <div class="keyword-tags">
                                ${keywordLinks}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            resultsContainer.appendChild(articleElement);
        });

        // Create and append a new loading trigger after the articles
        const loadingTrigger = document.createElement('div');
        loadingTrigger.className = 'loading-trigger';
        loadingTrigger.style.height = '20px';
        loadingTrigger.style.margin = '2rem 0';
        resultsContainer.appendChild(loadingTrigger);

        // Observe the new loading trigger
        intersectionObserver.observe(loadingTrigger);
    }

    function showLoading() {
        loadingSpinner.style.display = 'flex';
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

    // Intersection Observer for infinite scrolling
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isLoading && hasMore) {
                fetchArticles();
            }
        });
    }, observerOptions);

    // Initial loading trigger will be created in displayResults

    // Add click handler for keyword tags
    resultsContainer.addEventListener('click', async function(e) {
        if (e.target.classList.contains('keyword-tag')) {
            e.preventDefault();
            const keyword = e.target.dataset.keyword;
            
            // Reset and fetch new articles for the keyword
            fetchArticles(keyword, true);
            
            // Scroll to top after resetting results
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});