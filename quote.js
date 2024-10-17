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
        const quoteContainer = document.querySelector('#single-quote .quote-container');
        quoteContainer.innerHTML = `
            <blockquote id="daily-quote">"${quote.quote}"</blockquote>
            <p id="quote-author">- ${quote.author}</p>
            <div class="topics">
                ${quote.topics.map(topic => `<span class="topic-tag" data-topic="${topic}">${topic}</span>`).join(' ')}
            </div>
        `;

        // Add click event listeners to topic tags
        const topicTags = quoteContainer.querySelectorAll('.topic-tag');
        topicTags.forEach(tag => {
            tag.addEventListener('click', (event) => {
                const topic = event.target.dataset.topic;
                window.location.href = `search-results.html?search=${encodeURIComponent(topic)}&type=topic`;
            });
        });

        // Add share functionality
        document.getElementById('share-quote').addEventListener('click', () => {
            // Implement share functionality here
            alert('Share functionality to be implemented');
        });
    }

    function displayError() {
        const quoteContainer = document.querySelector('#single-quote .quote-container');
        quoteContainer.innerHTML = '<p>Quote not found.</p>';
    }
});