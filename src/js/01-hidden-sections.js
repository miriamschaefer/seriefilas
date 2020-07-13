'use strict';

const click = document.querySelector('.click');
const section = document.querySelector('.js-hide-favs');
const arrowDown = document.querySelector('.js-arrow-down');
const arrowUp = document.querySelector('.js-arrow-up');

function displayArrow(ev) {
  ev.preventDefault();
  section.classList.toggle('hidden');
  arrowUp.classList.toggle('hidden');
  arrowDown.classList.toggle('hidden');
}

click.addEventListener('click', displayArrow);
