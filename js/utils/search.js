import debounce from 'lodash.debounce';

export function initSearch({ elementID, defaultParams, onChange }) {
  const searchElement = document.getElementById(elementID);
  if (!searchElement) return;

  //save the search value in case reloaded
  if (defaultParams && defaultParams.get('title_like')) {
    searchElement.value = defaultParams.get('title_like');
  }

  // add event for search input, we use debounce to avoid too many requests at the same time
  searchElement.addEventListener(
    'input',
    debounce((event) => {
      onChange?.(event.target.value);
    }, 500)
  );
}
