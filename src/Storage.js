export const setQuote = function (key, value) {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getQuotes = function (key) {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
};

export const getSingleQuote = function (id) {
  const quotes = getQuotes("quotes");
  const quote = quotes.find((item) => item._id === id);

  return quote;
};

export const getJSON = async function (url) {
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Something went wrong: ${response.status}`);
    const data = await response.json();

    return data;
  } catch (err) {
    throw err;
  }
};

export const getElement = function (element) {
  return document.querySelector(element);
};
