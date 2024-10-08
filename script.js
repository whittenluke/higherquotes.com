document.addEventListener('DOMContentLoaded', () => {
  fetch('quotes.json')
      .then(response => response.json())
      .then(quotes => {
          const dailyQuote = getRandomQuote(quotes);
          displayQuote(dailyQuote);
      })
      .catch(error => console.error('Error loading quotes:', error));
});

function getRandomQuote(quotes) {
  const today = new Date().toDateString();
  const storedQuote = localStorage.getItem(today);

  if (storedQuote) {
      return JSON.parse(storedQuote);
  } else {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      localStorage.setItem(today, JSON.stringify(randomQuote));
      return randomQuote;
  }
}

function displayQuote(quote) {
  const quoteElement = document.getElementById('daily-quote');
  const authorElement = document.getElementById('quote-author');

  quoteElement.textContent = `"${quote.quote}"`;
  authorElement.textContent = `- ${quote.author}`;
}

document.getElementById('subscription-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  alert(`Thank you for subscribing with the email: ${email}`);
  // Here you would typically send the email to your server for storage or a service like Mailchimp
});