// Функция для генерации случайного числа в диапазоне
export const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

// Функция для получения случайного элемента из массива
export const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

// Функция для создания массива уникальных идентификаторов
export const generateUniqueIds = (count) => {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(getRandomInteger(1, 1000));
  }
  return Array.from(ids);
};

// util.js
export const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...rest), timeoutDelay);
  };
};

export const isEscapeKey = (evt) => evt.key === 'Escape';
