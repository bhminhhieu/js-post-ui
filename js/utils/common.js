import { queryElement } from './selector';

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength - 1)}…`;
}

export function setFieldValue(element, queryStr, givenValue) {
  const field = queryElement(element, queryStr);

  field.value = givenValue;
}

export function setImgValue(element, queryStr, givenValue) {
  const field = queryElement(element, queryStr);

  if (!givenValue) return;
  field.style.backgroundImage = `url(${givenValue})`;
}

export function randomNumber(n) {
  if (n <= 0) return;
  return Math.round(Math.random() * n);
}
