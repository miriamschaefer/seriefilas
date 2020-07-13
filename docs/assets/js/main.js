"use strict";const form=document.querySelector(".js-form"),searchButton=document.querySelector("#js-button");let counter=document.querySelector("#fav-counter");const resetButton=document.querySelector(".js-reset"),searchInput=document.querySelector("#js-search-input"),ENDPOINT="http://api.tvmaze.com/search/shows?q=";let shows=[],favShows=[],showObject={},searchResultItems="";function getShowsFromApi(){fetch(ENDPOINT+""+searchInput.value).then(e=>e.json()).then(e=>{shows=[];for(let o of e){let e="";e=o.show.image?o.show.image.medium:"https://via.placeholder.com/210x295/ffffff/666666/?text=TV",showObject={name:o.show.name,image:e,id:o.show.id,fav:!1},shows.push(showObject)}renderShows(shows,"#shows-search-result"),renderFavShows(favShows,"#fav-shows-container"),addListeners(),addListenerToFav()})}function renderFavShows(e,o){let t="";if(0===e.length)t+='<h2 class="show-title main__favs__title">No tienes ningún favorito.</h2>',resetButton.classList.add("hidden");else for(let o of e)t+=`<li class="show-container js-fav-show-container added-to-favs" id="${o.id}">`,t+='<div class="img-container">',t+=`<img class="show-image" src="${o.image}"/>`,t+="</div>",t+=`<h2 class="show-title">${o.name}</h2>`,t+='<h3 class="show-remove js-remove-fav"><i class="fa fa-trash" aria-hidden="true"></i></h3>',t+="</li>",resetButton.classList.remove("hidden");document.querySelector(o).innerHTML=t,addListenerToFav()}function renderShows(e,o){let t="";if(0===e.length)t+='<h2 class="show-title">No hemos encontrado naíta.</h2>';else for(let o of e)t+=`<li class="show-container js-main-show-container" id="${o.id}">`,t+='<div class="img-container">',t+=`<img class="show-image" title="${o.name}" src="${o.image}"/>`,t+="</div>",t+=`<h2 class="show-title">${o.name}</h2>`,t+=`<a href=${o.url} target="_blank" title="Check ${o.name} info" class="show-text">Check info</a>`,t+="</li>";document.querySelector(o).innerHTML=t,addListeners(),checkFavorites(),addListenerToFav()}function checkFavorites(){let e=document.querySelectorAll(".js-main-show-container");for(let o of e){favShows.findIndex(e=>parseInt(o.id)===e.id)>=0&&o.classList.add("added-to-favs")}}function addListeners(){const e=document.querySelectorAll(".js-main-show-container");for(const o of e)void 0!==o&&o.addEventListener("click",addToFavs);saveLocalStorage()}function addListenerToFav(){const e=document.querySelectorAll(".js-fav-show-container");for(const o of e)void 0!==o&&o.addEventListener("click",removeFromFavs)}function addToFavs(e){const o=e.currentTarget,t=parseInt(o.id),s=favShows.findIndex(e=>e.id===t);if(-1===s){const e=shows.find(e=>e.id===t);e.fav=!0,favShows.push(e),o.classList.add("added-to-favs")}else favShows.splice(s,1),o.classList.remove("added-to-favs");renderFavShows(favShows,"#fav-shows-container"),saveLocalStorage(),updateCounter()}function removeFromFavs(e){const o=e.currentTarget,t=parseInt(o.id),s=favShows.findIndex(e=>e.id===t),a=shows.findIndex(e=>e.id===t);favShows.splice(s,1),a>=0&&searchResultItems[a].classList.remove("added-to-favs"),renderFavShows(favShows,"#fav-shows-container"),saveLocalStorage(),updateCounter()}function saveLocalStorage(){localStorage.setItem("favs",JSON.stringify(favShows))}function painFromLocalStorage(){const e=JSON.parse(localStorage.getItem("favs"));null!==e&&(favShows=e)}function updateCounter(){counter.innerHTML=favShows.length+" favs",saveLocalStorage()}function handleClick(e){e.preventDefault(),getShowsFromApi()}function handleSubmit(e){e.preventDefault(),getShowsFromApi()}function reloadData(){painFromLocalStorage(),renderFavShows(favShows,"#fav-shows-container"),addListenerToFav(),updateCounter()}function resetFavs(){localStorage.removeItem("favs"),location.reload()}painFromLocalStorage(),resetButton.addEventListener("click",resetFavs),searchButton.addEventListener("click",handleClick),form.addEventListener("submit",handleSubmit),document.addEventListener("DOMContentLoaded",reloadData);const click=document.querySelector(".click"),section=document.querySelector(".js-hide-favs"),arrowDown=document.querySelector(".js-arrow-down"),arrowUp=document.querySelector(".js-arrow-up");function displayArrow(e){e.preventDefault(),section.classList.toggle("hidden"),arrowUp.classList.toggle("hidden"),arrowDown.classList.toggle("hidden")}click.addEventListener("click",displayArrow);