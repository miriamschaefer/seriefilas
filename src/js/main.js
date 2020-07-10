'use strict';

//botón que inicia la búsqueda
// const form = document.querySelector('.js-form');
const button = document.querySelector('#js-button');

//input de texto

const searchInput = document.querySelector('#js-search-input');

//variable de la URL de la API
const ENDPOINT = 'http://api.tvmaze.com/search/shows?q=';

let shows = [];
let showObject = {};

//Busco las series en la API
function getShowsFromApi() {
  fetch(ENDPOINT + searchInput.value)
    .then((response) => response.json())
    .then((data) => {
      shows = [];
      for (let item of data) {
        showObject = {
          name: item.show.name,
          image: item.show.image.medium,
          id: item.show.id,
        };
        shows.push(showObject);
        renderShows(shows, '#shows-search-result');
      }
    });

  console.log(shows);
}

// las pinto en HTML

function renderShows(arr, selector) {
  let codeHTML = '';

  if (arr.length === null) {
    console.log('Error');
    codeHTML += `<h2 class="show-title">No hemos encontrado naíta.</h2>`;
  } else {
    for (let item of arr) {
      {
        codeHTML += `<li class="show-container" id="${item.id}">`;
        codeHTML += `<div class="img-container">`;
        codeHTML += `<img src="${item.image}"/>`;
        codeHTML += `</div>`;
        codeHTML += `<h2 class="show-title">${item.name}</h2>`;
        codeHTML += `</li>`;
      }
    }

    const element = document.querySelector(selector);
    element.innerHTML = codeHTML;
  }
}

function handleClick(ev) {
  ev.preventDefault();
  getShowsFromApi();
}

// form.addEventListener('submit', getShowsFromApi);
button.addEventListener('click', handleClick);
