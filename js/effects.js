const scaleControlValue = document.querySelector('.scale__control--value');
const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const imagePreview = document.querySelector('.img-upload__preview img');
const effectsList = document.querySelector('.effects__list');
const effectLevel = document.querySelector('.effect-level');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelSlider = document.querySelector('.effect-level__slider');

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const EffectStepConfig = {
  MARVIN_MAX: 100,
  PHOBOS_MAX: 3,
  HEAT_MAX: 3
};

let currentScale = SCALE_DEFAULT;
let currentEffect = 'none';

// Функции для масштабирования
const scaleImage = (value) => {
  currentScale = value;
  scaleControlValue.value = `${value}%`;
  imagePreview.style.transform = `scale(${value / 100})`;
};

scaleControlSmaller.addEventListener('click', () => {
  if (currentScale > SCALE_MIN) {
    scaleImage(currentScale - SCALE_STEP);
  }
});

scaleControlBigger.addEventListener('click', () => {
  if (currentScale < SCALE_MAX) {
    scaleImage(currentScale + SCALE_STEP);
  }
});

// Функции для эффектов
const effects = {
  none: () => '',
  chrome: (value) => `grayscale(${value})`,
  sepia: (value) => `sepia(${value})`,
  marvin: (value) => `invert(${value * EffectStepConfig.MARVIN_MAX}%)`,
  phobos: (value) => `blur(${value * EffectStepConfig.PHOBOS_MAX}px)`,
  heat: (value) => `brightness(${value * EffectStepConfig.HEAT_MAX})`
};

const updateEffect = (effect, value) => {
  imagePreview.style.filter = effects[effect](value);
  effectLevelValue.value = value;
};

// Инициализация слайдера (используем noUiSlider)
const initSlider = () => {
  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 1
    },
    start: 1,
    step: 0.1,
    connect: 'lower'
  });

  effectLevelSlider.noUiSlider.on('update', (values) => {
    const value = parseFloat(values[0]);
    updateEffect(currentEffect, value);
  });
};

// Обработчик изменения эффекта
effectsList.addEventListener('change', (evt) => {
  if (evt.target.name === 'effect') {
    currentEffect = evt.target.value;

    if (currentEffect === 'none') {
      effectLevel.classList.add('hidden');
      imagePreview.style.filter = '';
    } else {
      effectLevel.classList.remove('hidden');
      if (!effectLevelSlider.noUiSlider) {
        initSlider();
      }
      effectLevelSlider.noUiSlider.set(1);
    }
  }
});
