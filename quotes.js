document.addEventListener('DOMContentLoaded', () => {
  let allQuotes = [];
  let displayedQuotes = 0;
  const quotesPerPage = 6;

  fetch('quotes.json')
      .then(response => response.json())
      .then(quotes => {
          allQuotes = quotes;
          displayQuotes(allQuotes.slice(0, quotesPerPage));
          displayedQuotes = quotesPerPage;
          updateLoadMoreButton();
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

  function performSearch(searchTerm = '') {
      if (!searchTerm) {
          searchTerm = document.getElementById('search-input').value.toLowerCase();
      }
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
                  ${quote.topics.map(topic => `<span class="topic-tag" data-topic="${topic}">${topic}</span>`).join(' ')}
              </div>
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

  function handleTopicClick(event) {
      if (event.target.classList.contains('topic-tag') || event.target.tagName === 'LI') {
          const topic = event.target.dataset.topic || event.target.textContent;
          document.getElementById('search-input').value = topic;
          performSearch(topic);
      }
  }

  function handleAuthorClick(event) {
      if (event.target.tagName === 'LI') {
          const author = event.target.textContent;
          document.getElementById('search-input').value = author;
          performSearch(author);
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
  document.getElementById('search-button').addEventListener('click', () => {
    performSearch(true);
});

document.getElementById('search-input').addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        performSearch(true);
    }
});

function performSearch(navigateToResults = false) {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const regex = new RegExp(searchTerm, 'gi');
    const filteredQuotes = allQuotes.filter(quote =>
        regex.test(quote.quote) ||
        regex.test(quote.author) ||
        quote.topics.some(topic => regex.test(topic))
    );

    if (navigateToResults) {
        window.location.href = 'search-results.html?q=' + encodeURIComponent(searchTerm);
    } else {
        displayQuotes(filteredQuotes.slice(0, quotesPerPage));
        displayedQuotes = Math.min(quotesPerPage, filteredQuotes.length);
        updateLoadMoreButton(filteredQuotes);
    }
}
});