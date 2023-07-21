import postApi from './api/postApi';
import { initPostForm, queryElement, toast } from './utils';

async function handleFormSubmit(formValues) {
  try {
    //Call API: add or update post
    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues);

    //show toast success
    toast.success('Successfully submit');
    //redirect to post detail
    setTimeout(() => {
      window.location.href = `/post-detail.html?id=${savedPost.id}`;
    }, 1000);
  } catch (error) {
    console.log('Cannot submit post', error);
    //show toast error
    toast.error(`Error: ${error.message}`);
  }
}

//add-edit-post main
(async () => {
  try {
    //get URL searchParams, check if id exists or not
    //it exists: Edit Mode, else: Add Mode
    const url = new URL(window.location);
    const postID = url.searchParams.get('id');

    //determine the value if postId exists or not
    let defaultValue = postID
      ? await postApi.getByID(postID)
      : {
          title: '',
          author: '',
          description: '',
          imageUrl: '',
        };

    initPostForm({
      formID: 'postForm',
      defaultValue,
      onSubmit: (formValues) => handleFormSubmit(formValues),
    });
  } catch (error) {
    console.log('fetch post failed', error);
  }
})();
