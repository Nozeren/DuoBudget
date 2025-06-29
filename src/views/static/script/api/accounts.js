async function getAccountsByUserId(userId) {
  return fetch(`/accounts/${userId}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}
async function getAccounts() {
  return fetch(`/accounts`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}
async function updateAccount(data) {
  return fetch("/updateaccount", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
async function addAccount(data) {
  return fetch("/addaccount", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    });
}
