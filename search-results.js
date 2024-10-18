document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q');

    const searchInput = document.getElementById('search-input');
    searchInput.value = searchTerm || '';

    document.getElementById('search-form').addEventListener('submit', handleSearch);
    document.getElementById('back-button').addEventListener('click', () => {
        window.location.href = 'quotes.html';
    });

    function handleSearch(event) {
        event.preventDefault();
        const newSearchTerm = searchInput.value.trim();
        if (newSearchTerm) {
            window.location.href = `search-results.html?q=${encodeURIComponent(newSearchTerm)}`;
        }
    }

    if (searchTerm) {
        performSearch(searchTerm);
    }

    function performSearch(term) {
        fetch('quotes.json')
            .then(response => response.json())
            .then(quotes => {
                const filteredQuotes = quotes.filter(quote =>
                    quote.quote.toLowerCase().includes(term.toLowerCase()) ||
                    quote.author.toLowerCase().includes(term.toLowerCase()) ||
                    quote.topics.some(topic => topic.toLowerCase().includes(term.toLowerCase()))
                );
                displayQuotes(filteredQuotes);
            })
            .catch(error => console.error('Error loading quotes:', error));
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
            <blockquote>"${quote.quote}"</blockquote>
            <p>- ${quote.author}</p>
            <div class="topics">
                ${quote.topics.map(topic => `<span class="topic-tag" data-topic="${topic}">${topic}</span>`).join(' ')}
            </div>
        `;
        return quoteElement;
    }
});