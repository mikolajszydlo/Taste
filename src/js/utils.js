import { classNames } from './settings.js'; 

const utils = {}; // eslint-disable-line no-unused-vars

utils.createDOMFromHTML = function(htmlString) {
  let div = document.createElement('div');
  div.classList.add(classNames.playerBlock);
  div.innerHTML = htmlString;
  return div;
};

export default utils;