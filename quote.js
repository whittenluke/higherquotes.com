document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quoteId = urlParams.get('id');

    if (quoteId) {
        fetchQuote(quoteId);
    } else {
        displayError('No quote ID provided');
    }

    function fetchQuote(id) {
        fetch('quotes.json')
            .then(response => response.json())
            .then(quotes => {
                const quote = quotes[id];
                if (quote) {
                    displayQuote(quote);
                } else {
                    displayError('Quote not found');
                }
            })
            .catch(error => {
                console.error('Error loading quote:', error);
                displayError('Error loading quote');
            });
    }

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

    function displayError(message) {
        const quoteSection = document.getElementById('single-quote');
        quoteSection.innerHTML = `<p>${message}</p>`;
    }

    // Add a back button functionality
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back();
        });
    }
});