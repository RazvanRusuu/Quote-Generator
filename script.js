"use strict";
const API_URL = "https://type.fit/api/quotes";

const getElement = function (element) {
  return document.querySelector(element);
};

const newQuoteBtn = getElement("#new-quote");
const quoteContainer = getElement("#quote-container");
const twitterBtn = getElement("#twitter");
const loader = getElement(".loader");

const showLoadingSpinner = function () {
  loader.hidden = false;
  quoteContainer.hidden = true;
};
const hideLoadingSpinnder = function () {
  loader.hidden = true;
  quoteContainer.hidden = false;
};

const getJSON = async function (url) {
  try {
    showLoadingSpinner();
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Something went wrong: ${response.status}`);
    const data = await response.json();

    return data;
  } catch (err) {
    throw err;
  }
};

const getQuote = async function () {
  try {
    const quotes = await getJSON(API_URL);
    const randomQuote = Math.round(Math.random() * quotes.length);
    hideLoadingSpinnder();
    quote.renderQuote(quotes[randomQuote]);
  } catch (err) {
    console.log(err);
  }
};

class Quote {
  _quoteDOM = getElement(".quote");
  _authorDOM = getElement(".author");
  _quote = {};

  renderQuote(quote) {
    this._quote = quote;
    if (!quote.author) {
      this._authorDOM.innerText = "Unknown";
    } else {
      this._authorDOM.innerText = quote.author;
    }
    this._quoteDOM.innerText = quote.text;
  }

  tweetQuote() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${this._quote.text} - ${this._quote.author}`;
    window.open(twitterUrl, "_blank");
  }
}

const quote = new Quote();
const init = function () {
  getQuote();
  newQuoteBtn.addEventListener("click", getQuote);
  twitterBtn.addEventListener("click", quote.tweetQuote.bind(quote));
};
showLoadingSpinner();
document.addEventListener("DOMContentLoaded", init);
