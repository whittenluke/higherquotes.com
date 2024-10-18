document.addEventListener('DOMContentLoaded', () => {
    let allQuotes = [];
    let displayedQuotes = 0;
    const quotesPerPage = 50;
    const maxLoadMoreClicks = 3;
    let loadMoreClickCount = 0;

    fetch('quotes.json')
        .then(response => response.json())
        .then(quotes => {
            allQuotes = quotes;
            loadInitialQuotes();
            displayTopics();
            displayAuthors();
        })
        .catch(error => console.error('Error loading quotes:', error));

    document.getElementById('search-form').addEventListener('submit', handleSearch);
    document.getElementById('topics-list').addEventListener('click', handleTopicClick);
    document.getElementById('authors-list').addEventListener('click', handleAuthorClick);
    document.getElementById('load-more-button').addEventListener('click', loadMoreQuotes);
    document.getElementById('quotes-list').addEventListener('click', handleQuoteTopicClick);

    function handleSearch(event) {
        event.preventDefault();
        const searchTerm = document.getElementById('search-input').value.trim();
        if (searchTerm) {
            window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
        }
    }

    function handleTopicClick(event) {
        if (event.target.tagName === 'LI') {
            const topic = event.target.textContent;
            window.location.href = `search-results.html?q=${encodeURIComponent(topic)}`;
        }
    }

    function handleAuthorClick(event) {
        if (event.target.tagName === 'LI') {
            const author = event.target.textContent;
            window.location.href = `search-results.html?q=${encodeURIComponent(author)}`;
        }
    }

    function handleQuoteTopicClick(event) {
        if (event.target.classList.contains('topic-tag')) {
            const topic = event.target.textContent;
            window.location.href = `search-results.html?q=${encodeURIComponent(topic)}`;
        }
    }

    function loadInitialQuotes() {
        displayQuotes(allQuotes.slice(0, quotesPerPage));
        displayedQuotes = quotesPerPage;
        updateLoadMoreButton();
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
        const newQuotes = allQuotes.slice(displayedQuotes, displayedQuotes + quotesPerPage);
        const quotesList = document.getElementById('quotes-list');
        newQuotes.forEach((quote, index) => {
            const quoteElement = createQuoteElement(quote, displayedQuotes + index);
            quotesList.appendChild(quoteElement);
        });
        displayedQuotes += newQuotes.length;
        loadMoreClickCount++;
        updateLoadMoreButton();
    }

    function updateLoadMoreButton() {
        const loadMoreButton = document.getElementById('load-more-button');
        if (displayedQuotes >= allQuotes.length || loadMoreClickCount >= maxLoadMoreClicks) {
            loadMoreButton.textContent = 'View All Quotes';
            loadMoreButton.onclick = viewAllQuotes;
        } else {
            loadMoreButton.style.display = 'block';
        }
    }

    function viewAllQuotes() {
        const quotesList = document.getElementById('quotes-list');
        quotesList.innerHTML = '';
        displayQuotes(allQuotes);
        document.getElementById('load-more-button').style.display = 'none';
    }

    function displayTopics() {
        const topicsList = document.getElementById('topics-list').querySelector('ul');
        const topics = [...new Set(allQuotes.flatMap(quote => quote.topics))];
        topics.forEach(topic => {
            const li = document.createElement('li');
            li.textContent = topic;
            li.dataset.topic = topic;
            topicsList.appendChild(li);
        });
    }

    function displayAuthors() {
        const authorsList = document.getElementById('authors-list').querySelector('ul');
        const authors = [...new Set(allQuotes.map(quote => quote.author))];
        authors.forEach(author => {
            const li = document.createElement('li');
            li.textContent = author;
            authorsList.appendChild(li);
        });
    }
});