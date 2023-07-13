import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { truncateText } from './common';
import { queryElement } from './selector';

//Require this to use fromNow() function
dayjs.extend(relativeTime);

function createLiElement(post) {
  if (!post) return;

  try {
    //Clone liElement Node
    const postTemplate = document.getElementById('postItemTemplate');
    if (!postTemplate) return;
    const liElement = postTemplate.content.firstElementChild.cloneNode(true);
    if (!liElement) return;

    //Update title,description,author,thumbnail and timespan for liElement
    const titleElement = queryElement(liElement, '[data-id="title"]');
    titleElement.textContent = truncateText(post.title, 100);
    const descriptionElement = queryElement(liElement, '[data-id="description"]');
    descriptionElement.textContent = truncateText(post.description, 100);
    const authorElement = queryElement(liElement, '[data-id="author"]');
    authorElement.textContent = truncateText(post.author, 100);

    const thumbnailElement = queryElement(liElement, '[data-id="thumbnail"]');
    thumbnailElement.src = post.imageUrl;

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://fakeimg.pl/1378x400?text=thumbnail';
    });

    //Use trycatch in case there's no post.updatedAt
    try {
      const timeSpanElement = queryElement(liElement, '[data-id="timeSpan"]');
      timeSpanElement.textContent = dayjs(post.updatedAt).fromNow();
    } catch (error) {
      console.log('Failed to get time', error);
    }

    //go to post detail page
    liElement.firstElementChild?.addEventListener('click', () => {
      //both the same
      // window.location.assign(`/post-detail.html?id=${post.id}`);
      window.location.href = `/post-detail.html?id=${post.id}`;
    });

    return liElement;
  } catch (error) {
    console.log('Fail to create li element', error);
  }
}

export function renderPostList(elementID, postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementID);
  if (!ulElement) return;

  //clear the text before re-render new postList
  ulElement.textContent = '';

  for (const post of postList) {
    const liElement = createLiElement(post);
    ulElement.appendChild(liElement);
  }
}
