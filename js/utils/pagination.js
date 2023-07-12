export function renderPagination(elementID, pagination) {
  if (!pagination) return;

  //calcualte the totalPages
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  //save information to ulPagination in case we need to handle another function
  const ulPagination = document.getElementById(elementID);
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = _totalRows;

  //check if enable/disable prevLinks/nextLinks
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (_page <= 1) prevLink.classList.add('disabled');
  else prevLink.classList.remove('disabled');

  const nextLink = ulPagination.lastElementChild?.firstElementChild;
  if (_page >= totalPages) nextLink.classList.add('disabled');
  else nextLink.classList.remove('disabled');
}

export function initPagination({ elementID, defaultParams, onChange }) {
  const postPagination = document.getElementById(elementID);
  if (!postPagination) return;

  //get the a element (ul.firstLi.a), check if it exists
  const prevLink = postPagination.firstElementChild?.firstElementChild;
  //get the a element (ul.lastLi.a), check if it exists
  const nextLink = postPagination.lastElementChild?.firstElementChild;

  prevLink.addEventListener('click', (e) => {
    //prevent default action of the event
    e.preventDefault();

    //parse to integer in case type coersion mode is on
    const page = Number.parseInt(postPagination.dataset.page) || 1;

    //check its existence then check if it's on changing
    if (page > 1) onChange?.(page - 1);
  });

  nextLink.addEventListener('click', (e) => {
    //prevent default action of the event
    e.preventDefault();

    //parse to integer in case type coersion mode is on
    const page = Number.parseInt(postPagination.dataset.page) || 1;
    const totalPages = postPagination.dataset.totalPages;

    //check its existence then check if it's on changing
    if (page < totalPages) onChange?.(page + 1);
  });
}
