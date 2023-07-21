import { randomNumber, setFieldValue, setImgValue } from './common';
import { queryElement } from './selector';
import * as yup from 'yup';
import { toast } from './toast';

function setFormValue(form, defaultValue) {
  setFieldValue(form, '[name="title"]', defaultValue?.title);
  setFieldValue(form, '[name="author"]', defaultValue?.author);
  setFieldValue(form, '[name="description"]', defaultValue?.description);

  //set this imageURl to input in case we need to get info
  // it's easier than getting from style.backgroundImage
  setFieldValue(form, '[name="imageUrl"]', defaultValue?.imageUrl);
  setImgValue(document, 'postHeroImage', defaultValue?.imageUrl);
}

function getFormValue(form) {
  const formValues = {};
  //Solution 1:query each input and add to formValues object
  // ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = queryElement(form, `[name="${name}"]`);
  //   if (field) formValues[name] = field.value;
  // });

  //Solution 2: using formData(Note: disable,uncheck elemnt might miss data )
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

function getPostSchema() {
  return yup.object({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least two words of 3 characters',
        //if true nothing happens, otherwise throw an error message
        (value) => value.split(' ').filter((x) => x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageUrl: yup
      .string()
      .required('Please random a background image')
      .url('Please enter a valid URL'),
  });
}

function setTextError(form, path, error) {
  //query to invalid-feedback base on the key(property) of the errorList object
  const field = queryElement(form, `[name="${path}"]`);
  const feedbackText = field.parentElement.lastElementChild;

  //set the custom error message to the element
  //if the element got error message => the element is invalid(false)
  //else the message is blank => the element is valid(true)
  field.setCustomValidity(error);
  //set text error
  feedbackText.textContent = error;
}

async function validation(form, formValues) {
  try {
    //reset text error
    ['title', 'author', 'imageUrl'].forEach((name) => setTextError(form, name, ''));

    //start validation
    const postSchema = getPostSchema();
    await postSchema.validate(formValues, {
      abortEarly: false,
    });
  } catch (error) {
    const errorLog = {};

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const e of error.inner) {
        //ignore if the field is already logged
        if (errorLog[e.path]) continue;
        console.log(e.path);
        console.log(e.message);
        //set field error and mark as logged
        setTextError(form, e.path, e.message);
        errorLog[e.path] = true;
      }
    }
  }

  //add class was-validated to form
  // the element is considered to be invalid => the specified error is displayed
  //check if its valid or not
  const isValid = form.checkValidity();
  //if its invalid => add was-validated to show error message below the input text
  if (!isValid) form.classList.add('was-validated');

  return isValid;
}

function loadImgPicsum(form, btnID) {
  const changeImgBtn = document.getElementById(btnID);
  changeImgBtn.addEventListener('click', () => {
    const imgHidden = queryElement(form, '[name="imageUrl"]');
    imgHidden.value = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`;

    const postHeroImage = queryElement(document, 'postHeroImage');
    postHeroImage.style.backgroundImage = `url("${imgHidden.value}")`;
  });
}

export function initPostForm({ formID, defaultValue, onSubmit }) {
  const form = queryElement(document, formID);
  const changeImgBtn = document.getElementById('postChangeImage');
  const imgPicsum = document.getElementById('imageSourcePicsum');
  const imgLocal = document.getElementById('imageSourceLocal');
  const formGroup = changeImgBtn.parentElement;
  const parentFormGroup = formGroup.parentElement;

  imgPicsum.addEventListener('click', () => {
    //Show option base on the radio checked or not
    formGroup.classList.remove('d-none');
    parentFormGroup.lastElementChild.classList.add('d-none');
    //process inside function
    loadImgPicsum(form, 'postChangeImage');
  });

  imgLocal.addEventListener('click', () => {
    //Show option base on the radio checked or not
    formGroup.classList.add('d-none');
    parentFormGroup.lastElementChild.classList.remove('d-none');
    //process inside function
  });

  setFormValue(form, defaultValue);
  let submitting = false;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const saveBtn = queryElement(form, '[name="saveBtn"]');
    //if submitting is true, it means that another event is submitting
    //=> do nothing until that is done
    if (submitting) return;

    //mark submitting
    saveBtn.textContent = 'Saving';
    submitting = true;
    //get form values
    const formValues = getFormValue(form);
    formValues.id = defaultValue.id;

    // vaidation
    // if valid trigger submit callback
    // otherwise, show validation errors
    // if no await, validation func is a promise=> will return true, even inside this func returns false
    const isValid = await validation(form, formValues);

    //wait until onSubmit is done
    if (isValid) {
      await onSubmit?.(formValues);
    } else {
      toast.error('Submit error');
    }

    //then unmark submitting
    saveBtn.textContent = 'Save';
    submitting = false;
  });
}
