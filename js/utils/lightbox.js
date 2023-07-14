import { queryElement } from './selector';

function showImgModal(modalElement) {
  //make sure bootstrap script exists
  if (!window.bootstrap) return;

  const imgModal = new window.bootstrap.Modal(modalElement);
  if (imgModal) imgModal.show();
}

export function registerLightBox({ modalID, imgSelector, prevSelector, nextSelector }) {
  const modalElement = queryElement(document, modalID);
  const lightBoxImg = queryElement(modalElement, imgSelector);
  const prevButton = queryElement(modalElement, prevSelector);
  const nextButton = queryElement(modalElement, nextSelector);

  let imgList = [];
  let currentIndex = 0;

  //check if this modal is registered or not
  //the first time works well, what if the 2nd,3rd,.. time? if this proterty still exists, will it return and do nothing?
  if (modalElement.dataset.registered) return;

  function setImg(currentIndex) {
    lightBoxImg.src = imgList[currentIndex].src;
  }
  //handle click for all imgs
  document.addEventListener('click', (e) => {
    //img click ->find all the imgs in the same album/galerry
    const { target } = e;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;
    imgList = document.querySelectorAll(`[data-album="${target.dataset.album}"]`);
    //determine index of selected img
    currentIndex = [...imgList].findIndex((x) => x === target);

    //show modal with selected img
    //set the selected img to lightBoxImg
    setImg(currentIndex);
    console.log(currentIndex);
    //show img on modal
    showImgModal(modalElement);
  });
  //handle prev/next click
  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    setImg(currentIndex);
  });
  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length;
    setImg(currentIndex);
  });

  //mark this modalis already registered
  modalElement.dataset.registered = 'true';
}
