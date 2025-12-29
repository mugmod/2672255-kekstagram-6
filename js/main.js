import { renderThumbnails } from './thumbnail.js';
import { getData } from './api.js';
import { showAlert } from './message.js';
import { initFilter } from './filter.js';
import './form.js';

getData()
  .then((photos) => {
  renderThumbnails(photos);
  initFilter(photos);
})
  .catch((err) => {
  showAlert(err.message);
});
