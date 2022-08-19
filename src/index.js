import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
input.addEventListener('input', onInputSearch);

function onInputSearch(e) {
  console.log('');
}

console.log(fetchCountries('ukr'));
