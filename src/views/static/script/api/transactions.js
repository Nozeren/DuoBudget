async function addTransaction(transaction) {
  return fetch("/addtransaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    });
}
async function deleteTransaction(transactionId) {
  return fetch("/deletetransaction", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: transactionId }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    });
}
async function getTransactions(user_id, year, month) {
  let data = { user_id: user_id, month: month, year: year };
  return fetch("/alltransactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}

async function updateTransactions(data) {
  return fetch("/updatetransaction", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function getDates(user_id) {
  return fetch(`/transactions-dates/${user_id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}

async function getUnverified(user_id) {
  return fetch(`/temporary-transactions-dates/${user_id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}
