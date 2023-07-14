import dayjs from 'dayjs';
import postApi from './api/postApi';
import { queryElement, registerLightBox } from './utils';

function renderPostDetail(data) {
  if (!data) return;

  //render hero image(imageUrl)
  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url(${data.imageUrl})`;

    // set default image in case it loads fail
    heroImage.addEventListener('error', () => {
      heroImage.src = 'https://fakeimg.pl/1378x400?text=thumbnail';
    });
  }

  //render title
  // const postTitle = document.getElementById('postDetailTitle');
  const postTitle = queryElement(document, '#postDetailTitle');
  postTitle.textContent = data.title;

  //render author
  const authorText = queryElement(document, '#postDetailAuthor');
  authorText.textContent = data.author;

  //render updated at
  const timeSpan = queryElement(document, '#postDetailTimeSpan');
  timeSpan.textContent = dayjs(data.updatedAt).format('DD/MM/YYYY HH:mm');

  //render description
  const postDescription = queryElement(document, '#postDetailDescription');
  postDescription.textContent = data.description;

  //render edit page link
  const editPage = queryElement(document, '#goToEditPageLink');
  editPage.addEventListener('click', () => {
    window.location.href = `/add-edit-post.html?id=${data.id}`;
  });
}
//Post-detail main
(async () => {
  try {
    registerLightBox({
      modalID: '#lightBox',
      imgSelector: 'img[data-id="lightBoxImg"]',
      prevSelector: 'button[data-id="lightBoxPrev"]',
      nextSelector: 'button[data-id="lightBoxNext"]',
    });

    const url = new URL(window.location);
    const postID = url.searchParams.get('id');
    if (!postID) {
      console.log('Post not found');
      return;
    }
    const data = await postApi.getByID(postID);

    renderPostDetail(data);
  } catch (error) {
    console.log('fetch data failed', error);
  }
})();
