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
Replace `[BOOK_TITLE]` and `[AUTHOR_NAME]` with your book details. The four demo prices are ₹499, ₹599, ₹449, and ₹549. For each book card, keep the visible price, `data-price`, and the matching entry in `BOOK_PRICES` in `app.js` synchronized.

`data-price` and values in `BOOK_PRICES` must be numeric prices in INR, without a currency symbol. The cart total is calculated automatically as price × quantity. Existing cart items for these four demo books are also refreshed to the current demo prices.

Use only original or licensed cover images if you add real covers. `[LOGO_URL]` is an optional placeholder if you later choose to use an image logo.

## Limitations
This is front-end only. Registration and login do not create accounts or authenticate users. Passwords are not stored or transmitted. Cart contents use browser `localStorage` for demonstration only and must not be trusted for real purchases. Checkout does not process payments or place orders.

## Dependencies
HTML5, CSS3, vanilla JavaScript and browser `localStorage`. No third-party libraries, API calls, database, or backend are included.
