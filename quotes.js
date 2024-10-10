document.addEventListener('DOMContentLoaded', () => {
  let allQuotes = [];
  let displayedQuotes = 0;
  const quotesPerPage = 3; // Number of quotes to show initially and on each "Load More" click

  // Fetch quotes from JSON file
  fetch('quotes.json')
      .then(response => response.json())
      .then(quotes => {
          allQuotes = quotes;
          displayQuotes(allQuotes.slice(0, quotesPerPage));
          displayedQuotes = quotesPerPage;
          updateLoadMoreButton();
      })
      .catch(error => console.error('Error loading quotes:', error));

  // Search functionality
  document.getElementById('search-button').addEventListener('click', performSearch);
  document.getElementById('search-input').addEventListener('keyup', event => {
      if (event.key === 'Enter') {
          performSearch();
      }
  });

  // Load More functionality
  document.getElementById('load-more-button').addEventListener('click', loadMoreQuotes);

  function performSearch() {
      const searchTerm = document.getElementById('search-input').value.toLowerCase();
      const regex = new RegExp(searchTerm, 'gi');
      const filteredQuotes = allQuotes.filter(quote =>
          regex.test(quote.quote) ||
          regex.test(quote.author) ||
          quote.topics.some(topic => regex.test(topic))
      );
      displayQuotes(filteredQuotes.slice(0, quotesPerPage));
      displayedQuotes = Math.min(quotesPerPage, filteredQuotes.length);
      updateLoadMoreButton(filteredQuotes);
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
              <div class="topics">
                  ${quote.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join(' ')}
              </div>
              <a href="quote.html?id=${allQuotes.indexOf(quote)}">View Quote</a>
          `;
          quotesList.appendChild(quoteElement);
      });
  }

  function loadMoreQuotes() {
      const searchTerm = document.getElementById('search-input').value.toLowerCase();
      const relevantQuotes = searchTerm ?
          allQuotes.filter(quote =>
              new RegExp(searchTerm, 'gi').test(quote.quote) ||
              new RegExp(searchTerm, 'gi').test(quote.author) ||
              quote.topics.some(topic => new RegExp(searchTerm, 'gi').test(topic))
          ) : allQuotes;

      const newQuotes = relevantQuotes.slice(displayedQuotes, displayedQuotes + quotesPerPage);
      displayQuotes([...document.querySelectorAll('.quote-item'), ...newQuotes]);
      displayedQuotes += newQuotes.length;
      updateLoadMoreButton(relevantQuotes);
  }

  function updateLoadMoreButton(quotes = allQuotes) {
      const loadMoreButton = document.getElementById('load-more-button');
      loadMoreButton.style.display = displayedQuotes < quotes.length ? 'inline-block' : 'none';
  }
});