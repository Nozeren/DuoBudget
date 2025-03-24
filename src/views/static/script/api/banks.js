async function getBanks() {
  return fetch("/allbanks")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}
