import axiosClient from './api/axiosClient';
import postApi from './api/postApi';

console.log('hello world');

async function main() {
  //   const response = await axiosClient.get('/posts');
  const queryParams = {
    _page: 1,
    _limit: 5,
  };
  const response = await postApi.getAll(queryParams);
  console.log(response);

  const newData = {
    id: 'lea11ziflg8xoixr',
    imageUrl: 'https://picsum.photo/id/43/1368/400',
  };
  postApi.update(newData);

  // postApi.remove('RBZ1z1H');
}

main();
