import { renderThumbnails } from './thumbnail.js';
import { debounce } from './util.js';

const PICTURES_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const Filter = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const filterElement = document.querySelector('.img-filters');
const filterForm = filterElement.querySelector('.img-filters__form');

let photos = [];
let currentFilter = Filter.DEFAULT;

// Функции сортировки
const sortByComments = (photoA, photoB) => photoB.comments.length - photoA.comments.length;
const sortRandomly = () => Math.random() - 0.5;

const getFilteredPhotos = () => {
  switch (currentFilter) {
    case Filter.RANDOM:
      return [...photos].sort(sortRandomly).slice(0, PICTURES_COUNT);
    case Filter.DISCUSSED:
      return [...photos].sort(sortByComments);
    default:
      return [...photos];
  }
};

// Создаем дебаунс-версию функции отрисовки
const debouncedRender = debounce(() => {
  renderThumbnails(getFilteredPhotos());
}, DEBOUNCE_DELAY);

const onFilterClick = (evt) => {
  const target = evt.target;

  // Если кликнули не по кнопке или по уже активной кнопке — ничего не делаем
  if (!target.classList.contains('img-filters__button') || target.id === currentFilter) {
    return;
  }

  // МГНОВЕННО: переключаем подсветку кнопок (баг исправлен здесь)
  filterForm.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
  target.classList.add('img-filters__button--active');

  // ЗАПОМИНАЕМ выбранный фильтр и запускаем отложенную отрисовку
  currentFilter = target.id;
  debouncedRender();
};

export const initFilter = (data) => {
  photos = [...data];
  // Показываем блок фильтров, убрав скрывающий класс (п. 1 и п. 2 ТЗ)
  filterElement.classList.remove('img-filters--inactive');
  filterForm.addEventListener('click', onFilterClick);
};
