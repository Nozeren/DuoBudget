async function deleteTransaction(transactionId) {
  return fetch("/deletetemporarytransaction", {
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
  return fetch("/get-temporary-transactions", {
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
  return fetch("/update-temporary-transaction", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
async function saveImport() {
  return fetch("/saveimport", {
    method: "PUT",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data[1] === 200) {
        addNotification("success", ` Transaction saved: ${data[0].length}`);
        return data[0];
      }
    });
}

async function getDates(user_id) {
  return fetch(`/temporary-transactions-dates/${user_id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}
