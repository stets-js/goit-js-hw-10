import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './modules/fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');
input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(e) {
  const inputRequest = e.target.value.trim();
  if (!inputRequest) {
    refreshMarkup(list);
    refreshMarkup(info);
    return;
  }

  fetchCountries(inputRequest)
    .then(data => {
      if (data.length > 10) {
        Notify.warning(
          '⚠️Too many matches found. Please enter a more specific name⚠️'
        );
        return;
      }
      makeMarkup(data);
    })
    .catch(err => {
      refreshMarkup(list);
      refreshMarkup(info);
      Notify.failure('❌Oops, there is no country with that name❌');
    });
}

function refreshMarkup(el) {
  el.innerHTML = '';
}

function makeMarkup(data) {
  if (data.length === 1) {
    refreshMarkup(list);
    info.innerHTML = infoMarkup(data);
  } else {
    refreshMarkup(info);
    list.innerHTML = listMarkup(data);
    list.classList.add('list');
  }
}

function infoMarkup(data) {
  return data
    .map(
      ({ name, capital, population, flags, languages }) =>
        `<h1><img src="${flags.png}" alt="${
          name.official
        }" width="50" height="40">  ${name.official}</h1>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${Object.values(languages)}</p>`
    )
    .join('');
}

function listMarkup(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li class="item"><img src="${flags.png}" alt="${name.official}" width="50" height="40"><p>${name.official}</p></li>`
    )
    .join('');
}
