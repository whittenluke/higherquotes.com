document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('q');

  fetch('quotes.json')
      .then(response => response.json())
      .then(quotes => {
          const filteredQuotes = quotes.filter(quote =>
              new RegExp(searchTerm, 'gi').test(quote.quote) ||
              new RegExp(searchTerm, 'gi').test(quote.author) ||
              quote.topics.some(topic => new RegExp(searchTerm, 'gi').test(topic))
          );
          displayQuotes(filteredQuotes);
      })
      .catch(error => console.error('Error loading quotes:', error));

  document.getElementById('back-button').addEventListener('click', () => {
      window.location.href = 'quotes.html';
  });

  function displayQuotes(quotes) {
      const quotesList = document.getElementById('quotes-list');
      quotesList.innerHTML = '';
      quotes.forEach((quote, index) => {
          const quoteElement = document.createElement('div');
          quoteElement.classList.add('quote-item');
          quoteElement.innerHTML = `
              <blockquote>"${quote.quote}"</blockquote>
              <p>- ${quote.author}</p>
              <div class="topics">
                  ${quote.topics.map(topic => `<span class="topic-tag" data-topic="${topic}">${topic}</span>`).join(' ')}
              </div>
          `;
          quotesList.appendChild(quoteElement);
      });
  }
});