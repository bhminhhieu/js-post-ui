export function queryElement(element, queryStr) {
  //create an need-to-create element
  const NTCElement = element.querySelector(queryStr);
  if (!NTCElement) {
    console.log("Oops! Something's wrong");
    return;
  }

  return NTCElement;
}
