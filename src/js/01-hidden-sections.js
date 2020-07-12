const click = document.querySelector('.click');
const section = document.querySelector('.colors-container');
const arrowDown = document.querySelector('.moonicondown');
const arrowUp = document.querySelector('.mooniconup');

function displayArrow(ev) {
  ev.preventDefault();
  section.classList.toggle('hidden');
  arrowUp.classList.toggle('hidden');
  arrowDown.classList.toggle('hidden');
}

click.addEventListener('click', displayArrow);

const click2 = document.querySelector('.click2');
const section2 = document.querySelector('.form__section__signup');
const arrowDown2 = document.querySelector('.moonicondown2');
const arrowUp2 = document.querySelector('.mooniconup2');

function displayArrow2(ev) {
  ev.preventDefault();
  section2.classList.toggle('hidden');
  arrowUp2.classList.toggle('hidden');
  arrowDown2.classList.toggle('hidden');
}

click2.addEventListener('click', displayArrow2);

// share
const click3 = document.querySelector('.click3');
const section3 = document.querySelector('.form__share__button');
const arrowDown3 = document.querySelector('.moonicondown3');
const arrowUp3 = document.querySelector('.mooniconup3');

function displayArrow3(ev) {
  ev.preventDefault();
  section3.classList.toggle('hidden');
  arrowUp3.classList.toggle('hidden');
  arrowDown3.classList.toggle('hidden');
}

click3.addEventListener('click', displayArrow3);
