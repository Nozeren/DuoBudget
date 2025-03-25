async function addOptions() {
  let allUsers = await getUsers();
  let select = document.getElementById("user");
  if (select) {
    for (user of allUsers) {
      let opt = document.createElement("option");
      opt.value = user["id"];
      opt.innerHTML = user["name"];
      select.appendChild(opt);
    }
  }

  let allBanks = await getBanks();
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

async function openImportFile() {
  let body = document.getElementById("import-container");
  fetch("/import")
    .then(function (response) {
      return response.text();
    })
    .then((html) => {
      body.innerHTML = html;
    });
}

window.onclick = (event) => {
  if (event.target.matches(".popup-container-overlay")) {
    let exists = document.getElementById("importfileform");
    if (exists) {
      exists.remove();
    }
  }
};
