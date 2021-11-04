import { select, classNames, elementId, db } from './settings.js'; 
import AudioPlayer from './components/AudioPlayer.js';

const app = {
  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    thisApp.subscribe = document.querySelector(select.containerOf.subscribePage);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = idFromHash;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;

        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);

        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId) {
    const thisApp = this;

    for(let page of thisApp.pages) {
      page.classList.toggle(classNames.active, page.id == pageId);
    }

    for(let link of thisApp.navLinks){
      let linkId = link.getAttribute('href').replace('#', '');
      link.classList.toggle(classNames.active, linkId == pageId);
    } 

    thisApp.subscribe.classList.toggle(classNames.active, pageId == elementId.home);
  },

  initData: function(){
    const thisApp = this;
    const url = db.url + db.songs;

    fetch(url)
      .then(rawResponse => rawResponse.json())
      .then(parsedResponse => {
        thisApp.data = parsedResponse;
        thisApp.initAuthors();
      });
  },

  initAuthors: function(){
    const thisApp = this;
    const url = db.url + db.authors;

    fetch(url)
      .then(rawResponse => rawResponse.json())
      .then(parsedResponse => {
        thisApp.authorsData = parsedResponse;
        thisApp.generateDOMElement(select.containerOf.homePage, thisApp.data, classNames.regularPageSongs);
        thisApp.generateDiscoverPage();

        GreenAudioPlayer.init({ // eslint-disable-line no-undef
          selector: '.songs', 
          stopOthersOnPlay: true
        });
      });
  },

  findAuthor: function(authorId) {
    const thisApp = this;

    for(const author of thisApp.authorsData){
      if(author.id == authorId) {
        return author.name;
      }
    }
  },

  initSearch: function(){
    const thisApp = this;
    const searchButton = document.getElementById(elementId.searchButton);

    searchButton.addEventListener('click', function(event){
      event.preventDefault();

      const searchPageContainer = document.querySelector(select.containerOf.searchPage);
      const searchPhrase = document.getElementById(elementId.searchPhrase).value.toLowerCase();
      const matchingSongs = [];

      searchPageContainer.innerHTML = '';
      
      for(const item of thisApp.data){
        if(item.title.toLowerCase().includes(searchPhrase) && searchPhrase != ''){
          matchingSongs.push(item);
        }
      }
      thisApp.generateDOMElement(select.containerOf.searchPage, matchingSongs, classNames.searchPageSongs);

      GreenAudioPlayer.init({ // eslint-disable-line no-undef
        selector: '.search-songs', 
        stopOthersOnPlay: true
      });

      const songsCounter = document.getElementById(elementId.songsAmount);
      const foundSongs = document.querySelector(select.containerOf.foundSongs);
      songsCounter.innerHTML = matchingSongs.length;
      foundSongs.classList.add(classNames.active);
    });

  },

  generateDOMElement: function(container, data, songsClass) {
    const thisApp = this;
    const elementContainer = document.querySelector(container);

    for(const item of data){
      new AudioPlayer(elementContainer, item.title, thisApp.findAuthor(item.author), item.filename, item.categories, item.ranking, songsClass);
    }
  },

  generateDiscoverPage: function(){
    const thisApp = this;
    const discoverContainer = document.querySelector(select.containerOf.discoverPage);

    const randomSongId = Math.floor(Math.random() * thisApp.data.length + 1);
    const {
      title, author, filename, categories, ranking
    } = thisApp.data[randomSongId];

    new AudioPlayer(discoverContainer, 
      title, 
      thisApp.findAuthor(author), 
      filename, 
      categories, 
      ranking,
      classNames.regularPageSongs);
  },

  init: function(){
    const thisApp = this;

    thisApp.initData();
    thisApp.initPages();
    thisApp.initSearch();
  }
};

app.init();