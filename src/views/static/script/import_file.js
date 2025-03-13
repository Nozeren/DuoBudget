async function get_all_users() {
  return fetch("/allusers")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}
async function get_all_banks() {
  return fetch("/allbanks")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data[0];
    });
}
async function addOptions() {
  let allUsers = await get_all_users();
  let select = document.getElementById("user");
  if (select) {
    for (user of allUsers) {
      let opt = document.createElement("option");
      opt.value = user["id"];
      opt.innerHTML = user["name"];
      select.appendChild(opt);
    }
  }

  let allBanks = await get_all_banks();
  let bankSelect = document.getElementById("bank");
  if (bankSelect) {
    for (bank of allBanks) {
      let opt = document.createElement("option");
      opt.value = bank["id"];
      opt.innerHTML = bank["name"];
      bankSelect.appendChild(opt);
    }
  }
}
