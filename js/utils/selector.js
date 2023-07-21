export function queryElement(element, queryStr) {
  //create an need-to-create element
  let ntcElement;
  if (element === document) {
    ntcElement = document.getElementById(queryStr);
  } else {
    ntcElement = element.querySelector(queryStr);
  }
  if (!ntcElement) {
    console.log("Oops! Something's wrong:", queryStr, 'cannot be made');
    return;
  }

  return ntcElement;
}
