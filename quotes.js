document.addEventListener('DOMContentLoaded', () => {
    let allQuotes = [];
    let displayedQuotes = 0;
    const quotesPerPage = 46;
    const maxLoadMoreClicks = 3;
    let loadMoreClickCount = 0;

    // Function to fetch quotes from Quotable API
    async function fetchQuotableQuotes(limit = 50) {
        try {
            const response = await fetch(`https://api.quotable.io/quotes?limit=${limit}`);
            const data = await response.json();
            console.log('Quotable API response:', data);
            return data.results.map(quote => ({
                quote: quote.content,
                author: quote.author,
                topics: quote.tags
            }));
        } catch (error) {
            console.error('Error fetching quotes from Quotable:', error);
            return [];
        }
    }

    // Function to fetch local quotes
    async function fetchLocalQuotes() {
        try {
            const response = await fetch('quotes.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading local quotes:', error);
            return [];
        }
    }

    // Fetch and combine quotes
    Promise.all([fetchLocalQuotes(), fetchQuotableQuotes()])
        .then(([localQuotes, quotableQuotes]) => {
            console.log('Local quotes:', localQuotes);
            console.log('Quotable quotes:', quotableQuotes);
            allQuotes = [...localQuotes, ...quotableQuotes];
            console.log('Combined quotes:', allQuotes);
            loadInitialQuotes();
            displayTopics();
            displayAuthors();
        })
        .catch(error => console.error('Error loading quotes:', error));

    document.getElementById('search-button').addEventListener('click', performSearch);
    document.getElementById('search-input').addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    document.getElementById('load-more-button').addEventListener('click', loadMoreQuotes);
    document.getElementById('quotes-list').addEventListener('click', handleTopicClick);
    document.getElementById('topics-list').addEventListener('click', handleTopicClick);
    document.getElementById('authors-list').addEventListener('click', handleAuthorClick);

    function loadInitialQuotes() {
        console.log('Loading initial quotes:', allQuotes.slice(0, quotesPerPage));
        displayQuotes(allQuotes.slice(0, quotesPerPage));
        displayedQuotes = quotesPerPage;
        updateLoadMoreButton();
    }

    function performSearch() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const filteredQuotes = allQuotes.filter(quote =>
            quote.quote.toLowerCase().includes(searchTerm) ||
            quote.author.toLowerCase().includes(searchTerm) ||
            quote.topics.some(topic => topic.toLowerCase().includes(searchTerm))
        );
        displayedQuotes = 0;
        loadMoreClickCount = 0;
        displayQuotes(filteredQuotes.slice(0, quotesPerPage));
        displayedQuotes = Math.min(quotesPerPage, filteredQuotes.length);
        updateLoadMoreButton(filteredQuotes);
    }

    function displayQuotes(quotes) {
        console.log('Displaying quotes:', quotes);
        const quotesList = document.getElementById('quotes-list');
        quotesList.innerHTML = '';
        quotes.forEach(quote => {
            const quoteElement = createQuoteElement(quote);
            quotesList.appendChild(quoteElement);
        });
    }

    function createQuoteElement(quote) {
        const quoteElement = document.createElement('div');
        quoteElement.classList.add('quote-item');
        quoteElement.innerHTML = `
            <blockquote>"${quote.quote}"</blockquote>
            <p>- ${quote.author}</p>
            <div class="topics">
                ${quote.topics.map(topic => `<span class="topic-tag" data-topic="${topic}">${topic}</span>`).join(' ')}
            </div>
        `;
        return quoteElement;
    }
    
    function loadMoreQuotes() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const relevantQuotes = searchTerm ? 
            allQuotes.filter(quote =>
                quote.quote.toLowerCase().includes(searchTerm) ||
                quote.author.toLowerCase().includes(searchTerm) ||
                quote.topics.some(topic => topic.toLowerCase().includes(searchTerm))
            ) : allQuotes;
    
        const newQuotes = relevantQuotes.slice(displayedQuotes, displayedQuotes + quotesPerPage);
        const quotesList = document.getElementById('quotes-list');
        newQuotes.forEach(quote => {
            const quoteElement = createQuoteElement(quote);
            quotesList.appendChild(quoteElement);
        });
        displayedQuotes += newQuotes.length;
        loadMoreClickCount++;
        updateLoadMoreButton(relevantQuotes);
    }
    
    function updateLoadMoreButton(quotes = allQuotes) {
        const loadMoreButton = document.getElementById('load-more-button');
        if (displayedQuotes >= quotes.length || loadMoreClickCount >= maxLoadMoreClicks) {
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
    
    function handleTopicClick(event) {
        if (event.target.classList.contains('topic-tag') || event.target.tagName === 'LI') {
            const topic = event.target.dataset.topic || event.target.textContent;
            document.getElementById('search-input').value = topic;
            performSearch();
        }
    }
    
    function handleAuthorClick(event) {
        if (event.target.tagName === 'LI') {
            const author = event.target.textContent;
            document.getElementById('search-input').value = author;
            performSearch();
        }
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