import { PREP_TIME } from './js/menu.js';

const form = document.querySelector('.form');
const orderLog = document.querySelector('.order-log');

function makeOrder(delay, shouldResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

function addOrderRow(drink) {
  const row = document.createElement('li');
  row.classList.add('row-pending');
  row.textContent = `⏳ ${drink} · у роботі…`;
  orderLog.append(row);
  return row;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(form);
  const drink = formData.get('drink');
  const state = formData.get('state');
  const delay = PREP_TIME[drink];
  const shouldResolve = state === 'fulfilled';
  const row = addOrderRow(drink);
  makeOrder(delay, shouldResolve)
    .then(value => {
      row.classList.replace('row-pending', 'row-ok');
      row.textContent = `✅ ${drink} · готове · ${value} ms`;
    })
    .catch(value => {
      row.classList.replace('row-pending', 'row-err');
      row.textContent = `❌ ${drink} · скасовано · ${value} ms`;
    })
    .finally(() => {
      row.textContent += ` · ${new Date().toLocaleTimeString('uk-UA')}`;
    });
});
