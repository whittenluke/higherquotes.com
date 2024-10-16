document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quoteId = urlParams.get('id');

    fetch('quotes.json')
        .then(response => response.json())
        .then(quotes => {
            const quote = quotes[quoteId];
            if (quote) {
                displayQuote(quote);
            } else {
                displayError();
            }
        })
        .catch(error => console.error('Error loading quote:', error));

    function displayQuote(quote) {
        const quoteSection = document.getElementById('single-quote');
        quoteSection.innerHTML = `
            <div class="quote-item">
                <blockquote>"${quote.quote}"</blockquote>
                <p>- ${quote.author}</p>
                <div class="topics">
                    ${quote.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join(' ')}
                </div>
            </div>
        `;
    }

    function displayError() {
        const quoteSection = document.getElementById('single-quote');
        quoteSection.innerHTML = '<p>Quote not found.</p>';
    }
});