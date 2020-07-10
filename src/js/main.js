'use strict';

// pending to activate the enter button to submit
// const form = document.querySelector('.js-form');

//search button
const button = document.querySelector('#js-button');

//fav counter

let counter = document.querySelector('#fav-counter');

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
        //in case the object doesn't have an image, place the placeholder
        let img = '';
        if (item.show.image) {
          img = item.show.image.medium;
        } else {
          img = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
        }

        //show info in an object

        showObject = {
          name: item.show.name,
          image: img,
          id: item.show.id,
        };
        shows.push(showObject);
      }
      renderShows(shows, '#shows-search-result');
      addListeners();
      addListenersToFavs();
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

function renderFavShows(arr, selector) {
  let codeHTML = '';

  if (arr.length === 0) {
    codeHTML += `<h2 class="show-title">No tienes ningún favorito.</h2>`;
  } else {
    for (let item of arr) {
      {
        codeHTML += `<li class="show-container js-show-container added-to-favs" id="${item.id}">`;
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

// add listeners to the items, so they recognize clicks on them.

function addListeners() {
  const fav = document.querySelectorAll('.js-show-container');

  for (const elem of fav) {
    if (elem !== undefined) {
      elem.addEventListener('click', addToFavs);
    }
  }
}

function addListenersToFavs() {
  const favedShow = document.querySelectorAll('#fav-shows-container');

  for (const elem of favedShow) {
    if (elem !== undefined) {
      elem.addEventListener('click', removeFromFavs);
    }
  }
}

// function to add and remove shows from favorites.

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
  counter.innerHTML = `${favShows.length} favs`;
}
// function removeFromFavs(ev) {
//   const clickedFav = ev.currentTarget;
//   const clickedFavId = parseInt(clickedFav.id);
//   console.log(clickedFavId);
//   const clickedFavIndex = favShows.findIndex(
//     (elem) => elem.id === clickedFavId
//   );
//   console.log(clickedFavIndex);
// }
function handleClick(ev) {
  ev.preventDefault();
  getShowsFromApi();
}

// form.addEventListener('submit', getShowsFromApi);
button.addEventListener('click', handleClick);
