let user_select = document.getElementById("user_filter");
async function setupUserFilter() {
  let users = await getUsers();
  for (let user of users) {
    let opt = document.createElement("option");
    opt.value = user.id;
    opt.innerText = user.name;
    user_select.appendChild(opt);
    let current_user_id = localStorage.getItem("current_user_id");
    if (current_user_id && user.id == current_user_id) {
      opt.selected = true;
    }
  }
}
async function addUnverified() {
  let unverified = document.getElementById("unverifiedTransactions");
  if (unverified) {
    let user_id = document.getElementById("user_filter").value;
    if (await getUnverified(user_id)) {
      unverified.style.removeProperty("display");
    } else {
      unverified.style.display = "none";
    }
  }
}
user_select.addEventListener("change", async function (event) {
  localStorage.setItem("current_user_id", user_select.value);
  await addUnverified();
  await setupDatePicker();
  await addRows();
});
