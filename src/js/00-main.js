'use strict';

// pending to activate the enter button to submit
// const form = document.querySelector('.js-form');

//search button
const button = document.querySelector('#js-button');

//fav counter

let counter = document.querySelector('#fav-counter');

//items in the mainsearch results container, used to remove the favs from the result section

let searchResultItems = '';

//search text input

const searchInput = document.querySelector('#js-search-input');

//API URL
const ENDPOINT = 'http://api.tvmaze.com/search/shows?q=';

let shows = [];
let favShows = [];
let showObject = {};

//Get shows data from API
function getShowsFromApi() {
  fetch(ENDPOINT + searchInput.value)
    .then((response) => response.json())
    .then((data) => {
      shows = [];
      for (let item of data) {
        //in case the object doesn't have an image, we place the placeholder
        let img = '';
        if (item.show.image) {
          img = item.show.image.medium;
        } else {
          img = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
        }

        //show info in our object

        showObject = {
          name: item.show.name,
          image: img,
          id: item.show.id,
        };
        shows.push(showObject);
      }
      renderShows(shows, '#shows-search-result');
      renderFavShows(favShows, '#fav-shows-container');
      addListeners();
      addListenerToFav();
    });
}

// render info in HTML, to use this function you have to assign its parameters, both the array to paint and the selector -or place- you wanna render it.

function renderShows(arr, selector) {
  let codeHTML = '';

  if (arr.length === 0) {
    codeHTML += `<h2 class="show-title">No hemos encontrado naíta.</h2>`;
  } else {
    for (let item of arr) {
      {
        codeHTML += `<li class="show-container js-main-show-container" id="${item.id}">`;
        codeHTML += `<div class="img-container">`;
        codeHTML += `<img src="${item.image}"/>`;
        codeHTML += `</div>`;
        codeHTML += `<h2 class="show-title">${item.name}</h2>`;
        codeHTML += `</li>`;
      }
    }
  }
  const element = document.querySelector(selector);
  element.innerHTML = codeHTML;

  //this allows us to remove the shows which are inside the fav list

  searchResultItems = element.querySelectorAll('.js-main-show-container');
}

function renderFavShows(arr, selector) {
  let codeHTML = '';

  if (arr.length === 0) {
    codeHTML += `<h2 class="show-title">No tienes ningún favorito.</h2>`;
  } else {
    for (let item of arr) {
      {
        codeHTML += `<li class="show-container js-fav-show-container added-to-favs" id="${item.id}">`;
        codeHTML += `<div class="img-container">`;
        codeHTML += `<img src="${item.image}"/>`;
        codeHTML += `</div>`;
        codeHTML += `<h2 class="show-title">${item.name}</h2>`;
        codeHTML += `<h3 class="show-remove js-remove-fav">X</h3>`;
        codeHTML += `</li>`;
      }
    }
  }
  const element = document.querySelector(selector);
  element.innerHTML = codeHTML;
  addListenerToFav();
}

// add listeners to the items, so they recognize clicks on them.

function addListeners() {
  const fav = document.querySelectorAll('.js-main-show-container');

  for (const elem of fav) {
    if (elem !== undefined) {
      elem.addEventListener('click', addToFavs);
    }
  }
  saveLocalStorage();
}

//this is the remove from favs listener (the x button)

function addListenerToFav() {
  const deleteFav = document.querySelectorAll('.js-fav-show-container');

  for (const elem of deleteFav) {
    if (elem !== undefined) {
      elem.addEventListener('click', removeFromFavs);
    }
  }
}

// function to add and remove shows from favorites from the main section.

function addToFavs(ev) {
  //this anon function - clickedShowIndex - looks for the position in the array of the object we wanna add to favs.
  const clickedShow = ev.currentTarget;
  const clickedShowId = parseInt(clickedShow.id);
  const clickedShowIndex = favShows.findIndex(
    (elem) => elem.id === clickedShowId
  );

  // console.log(clickedShowIndex);

  //and then, it checks if we've already added to favs, if we haven't, it adds it to our favShows array, if we had, it removes it (also removes the background color)

  if (clickedShowIndex === -1) {
    const favShow = shows.find((show) => show.id === clickedShowId);
    favShows.push(favShow);
    clickedShow.classList.add('added-to-favs');
  } else {
    favShows.splice(clickedShowIndex, 1);
    clickedShow.classList.remove('added-to-favs');
  }

  //at the same time, we use our render function again to paint our favs in the container.

  renderFavShows(favShows, '#fav-shows-container');
  saveLocalStorage();
  updateCounter();
}

function removeFromFavs(ev) {
  //this anon function - clickedShowIndex - looks for the position in the array of the object we wanna add to favs.
  const removeThisFav = ev.currentTarget;
  const removeThisFavId = parseInt(removeThisFav.id);
  const favShowIndex = favShows.findIndex(
    (elem) => elem.id === removeThisFavId
  );
  const mainShowIndex = shows.findIndex((elem) => elem.id === removeThisFavId);

  console.log(favShowIndex);
  favShows.splice(favShowIndex, 1);
  if (mainShowIndex >= 0) {
    searchResultItems[mainShowIndex].classList.remove('added-to-favs');
  }
  renderFavShows(favShows, '#fav-shows-container');
  saveLocalStorage();
  updateCounter();
}

// and then, it checks if we've already added to favs, if we haven't, it adds it to our favShows array, if we had, it removes it (also removes the background color)

// local storage

function saveLocalStorage() {
  localStorage.setItem('favs', JSON.stringify(favShows));
}

function painFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem('favs'));

  if (data !== null) {
    favShows = data;
  }
}

function updateCounter() {
  counter.innerHTML = `${favShows.length} favs`;
  saveLocalStorage();
}

// click handler

function handleClick(ev) {
  ev.preventDefault();
  getShowsFromApi();
}

button.addEventListener('click', handleClick);

painFromLocalStorage();

//intentar que esto no cargue desde el html, lo que hace es que inicia desde el principio estas tres cosas
function init() {
  painFromLocalStorage();
  renderFavShows(favShows, '#fav-shows-container');
  addListenerToFav();
  updateCounter();
}

// form.addEventListener('submit', getShowsFromApi);
