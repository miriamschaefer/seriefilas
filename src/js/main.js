'use strict';

//botón que inicia la búsqueda
// const form = document.querySelector('.js-form');
const button = document.querySelector('#js-button');

//contador de favoritos

let counter = document.querySelector('#fav-counter');

//input de texto

const searchInput = document.querySelector('#js-search-input');

//variable de la URL de la API
const ENDPOINT = 'http://api.tvmaze.com/search/shows?q=';

let shows = [];
let favShows = [];
let showObject = {};

//Busco las series en la API
function getShowsFromApi() {
  fetch(ENDPOINT + searchInput.value)
    .then((response) => response.json())
    .then((data) => {
      shows = [];
      for (let item of data) {
        let img = '';
        if (item.show.image) {
          img = item.show.image.medium;
        } else {
          img = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
        }
        showObject = {
          name: item.show.name,
          image: img,
          id: item.show.id,
        };
        shows.push(showObject);
      }
      renderShows(shows, '#shows-search-result');
      addListeners();

      console.log(shows);
    });
}

// las pinto en HTML

function renderShows(arr, selector) {
  let codeHTML = '';

  if (arr.length === 0) {
    console.log('Error');
    codeHTML += `<h2 class="show-title">No hemos encontrado naíta.</h2>`;
  } else {
    for (let item of arr) {
      {
        codeHTML += `<li class="show-container js-show-container" id="${item.id}">`;
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
}

//le añado listeners a las series

function addListeners() {
  const fav = document.querySelectorAll('.js-show-container');

  for (const elem of fav) {
    if (elem !== undefined) {
      elem.addEventListener('click', addToFavs);
    }
  }
}

//función para añadir y eliminar de favoritos

function addToFavs(ev) {
  const clickedShow = ev.currentTarget;
  const clickedShowId = parseInt(clickedShow.id);
  const clickedShowIndex = favShows.findIndex(
    (elem) => elem.id === clickedShowId
  );

  console.log(clickedShowIndex);

  if (clickedShowIndex === -1) {
    const favShow = shows.find((show) => show.id === clickedShowId);
    favShows.push(favShow);
    clickedShow.classList.add('added-to-favs');
  } else {
    favShows.splice(clickedShowIndex, 1);
    clickedShow.classList.remove('added-to-favs');
  }
  renderShows(favShows, '#shows-favs-container');

  counter.innerHTML = `${favShows.length} favs`;
  console.log(favShows);
}

function handleClick(ev) {
  ev.preventDefault();
  getShowsFromApi();
}

// form.addEventListener('submit', getShowsFromApi);
button.addEventListener('click', handleClick);
