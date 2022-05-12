"use strict";
import "./src/toggleStorage.js";
import { getQuotes } from "./src/Storage.js";
import { setQuote } from "./src/Storage.js";
import { getJSON } from "./src/Storage.js";
import { getElement } from "./src/Storage.js";

const API_URL = "https://type.fit/api/quotes";
const storageItemsCount = getElement(".storage-count");

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
    console.log(this._quotes);
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
    this._quotes = [...this._quotes, new newQuote(this._quote)];
    setQuote("quotes", this._quotes);
    this.updateStorageDom();
  }

  updateStorageDom() {
    storageItemsCount.textContent = this._quotes.length;
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
  renderStorageQuotes() {
    const markup = this._quotes.map(this._generateMarkupStoarageQuote).join("");
    this._quoteStorageContainer.insertAdjacentHTML("afterbegin", markup);
  }
  _generateMarkupStoarageQuote(quote) {
    const {
      _id: id,
      _quote: [{ text, author }],
    } = quote;
    console.log(id, text, author);
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
}

const quote = new Quote();

const init = function () {
  quote.renderSpinner();
  quote.updateStorageDom();
  getQuoteData();
  quote.addHandlerButtons(getQuoteData);
  quote.addHandlerSave();
  quote.renderStorageQuotes();
};

document.addEventListener("DOMContentLoaded", init);
