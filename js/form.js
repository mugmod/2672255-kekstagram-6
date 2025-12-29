import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './message.js';
import { isEscapeKey } from './util.js';

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const MAX_HASHTAGS = 5;
const MAX_DESCRIPTION_LENGTH = 140;

const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Опубликовываю...'
};

const EFFECT_CONFIG = {
  none: { visible: false },
  chrome: { range: { min: 0, max: 1 }, step: 0.1, start: 1, apply: (v) => `grayscale(${v})`, visible: true },
  sepia: { range: { min: 0, max: 1 }, step: 0.1, start: 1, apply: (v) => `sepia(${v})`, visible: true },
  marvin: { range: { min: 0, max: 100 }, step: 1, start: 100, apply: (v) => `invert(${Math.round(v)}%)`, visible: true },
  phobos: { range: { min: 0, max: 3 }, step: 0.1, start: 3, apply: (v) => `blur(${v.toFixed(1)}px)`, visible: true },
  heat: { range: { min: 1, max: 3 }, step: 0.1, start: 3, apply: (v) => `brightness(${v.toFixed(1)})`, visible: true }
};

const form = document.querySelector('#upload-select-image');
const uploadFileInput = document.querySelector('#upload-file');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadCancel = document.querySelector('#upload-cancel');
const body = document.body;

const hashtagsInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');
const submitButton = form.querySelector('#upload-submit');

const scaleSmallerBtn = form.querySelector('.scale__control--smaller');
const scaleBiggerBtn = form.querySelector('.scale__control--bigger');
const scaleValueInput = form.querySelector('.scale__control--value');
const previewImage = form.querySelector('.img-upload__preview img');
const defaultPreviewSrc = previewImage.src;

const effectLevelField = form.querySelector('.img-upload__effect-level');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectSliderNode = document.querySelector('.effect-level__slider');

let pristine = null;
let currentEffect = 'none';
let sliderInstance = null;

const validateHashtags = (value) => {
  if (!value.trim()) {
    return true;
  }
  const hashtags = value.trim().split(/\s+/);
  if (hashtags.length > MAX_HASHTAGS) {
    return false;
  }
  const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;
  for (const hashtag of hashtags) {
    if (!hashtagRegex.test(hashtag)) {
      return false;
    }
  }
  const lower = hashtags.map((h) => h.toLowerCase());
  return new Set(lower).size === lower.length;
};

const validateDescription = (value) => value.length <= MAX_DESCRIPTION_LENGTH;

const initPristine = () => {
  if (typeof window.Pristine !== 'undefined') {
    pristine = new Pristine(form, {
      classTo: 'img-upload__field-wrapper',
      errorTextParent: 'img-upload__field-wrapper',
      errorTextClass: 'img-upload__field-wrapper--error',
      errorTextTag: 'div'
    });

    pristine.addValidator(
      hashtagsInput,
      validateHashtags,
      'Неправильный формат хештегов. Хештеги должны:\n• Начинаться с #\n• Содержать только буквы и цифры\n• Длина от 1 до 19 символов после #\n• Быть уникальными\n• Максимум 5 хештегов'
    );

    pristine.addValidator(
      descriptionInput,
      validateDescription,
      'Максимальная длина комментария - 140 символов'
    );
  }
};

const applyScale = (percent) => {
  const clamped = Math.min(SCALE_MAX, Math.max(SCALE_MIN, percent));
  previewImage.style.transform = `scale(${clamped / 100})`;
  scaleValueInput.value = `${clamped}%`;
};

const onScaleSmallerClick = (e) => {
  e.preventDefault();
  const cur = parseInt(scaleValueInput.value, 10);
  applyScale(cur - SCALE_STEP);
};

const onScaleBiggerClick = (e) => {
  e.preventDefault();
  const cur = parseInt(scaleValueInput.value, 10);
  applyScale(cur + SCALE_STEP);
};

const destroySlider = () => {
  if (sliderInstance) {
    sliderInstance.destroy();
    sliderInstance = null;
  }
};

const setEffect = (name) => {
  currentEffect = name;
  const effectConfig = EFFECT_CONFIG[name];

  if (!effectConfig) {
    return;
  }

  if (effectConfig.visible) {
    effectLevelField.classList.remove('hidden');

    if (typeof window.noUiSlider !== 'undefined') {
      destroySlider();

      sliderInstance = window.noUiSlider.create(effectSliderNode, {
        start: effectConfig.start,
        connect: 'lower',
        range: effectConfig.range,
        step: effectConfig.step
      });

      sliderInstance.on('update', (values, handle) => {
        const v = parseFloat(values[handle]);
        effectLevelValue.value = v;
        if (currentEffect !== 'none' && EFFECT_CONFIG[currentEffect]) {
          previewImage.style.filter = EFFECT_CONFIG[currentEffect].apply(v);
        }
      });

      previewImage.style.filter = effectConfig.apply(effectConfig.start);
    }
  } else {
    effectLevelField.classList.add('hidden');
    previewImage.style.filter = '';
    effectLevelValue.value = '';
    destroySlider();
  }
};

const isErrorMessageOpen = () => Boolean(document.querySelector('.error'));

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt) && !isErrorMessageOpen()) {
    if (evt.target.matches('.text__hashtags, .text__description')) {
      return;
    }
    evt.preventDefault();
    hideEditForm();
  }
};

function hideEditForm() {
  form.reset();
  if (pristine) { pristine.reset(); }
  applyScale(SCALE_DEFAULT);
  setEffect('none');
  previewImage.src = defaultPreviewSrc;
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

function showEditForm() {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  applyScale(SCALE_DEFAULT);
  setEffect('none');
}

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = SubmitButtonText.SENDING;
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = SubmitButtonText.IDLE;
};

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isValid = pristine ? pristine.validate() : true;

  if (isValid) {
    blockSubmitButton();
    sendData(new FormData(evt.target))
      .then(() => {
      hideEditForm();
      showSuccessMessage();
    })
      .catch(() => {
      showErrorMessage();
    })
      .finally(() => {
      unblockSubmitButton();
    });
  }
});

initPristine();

uploadFileInput.addEventListener('change', (evt) => {
  const file = evt.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => { previewImage.src = e.target.result; };
    reader.readAsDataURL(file);
    showEditForm();
  }
});

uploadCancel.addEventListener('click', hideEditForm);
scaleSmallerBtn.addEventListener('click', onScaleSmallerClick);
scaleBiggerBtn.addEventListener('click', onScaleBiggerClick);

form.querySelectorAll('input[name="effect"]').forEach((input) => {
  input.addEventListener('change', (evt) => setEffect(evt.target.value));
});
