let accountSelect = document.getElementById("import_account");
let userSelect = document.getElementById("import_user");
let fileInput = document.getElementById("file");
async function updateBankInput() {
  let index = accountSelect.selectedIndex;
  let bank_id = accountSelect.options[index].dataset.bank_id;
  document.getElementById("import_bank").value = parseInt(bank_id);
}
async function addAccountsToImport() {
  let userAccounts = await getAccountsByUserId(userSelect.value);
  if (accountSelect) {
    let lastAccount;
    if (accountSelect.value) {
      lastAccount = accountSelect.dataset.account_id;
    }
    while (accountSelect.firstChild) {
      accountSelect.removeChild(accountSelect.firstChild);
    }
    for (account of userAccounts) {
      let opt = document.createElement("option");
      opt.value = account["id"];
      opt.dataset.bank_id = account["bank_id"];
      if (account["id"] == lastAccount) {
        opt.selected = true;
      }
      opt.innerHTML = account["name"];
      accountSelect.appendChild(opt);
    }
  }
}
async function addOptionsToImport() {
  let allUsers = await getUsers();
  if (userSelect) {
    for (user of allUsers) {
      let opt = document.createElement("option");
      opt.value = user["id"];
      opt.innerHTML = user["name"];
      userSelect.appendChild(opt);
    }
  }
  await addAccountsToImport();
  await updateBankInput();
}

if (userSelect) {
  userSelect.addEventListener("change", async () => {
    await addAccountsToImport();
  });
}
if (accountSelect) {
  accountSelect.addEventListener("change", async () => {
    await updateBankInput();
  });
}
async function openImportFile() {
  let popup = document.getElementById("importfileform");
  popup.style.display = "flex";
  await addOptionsToImport();
}

function closeImportFile(event) {
  if (event.target.matches(".popup-container-overlay")) {
    let exists = document.getElementById("importfileform");
    if (exists) {
      exists.style.display = "none";
    }
  }
}
