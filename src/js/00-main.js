'use strict';
// pending to activate the enter button to submit
const form = document.querySelector('.js-form');
//search button
const searchButton = document.querySelector('#js-button');
//fav counter
let counter = document.querySelector('#fav-counter');
//fav section
// const favArea = document.querySelector('.js-favs-section');
//reset button
const resetButton = document.querySelector('.js-reset');
//search text input
const searchInput = document.querySelector('#js-search-input');
//API URL
const ENDPOINT = 'http://api.tvmaze.com/search/shows?q=';
//empty arrays and object
let shows = [];
let favShows = [];
let showObject = {};
//items in the mainsearch results container, used to remove the favs from the result section
let searchResultItems = '';
//Get shows data from API
function getShowsFromApi() {
  fetch(ENDPOINT + `${searchInput.value}`)
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
        //gets all the show info and keeps it in an object
        showObject = {
          name: item.show.name,
          image: img,
          id: item.show.id,
          fav: false,
        };
        shows.push(showObject);
      }
      renderShows(shows, '#shows-search-result', showObject);
      renderFavShows(favShows, '#fav-shows-container');
      addListeners();
      addListenerToFav();
      // paintFavInSearchResults();
    });
}
//render info in HTML, to use this function you have to assign its parameters, both the array to paint and the selector -or place- you wanna render it.
function renderFavShows(arr, selector) {
  let codeHTML = '';
  if (arr.length === 0) {
    codeHTML += `<h2 class="show-title">No tienes ningún favorito.</h2>`;
  } else {
    for (let item of arr) {
      {
        codeHTML += `<li class="show-container js-fav-show-container added-to-favs" id="${item.id}">`;
        codeHTML += `<div class="img-container">`;
        codeHTML += `<img class="show-image" src="${item.image}"/>`;
        codeHTML += `</div>`;
        codeHTML += `<h2 class="show-title">${item.name}</h2>`;
        codeHTML += `<h3 class="show-remove js-remove-fav"><i class="fa fa-trash" aria-hidden="true"></i></h3>`;
        codeHTML += `</li>`;
      }
    }
  }
  const element = document.querySelector(selector);
  element.innerHTML = codeHTML;
  addListenerToFav();
}
function renderShows(arr, selector) {
  let codeHTML = '';
  if (arr.length === 0) {
    codeHTML += `<h2 class="show-title">No hemos encontrado naíta.</h2>`;
  } else if (showObject.fav === false) {
    for (let item of arr) {
      {
        codeHTML += `<li class="show-container js-main-show-container" id="${item.id}">`;
        codeHTML += `<div class="img-container">`;
        codeHTML += `<img class="show-image" src="${item.image}"/>`;
        codeHTML += `</div>`;
        codeHTML += `<h2 class="show-title">${item.name}</h2>`;
        codeHTML += `</li>`;
      }
    }
  } else {
    for (let item of arr) {
      {
        codeHTML += `<li class="show-container js-main-show-container added-to-favs" id="${item.id}">`;
        codeHTML += `<div class="img-container">`;
        codeHTML += `<img class="show-image" src="${item.image}"/>`;
        codeHTML += `</div>`;
        codeHTML += `<h2 class="show-title">${item.name}</h2>`;
        codeHTML += `</li>`;
      }
    }
    addToFavs();
  }
  const element = document.querySelector(selector);
  element.innerHTML = codeHTML;
  paintFavsInSearchResults();
  //this allows us to remove the shows which are inside the fav list
  searchResultItems = element.querySelectorAll('.js-main-show-container');
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
//this is the remove from favs listener
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
  //and then, it checks if we've already added to favs, if we haven't, it adds it to our favShows array, if we had, it removes it (also removes the background color).
  if (clickedShowIndex === -1) {
    const favShow = shows.find((show) => show.id === clickedShowId);
    favShows.push(favShow);
    clickedShow.fav = true;
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
  //this anon function - favShowIndex - looks for the position in the array of the object we wanna add remove from favs.
  const removeThisFav = ev.currentTarget;
  const removeThisFavId = parseInt(removeThisFav.id);
  //then, with these two functions we look for the id we clicked in faves so we can remove it from the search result area.
  const favShowIndex = favShows.findIndex(
    (elem) => elem.id === removeThisFavId
  );
  const mainShowIndex = shows.findIndex((elem) => elem.id === removeThisFavId);
  // we remove it from the favShow array, and then, we look for its index in the result section.
  favShows.splice(favShowIndex, 1);
  if (mainShowIndex >= 0) {
    searchResultItems[mainShowIndex].classList.remove('added-to-favs');
  }
  renderFavShows(favShows, '#fav-shows-container');
  saveLocalStorage();
  updateCounter();
}
// check if a show is in the favs array, so when we render the shows, we can add the favs class to the html element.
// con esto estoy intentando que si el array de favoritos contiene un id igual al que se pinta, me añada también la clase de favoritos y se pinta
function paintFavsInSearchResults() {
  // we remove it from the favShow array, and then, we look for its index in the result section.
  if (searchResultItems.fav === true) {
    searchResultItems.classList.add('added-to-favs');
  }
  saveLocalStorage();
}
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
//counter update
function updateCounter() {
  counter.innerHTML = `${favShows.length} favs`;
  saveLocalStorage();
}
// click handler
function handleClick(ev) {
  ev.preventDefault();
  getShowsFromApi();
}
function handleSubmit(ev) {
  ev.preventDefault();
  getShowsFromApi();
}
//function that reloads the Local Storage
function reloadData() {
  painFromLocalStorage();
  renderFavShows(favShows, '#fav-shows-container');
  addListenerToFav();
  updateCounter();
}
// function that erases the local storage (hence the favs list too).
function resetFavs() {
  localStorage.removeItem('favs');
  location.reload();
}
painFromLocalStorage();
// events
resetButton.addEventListener('click', resetFavs);
//search action (click & enter)
searchButton.addEventListener('click', handleClick);
form.addEventListener('submit', handleSubmit);
//prints the data saved in localstorage
document.addEventListener('DOMContentLoaded', reloadData);
