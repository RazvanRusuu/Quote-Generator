"use strict";
import "./src/toggleStorage.js";
import { getQuotes, setQuote, getSingleQuote, getJSON } from "./src/Storage.js";
import { getElement } from "./src/Storage.js";
import { openStorage, closeStorage } from "./src/toggleStorage.js";

const API_URL = "https://type.fit/api/quotes";
const storageItemsCount = getElement(".storage-count");
let quotes = getQuotes("quotes");

const getQuoteData = async function () {
  try {
    quote.renderSpinner();
    const quotes = await getJSON(API_URL);
    const randomQuote = Math.round(Math.random() * quotes.length);
    quote.renderQuote(quotes[randomQuote]);
  } catch (err) {
    console.log(err);
  }
};

const controlDeleteQuote = function (id) {
  const quoteToDelete = getSingleQuote(id);
  quotes = quotes.filter((item) => item._id !== quoteToDelete._id);
  setQuote("quotes", quotes);
  quote.updateStorageDom(quotes);
  if (quotes.length < 1) closeStorage();
};

class newQuote {
  _id = Date.now().toString();
  _quote;
  constructor(quote) {
    this._quote = quote;
  }
}

class Quote {
  _quoteStorageContainer = getElement(".storage-list");
  _quoteContainer = getElement("#quote-container");
  _quote = {};
  _quotes = getQuotes("quotes");

  renderSpinner() {
    this._quoteContainer.innerHTML = "";
    const markup = `
    <div class="loader" id="loader"></div>
    `;
    this._quoteContainer.insertAdjacentHTML("afterbegin", markup);
  }

  renderQuote(...quote) {
    this._quoteContainer.innerHTML = "";
    this._quote = quote;
    const markup = this._quote.map(this._generateMarkup).join("");
    this._quoteContainer.insertAdjacentHTML("afterbegin", markup);
  }
  _generateMarkup(quote) {
    return `
     <div class="quote-text">
        <i class="fas fa-quote-left"></i>
        <span class="quote" id="quote">
          ${quote.text}
        </span>
      </div>

      <div class="quote-author">
        <span class="author">${quote.author ? quote.author : "Unknown"}</span>
      </div>
      <div class="btn-container">
        <button class="btn twitter-button" id="twitter" title="Tweet this!">
          <i class="fab fa-twitter"></i>
        </button>
        <button data-id="" class="btn save-button" title="save">
          <i class="fa-solid fa-floppy-disk"></i>
        </button>
        <button class="btn" id="new-quote">New Quote</button>
      </div>`;
  }

  _tweetQuote() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${this._quote.text} - ${this._quote.author}`;
    window.open(twitterUrl, "_blank");
  }

  _saveToQuotes() {
    const quote = new newQuote(...this._quote);
    quotes = [...quotes, quote];
    setQuote("quotes", quotes);
    this.updateStorageDom();
    this.renderSaveQuotes(quote);
    openStorage();
  }

  updateStorageDom() {
    storageItemsCount.textContent = quotes.length;
  }

  renderSaveQuotes(...quotes) {
    const markup = quotes.map(this._generateMarkupStoarageQuote).join("");
    this._quoteStorageContainer.insertAdjacentHTML("afterbegin", markup);
  }
  _generateMarkupStoarageQuote(quote) {
    const {
      _id: id,
      _quote: { text, author },
    } = quote;

    return `
    <li data-id="${id}" class="storage-quote">
    <span class="storage-quote-text">
      ${text}</span>
    
    <span class="storage-quote-author">${author ? author : "Unknown"}</span>
    <button data-id="${id}" class="remove-quote">
      <i class="fa-solid fa-delete-left"></i>
    </button>
  </li>
    
    `;
  }
  addHandlerButtons(handler) {
    this._quoteContainer.addEventListener("click", (e) => {
      const newQuoteBtn = e.target.closest("#new-quote");
      const tweetBtn = e.target.closest("#twitter");
      if (!newQuoteBtn && !tweetBtn) return;
      if (newQuoteBtn) handler();
      if (tweetBtn) this._tweetQuote();
    });
  }
  addHandlerSave() {
    this._quoteContainer.addEventListener("click", (e) => {
      const saveBtn = e.target.closest(".save-button");
      if (!saveBtn) return;
      this._saveToQuotes();
    });
  }

  handleStorageQuote() {
    this.renderSaveQuotes(...quotes);
  }
  handleDeleteQuote(handler) {
    this._quoteStorageContainer.addEventListener("click", (e) => {
      const deleteBtn = e.target.closest(".remove-quote");
      if (!deleteBtn) return;
      const parentEl = deleteBtn.closest(".storage-quote");
      parentEl.remove();
      const { id } = deleteBtn.dataset;
      handler(id);
    });
  }
}

const quote = new Quote();

const init = function () {
  quote.renderSpinner();
  quote.updateStorageDom();
  getQuoteData();
  quote.addHandlerButtons(getQuoteData);
  quote.addHandlerSave();
  quote.handleStorageQuote();
  quote.handleDeleteQuote(controlDeleteQuote);
};

document.addEventListener("DOMContentLoaded", init);
