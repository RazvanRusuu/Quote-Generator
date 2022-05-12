import { getElement } from "./Storage.js";

const overlay = getElement(".overlay");
const storageDOM = getElement(".storage-quotes");
const storageBtn = getElement(".storage-btn");
const closeStorageBtn = getElement(".close-storage");

export const openStorage = function () {
  overlay.classList.add("show");
  storageDOM.classList.add("show");
};

export const closeStorage = function () {
  overlay.classList.remove("show");
  storageDOM.classList.remove("show");
};

storageBtn.addEventListener("click", openStorage);
closeStorageBtn.addEventListener("click", closeStorage);
