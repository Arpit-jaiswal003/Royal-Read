"use strict";

/* RoyalReads front-end only. No backend, API calls, or authentication. */
const CART_KEY = "royalreads-cart-v1";
const BOOK_PRICES = { "book-001": 499, "book-002": 599, "book-003": 449, "book-004": 549 };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const formatINR = amount => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", minimumFractionDigits: 2
}).format(amount);

function readCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.map(item => item && BOOK_PRICES[item.id] !== undefined
      ? { ...item, price: BOOK_PRICES[item.id] } : item).filter(item => item && typeof item.id === "string" &&
      typeof item.title === "string" && typeof item.author === "string" &&
      Number.isFinite(item.price) && item.price >= 0 &&
      Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 99);
  } catch { return []; }
}
function writeCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
    return true;
  } catch {
    alert("The cart could not be saved in this browser.");
    return false;
  }
}
function updateCartCount() {
  const count = readCart().reduce((sum, item) => sum + item.quantity, 0);
  $$(".cart-count").forEach(el => {
    el.textContent = count;
    el.setAttribute("aria-label", `${count} items in cart`);
  });
}
function animateCartCount() {
  $$(".cart-count").forEach(el => {
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  });
}

/* Catalogue search, category filtering and add-to-cart. */
function initialiseCatalogue() {
  const grid = $("#book-grid");
  if (!grid) return;
  const search = $("#book-search");
  const category = $("#category-filter");
  const status = $("#catalogue-status");
  const empty = $("#catalogue-empty");
  const cards = $$(".book-card", grid);

  function filterBooks() {
    const term = search.value.trim().toLowerCase();
    const selected = category.value;
    let visible = 0;
    cards.forEach(card => {
      const haystack = `${card.dataset.title || ""} ${card.dataset.author || ""} ${card.dataset.category || ""}`.toLowerCase();
      const show = haystack.includes(term) && (selected === "all" || card.dataset.category === selected);
      card.hidden = !show;
      if (show) visible++;
    });
    status.textContent = `${visible} book${visible === 1 ? "" : "s"} shown.`;
    empty.hidden = visible !== 0;
  }
  search.addEventListener("input", filterBooks);
  category.addEventListener("change", filterBooks);

  grid.addEventListener("click", event => {
    const button = event.target.closest(".add-to-cart");
    if (!button) return;
    const card = button.closest(".book-card");
    if (!card) return;
    const id = button.dataset.bookId;
    const price = Number(card.dataset.price);
    if (!id || !Number.isFinite(price) || price < 0) {
      status.textContent = "This book has invalid price information.";
      return;
    }
    const cart = readCart();
    const existing = cart.find(item => item.id === id);
    if (existing) {
      if (existing.quantity >= 99) {
        status.textContent = "Maximum quantity reached.";
        return;
      }
      existing.quantity++;
    } else {
      cart.push({ id, title: card.dataset.title || "[BOOK_TITLE]",
        author: card.dataset.author || "[AUTHOR_NAME]", price, quantity: 1 });
    }
    if (!writeCart(cart)) return;
    status.textContent = `${card.dataset.title || "Book"} added to your cart.`;
    animateCartCount();
    const original = button.textContent;
    button.textContent = "Added ✓";
    button.disabled = true;
    window.setTimeout(() => { button.textContent = original; button.disabled = false; }, 800);
  });
  filterBooks();
}

