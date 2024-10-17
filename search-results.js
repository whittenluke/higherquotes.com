document.addEventListener('DOMContentLoaded', () => {
    let allQuotes = [];
    let displayedQuotes = 0;
    const quotesPerPage = 50;
    const maxLoadMoreClicks = 3;
    let loadMoreClickCount = 0;

    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    const searchType = urlParams.get('type');

    fetch('quotes.json')
        .then(response => response.json())
        .then(quotes => {
            allQuotes = quotes;
            performSearch();
        })
        .catch(error => console.error('Error loading quotes:', error));

    document.getElementById('load-more-button').addEventListener('click', loadMoreQuotes);

    function performSearch() {
        const filteredQuotes = filterQuotes(allQuotes, searchTerm, searchType);
        displayedQuotes = 0;
        loadMoreClickCount = 0;
        displayQuotes(filteredQuotes.slice(0, quotesPerPage));
        displayedQuotes = Math.min(quotesPerPage, filteredQuotes.length);
        updateLoadMoreButton(filteredQuotes);
        updateSearchInfo(searchTerm, searchType, filteredQuotes.length);
    }

    function filterQuotes(quotes, term, type) {
        const lowercaseTerm = term.toLowerCase();
        return quotes.filter(quote => {
            switch (type) {
                case 'topic':
                    return quote.topics.some(topic => topic.toLowerCase() === lowercaseTerm);
                case 'author':
                    return quote.author.toLowerCase() === lowercaseTerm;
                default:
                    return quote.quote.toLowerCase().includes(lowercaseTerm) ||
                           quote.author.toLowerCase().includes(lowercaseTerm) ||
                           quote.topics.some(topic => topic.toLowerCase().includes(lowercaseTerm));
            }
        });
    }

    function displayQuotes(quotes) {
        const quotesList = document.getElementById('quotes-list');
        quotesList.innerHTML = '';
        quotes.forEach((quote, index) => {
            const quoteElement = createQuoteElement(quote, index);
            quotesList.appendChild(quoteElement);
        });
    }

    function createQuoteElement(quote, index) {
        const quoteElement = document.createElement('div');
        quoteElement.classList.add('quote-item');
        quoteElement.innerHTML = `
            <a href="quote.html?id=${index}" class="quote-link">
                <blockquote>"${quote.quote}"</blockquote>
                <p>- ${quote.author}</p>
                <div class="topics">
                    ${quote.topics.map(topic => `<span class="topic-tag" data-topic="${topic}">${topic}</span>`).join(' ')}
                </div>
            </a>
        `;
        return quoteElement;
    }

    function loadMoreQuotes() {
        const filteredQuotes = filterQuotes(allQuotes, searchTerm, searchType);
        const newQuotes = filteredQuotes.slice(displayedQuotes, displayedQuotes + quotesPerPage);
        const quotesList = document.getElementById('quotes-list');
        newQuotes.forEach((quote, index) => {
            const quoteElement = createQuoteElement(quote, displayedQuotes + index);
            quotesList.appendChild(quoteElement);
        });
        displayedQuotes += newQuotes.length;
        loadMoreClickCount++;
        updateLoadMoreButton(filteredQuotes);
    }

    function updateLoadMoreButton(quotes) {
        const loadMoreButton = document.getElementById('load-more-button');
        if (displayedQuotes >= quotes.length || loadMoreClickCount >= maxLoadMoreClicks) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'block';
        }
    }

    function updateSearchInfo(term, type, resultCount) {
        const searchInfo = document.getElementById('search-info');
        let message = `Showing ${resultCount} result${resultCount !== 1 ? 's' : ''} `;
        switch (type) {
            case 'topic':
                message += `for topic "${term}"`;
                break;
            case 'author':
                message += `by author "${term}"`;
                break;
            default:
                message += `for "${term}"`;
        }
        searchInfo.textContent = message;
    }
});