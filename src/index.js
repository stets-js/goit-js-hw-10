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
  }

  fetchCountries(inputRequest)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.warning(
          '⚠️Too many matches found. Please enter a more specific name⚠️'
        );
      } else {
        makeMarkup(data);
      }
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
  }
  refreshMarkup(info);
  list.innerHTML = listMarkup(data);
}

function infoMarkup(data) {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.svg}" alt="${
        name.official
      }" width="40" height="40">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
}

function listMarkup(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.svg}" alt="${name.official}" width="60" height="40">${name.official}</li>`
    )
    .join('');
}
