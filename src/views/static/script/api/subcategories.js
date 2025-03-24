async function getSubcategories() {
  return fetch("/subcategories")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}
