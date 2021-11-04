import utils from '../utils.js';

class AudioPlayer { // eslint-disable-line
  constructor(container, title, author, filename, categories, ranking, songsClass){
    const thisAudioPlayer = this;

    thisAudioPlayer.container = container;
    thisAudioPlayer.title = title;
    thisAudioPlayer.author = author;
    thisAudioPlayer.filename = filename;
    thisAudioPlayer.categories = categories;
    thisAudioPlayer.ranking = ranking;
    thisAudioPlayer.songsClass = songsClass;
    thisAudioPlayer.renderInMenu();
  }

  renderInMenu() {
    const thisAudioPlayer = this;

    let categoryList = '';
    const separator = ', ';
    for(let [i, category] of thisAudioPlayer.categories.entries()){
      if(i == 0){
        categoryList += category.charAt(0).toUpperCase() + category.slice(1).toLowerCase() + separator;
      }
      if (i > 0 && i < thisAudioPlayer.categories.length - 1){
        categoryList += category.toLowerCase() + separator;
      }
      if (i == thisAudioPlayer.categories.length - 1){
        categoryList += category.toLowerCase();
      }
    }
    
    thisAudioPlayer.element = utils.createDOMFromHTML(`
      <h5><span class="artist">${thisAudioPlayer.author}</span> - ${thisAudioPlayer.title}</h5>
      <div class="${thisAudioPlayer.songsClass}">
        <audio src="./db/songs/${thisAudioPlayer.filename}" type="audio/mp3"></audio>
      </div>
      <div class="tags">
        <p class="category">Categories: ${categoryList}</p>
        <p class="ranking">#${thisAudioPlayer.ranking} in the ranking</p>
      </div>`
    );

    thisAudioPlayer.container.appendChild(thisAudioPlayer.element);
  }
}

export default AudioPlayer;
