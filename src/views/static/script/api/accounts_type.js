async function getAccountsType() {
  return fetch("/accounts-type")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}
