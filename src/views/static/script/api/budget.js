async function getBudget() {
  return fetch("/budget")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}

async function getDates() {
  return fetch("/budget-dates")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}
