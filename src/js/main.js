'use strict';

//botón que inicia la búsqueda
const button = document.querySelector('#js-button');

//input de texto

const searchInput = document.querySelector('#js-search-input');

//variable de la URL de la API
const ENDPOINT = 'http://api.tvmaze.com/search/shows?q=';

let shows = [];

//Busco las series en la API
function getShowsFromApi() {
  fetch(ENDPOINT + searchInput.value)
    .then((response) => response.json())
    .then((data) => {
      for (let item of data) {
        shows = [item.show.name, item.show.image.medium, item.show.id];
        // renderShows(shows, '#shows-search-result');
        console.log(shows);
      }
    });
}

//las pinto en HTML

// function renderShows(arr, selector) {
//   let codeHTML = '';
//   for (const elem of arr) {
//     codeHTML += `<li class="recipe-container" id="${elem.id}">`;
//     codeHTML += `<div class="img-container">`;
//     codeHTML += `<img src="${elem.image.medium}"/>`;
//     codeHTML += `</div>`;
//     codeHTML += `<h2 class="recipe-title">${elem.name}</h2>`;
//     codeHTML += `</li>`;
//   }
//   const element = document.querySelector(selector);
//   element.innerHTML = codeHTML;
// }

button.addEventListener('click', getShowsFromApi);
