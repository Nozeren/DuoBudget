async function getSubcategories(user_id) {
  return fetch(`/subcategories/${user_id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}

async function changeSubcategoryName(data) {
  return fetch("/changeSubcategory", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
async function deleteSubcategory(id) {
  return fetch("/deleteSubcategory", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  });
}
async function postSubcategory(data) {
  return fetch("/addsubcategory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
