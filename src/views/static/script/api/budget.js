async function getBudget(user_id, month, year) {
  let data = { user_id: user_id, month: month, year: year };
  return fetch("/budget", {
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

async function getDates() {
  return fetch("/budget-dates")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}

async function updateAssigned(data) {
    return fetch("/update-assigned", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function getTotalAssigned(userId) {
  return fetch(`/total-assigned/${userId}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}

