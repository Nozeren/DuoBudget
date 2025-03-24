async function addTransaction() {
  let currentDate = datePicker.value;
  let [year, month] = currentDate.split("-").map(Number);
  let transaction = {
    posted_date: `${year}-${month}-01`,
    description: "----",
    user_id: 1,
    bank_id: 1,
    subcategory_id: 1,
    shared_amount: 0,
    amount: 0,
  };
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
async function getTransactions() {
  return fetch("/alltransactions")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}
