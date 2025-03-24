async function getUsers() {
  return fetch("/allusers")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}

async function postUser(data) {
  return fetch("/adduser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
async function deleteUser(userId) {
  fetch("/deleteuser", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: userId }),
  });
}
