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
async function getTransactions() {
  return fetch("/temporary-transactions")
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
