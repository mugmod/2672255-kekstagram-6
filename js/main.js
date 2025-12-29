import { renderThumbnails } from './thumbnail.js';
import { getData } from './api.js';
import { showDataErrorMessage } from './message.js'; // Заменили импорт showAlert на showDataErrorMessage
import { initFilter } from './filter.js';
import './form.js';

getData()
  .then((photos) => {
  renderThumbnails(photos);
  initFilter(photos);
})
  .catch(() => {
  showDataErrorMessage();
});
