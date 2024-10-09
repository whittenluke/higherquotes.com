document.addEventListener('DOMContentLoaded', () => {
    // Fetch quotes from JSON file
    fetch('quotes.json')
        .then(response => response.json())
        .then(quotes => {
            const dailyQuote = getRandomQuote(quotes);
            displayQuote(dailyQuote);
        })
        .catch(error => console.error('Error loading quotes:', error));
  
    // Share button functionality
    const shareButton = document.getElementById('share-quote');
    shareButton.addEventListener('click', () => {
        const quote = document.getElementById('daily-quote').textContent;
        const author = document.getElementById('quote-author').textContent;
        const shareText = `"${quote}" - ${author}`;
  
        if (navigator.share) {
            navigator.share({
                text: shareText,
                title: 'Quote of the Day',
                url: window.location.href,
            })
                .then(() => console.log('Thanks for sharing!'))
                .catch(error => console.error('Error sharing:', error));
        } else {
            // Fallback for browsers that don't support navigator.share
            const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            window.open(shareUrl, '_blank');
        }
    });
  
    // Email validation
    document.getElementById('subscription-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const errorMessage = document.getElementById('error-message');
  
        // Check if email is valid
        if (!validateEmail(email)) {
            errorMessage.textContent = 'Please enter a valid email address';
        } else {
            alert(`Thank you for subscribing with the email: ${email}`);
            // Here you would typically send the email to your server for storage or a service like Mailchimp
        }
    });
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
  
    quoteElement.textContent = quote.quote;
    authorElement.textContent = `- ${quote.author}`;
  }
  
  function validateEmail(email) {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }