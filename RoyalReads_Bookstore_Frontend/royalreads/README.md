# RoyalReads — Engineering Bookstore

Responsive royal purple-and-gold engineering bookstore interface built with HTML5, CSS3 and vanilla JavaScript.

## Files
- `index.html` — home page
- `register.html` — registration form demo
- `login.html` — login form demo
- `catalogue.html` — placeholder engineering catalogue
- `cart.html` — cart and INR totals
- `styles.css` — global design and animations
- `app.js` — catalogue, validation and cart logic

## Run
1. Keep all files in the same folder.
2. Open `index.html` in a modern browser, or use VS Code Live Server.
3. Browse the catalogue and test cart interactions.

## Replace placeholders
Replace `[BOOK_TITLE]`, `[AUTHOR_NAME]` and `[PRICE_RUPEES]` with verified book details. For each book card, update the visible title and author, `data-title`, `data-author`, `data-price`, and unique `data-book-id`.

`data-price` must be a numeric price in INR, without a currency symbol. For example, `data-price="450"`. Update the visible `₹[PRICE_RUPEES]` text too. Placeholder prices are currently zero for calculations.

Use only original or licensed cover images if you add real covers. `[LOGO_URL]` is an optional placeholder if you later choose to use an image logo.

## Limitations
This is front-end only. Registration and login do not create accounts or authenticate users. Passwords are not stored or transmitted. Cart contents use browser `localStorage` for demonstration only and must not be trusted for real purchases. Checkout does not process payments or place orders.

## Dependencies
HTML5, CSS3, vanilla JavaScript and browser `localStorage`. No third-party libraries, API calls, database, or backend are included.