/* Cart rows are built with textContent to avoid interpreting book data as HTML. */
function initialiseCart() {
  const container = $("#cart-items");
  if (!container) return;
  const empty = $("#cart-empty");
  const subtotalEl = $("#cart-subtotal");
  const totalEl = $("#cart-total");
  const quantityEl = $("#summary-quantity");
  const clearButton = $("#clear-cart");
  const checkoutButton = $("#checkout-button");
  const checkoutMessage = $("#checkout-message");

  function renderCart() {
    const cart = readCart();
    container.replaceChildren();
    empty.hidden = cart.length !== 0;
    clearButton.disabled = cart.length === 0;
    checkoutButton.disabled = cart.length === 0;
    let subtotal = 0, totalQuantity = 0;

    cart.forEach(item => {
      subtotal += item.price * item.quantity;
      totalQuantity += item.quantity;
      const row = document.createElement("article");
      row.className = "cart-item";
      const details = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = item.title;
      const author = document.createElement("p");
      author.textContent = `By ${item.author}`;
      const price = document.createElement("p");
      price.className = "cart-item-price";
      price.textContent = formatINR(item.price * item.quantity);
      details.append(title, author, price);

      const controls = document.createElement("div");
      controls.className = "cart-item-controls";
      const quantityControl = document.createElement("div");
      quantityControl.className = "quantity-control";
      quantityControl.setAttribute("aria-label", `Quantity for ${item.title}`);
      const decrease = document.createElement("button");
      decrease.type = "button"; decrease.textContent = "−";
      decrease.setAttribute("aria-label", `Decrease quantity of ${item.title}`);
      decrease.disabled = item.quantity <= 1;
      decrease.addEventListener("click", () => changeQuantity(item.id, -1));
      const quantity = document.createElement("span");
      quantity.className = "quantity-value"; quantity.textContent = item.quantity;
      quantity.setAttribute("aria-label", `Quantity ${item.quantity}`);
      const increase = document.createElement("button");
      increase.type = "button"; increase.textContent = "+";
      increase.setAttribute("aria-label", `Increase quantity of ${item.title}`);
      increase.disabled = item.quantity >= 99;
      increase.addEventListener("click", () => changeQuantity(item.id, 1));
      quantityControl.append(decrease, quantity, increase);

      const remove = document.createElement("button");
      remove.type = "button"; remove.className = "remove-item"; remove.textContent = "Remove";
      remove.setAttribute("aria-label", `Remove ${item.title} from cart`);
      remove.addEventListener("click", () => {
        const next = readCart().filter(book => book.id !== item.id);
        if (writeCart(next)) renderCart();
      });
      controls.append(quantityControl, remove);
      row.append(details, controls);
      container.append(row);
    });
    quantityEl.textContent = totalQuantity;
    subtotalEl.textContent = formatINR(subtotal);
    totalEl.textContent = formatINR(subtotal);
  }

  function changeQuantity(id, delta) {
    const cart = readCart();
    const item = cart.find(book => book.id === id);
    if (!item) return;
    const next = item.quantity + delta;
    if (next < 1 || next > 99) return;
    item.quantity = next;
    if (writeCart(cart)) renderCart();
  }

  clearButton.addEventListener("click", () => {
    if (!readCart().length) return;
    if (window.confirm("Remove all books from your cart?")) {
      if (writeCart([])) { checkoutMessage.textContent = ""; renderCart(); }
    }
  });
  checkoutButton.addEventListener("click", () => {
    checkoutMessage.classList.remove("error");
    checkoutMessage.textContent = "Demo only: checkout is not connected to a payment or ordering service.";
  });
  renderCart();
}

function showFormMessage(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("error", isError);
}
function initialiseRegistration() {
  const form = $("#register-form");
  if (!form) return;
  const message = $("#register-message");
  const password = $("#register-password");
  const confirmPassword = $("#confirm-password");
  form.addEventListener("submit", event => {
    event.preventDefault();
    showFormMessage(message, "");
    if (!form.reportValidity()) return;
    if (password.value.length < 8) {
      password.focus();
      showFormMessage(message, "Password must contain at least 8 characters.", true);
      return;
    }
    if (password.value !== confirmPassword.value) {
      confirmPassword.focus();
      showFormMessage(message, "Passwords do not match.", true);
      return;
    }
    showFormMessage(message, "Demo validation successful. No account was created.");
    form.reset(); // Passwords are never persisted or transmitted.
  });
}
function initialiseLogin() {
  const form = $("#login-form");
  if (!form) return;
  const message = $("#login-message");
  form.addEventListener("submit", event => {
    event.preventDefault();
    showFormMessage(message, "");
    if (!form.reportValidity()) return;
    showFormMessage(message, "Form validation successful. Authentication is not implemented.");
    form.reset();
  });
}
document.addEventListener("DOMContentLoaded", () => {
  $$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
  updateCartCount();
  initialiseCatalogue();
  initialiseCart();
  initialiseRegistration();
  initialiseLogin();
});
