document.addEventListener('DOMContentLoaded', () => {
  let allQuotes = [];

  // Fetch quotes from JSON file
  fetch('quotes.json')
      .then(response => response.json())
      .then(quotes => {
          allQuotes = quotes;
          displayQuotes(allQuotes);
      })
      .catch(error => console.error('Error loading quotes:', error));

  // Search functionality
  document.getElementById('search-button').addEventListener('click', performSearch);
  document.getElementById('search-input').addEventListener('keyup', event => {
      if (event.key === 'Enter') {
          performSearch();
      }
  });

  function performSearch() {
      const searchTerm = document.getElementById('search-input').value.toLowerCase();
      const regex = new RegExp(searchTerm, 'gi');
      const filteredQuotes = allQuotes.filter(quote => 
          regex.test(quote.quote) ||
          regex.test(quote.author)
      );
      displayQuotes(filteredQuotes);
  }

  function displayQuotes(quotes) {
      const quotesList = document.getElementById('quotes-list');
      quotesList.innerHTML = '';
      quotes.forEach((quote, index) => {
          const quoteElement = document.createElement('div');
          quoteElement.classList.add('quote-item');
          quoteElement.innerHTML = `
              <blockquote>"${quote.quote}"</blockquote>
              <p>- ${quote.author}</p>
              <a href="quote.html?id=${index}">View Quote</a>
          `;
          quotesList.appendChild(quoteElement);
      });
  }
});