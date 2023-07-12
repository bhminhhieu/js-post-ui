import postApi from './api/postApi';
import { initPagination, initSearch, renderPagination, renderPostList } from './utils';

async function handleFilterChange(filterName, filterValue) {
  try {
    //update searchParams
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);

    //reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1);

    history.pushState({}, '', url);

    //fetch API
    const queryParams = new URLSearchParams(window.location.search);
    const { data, pagination } = await postApi.getAll(queryParams);

    //re-render postList and pagination
    renderPostList('postsList', data);
    renderPagination('postsPagination', pagination);
  } catch (error) {
    console.log('Failed to fetch post list', error);
  }
}

(async () => {
  try {
    //Set default searchParams for URL for the first time access
    //get the current URL
    const url = new URL(window.location);
    //Init searchParams for URl(if no param _page or _limit, set the init value)
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12);
    //Push state to the history
    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    //attach event for prev/next
    initPagination({
      elementID: 'postsPagination',
      params: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });
    //set default and add event for search input
    initSearch({
      elementID: 'searchInput',
      params: queryParams,
      onChange: (searchInput) => handleFilterChange('title_like', searchInput),
    });

    //render postlist based on queryParams
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList('postsList', data);

    //validate the totalPages that we have
    renderPagination('postsPagination', pagination);
  } catch (error) {
    console.log('Failed to load', error);
  }
})();
