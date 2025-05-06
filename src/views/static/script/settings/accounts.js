let buttons = document.getElementById("accounts-buttons");
let accountsList = document.getElementById("list-container-accounts");

function createSelectCell(data, optionColumn, defaultOption, optionGroup = false, groupColumn = undefined) {
  let groups = {};
  let select = document.createElement("select");
  for (let row of data) {
    // Create option
    let optionElement = document.createElement("option");
    optionElement.innerHTML = row[optionColumn];
    optionElement.value = row["id"];

    if (row["id"] == defaultOption || !defaultOption) {
      optionElement.selected = true;
    }
    if (optionGroup && groupColumn != undefined) {
      // Create optiongroups and save
      if (!(row[groupColumn] in groups)) {
        let optgroup = document.createElement("optgroup");
        optgroup.label = row[groupColumn];
        groups[row[groupColumn]] = optgroup;
      }
      groups[row[groupColumn]].appendChild(optionElement);
    } else {
      select.appendChild(optionElement);
    }
  }
  if (optionGroup && groupColumn != undefined) {
    for (let group of Object.keys(groups)) {
      select.appendChild(groups[group]);
    }
  }
  return select;
}
async function displayUserAccounts(userId) {
  accountsList.querySelectorAll(".account-row").forEach((element) => {
    element.remove();
  });

  await getAccountsByUserId(userId).then((accounts) => {
    if (accounts) {
      accounts.forEach(async (account) => {
        let accountRow = document.createElement("div");
        accountRow.classList.add("account-row");
        let div = document.createElement("div");
        div.classList.add("account-name-type");
        let name = document.createElement("input");
        name.value = account["name"];
        name.addEventListener("change", async () => {
          let value = name.value;
          let data = {
            row_id: account["id"],
            column: "name",
            value: value,
          };
          await updateAccount(data);
        });

        let bankSelect = document.createElement("select");
        bankSelect.classList.add("bank-select");
        await getBanks().then((banks) => {
          banks.forEach((bank) => {
            let bankOption = document.createElement("option");
            if (bank["id"] == account["bank_id"]) {
              bankOption.selected = true;
            }
            bankOption.innerText = bank["name"];
            bankOption.value = bank["id"];
            bankSelect.appendChild(bankOption);
          });
        });
        bankSelect.addEventListener("change", async () => {
          let value = bankSelect.value;
          let data = {
            row_id: account["id"],
            column: "bank_id",
            value: value,
          };
          await updateAccount(data);
        });

        let typeSelect = document.createElement("select");
        await getAccountsType().then((types) => {
          types.forEach((type) => {
            let typeOption = document.createElement("option");
            if (type["id"] == account["type_id"]) {
              typeOption.selected = true;
            }
            typeOption.innerText = type["name"];
            typeOption.value = type["id"];
            typeSelect.appendChild(typeOption);
          });
        });
        typeSelect.addEventListener("change", async () => {
          let value = typeSelect.value;
          let data = {
            row_id: account["id"],
            column: "type_id",
            value: value,
          };
          await updateAccount(data);
        });
        div.appendChild(name);
        div.appendChild(typeSelect);
        accountRow.appendChild(div);
        accountRow.appendChild(bankSelect);
        accountsList.insertBefore(accountRow, buttons);
      });
    }
    buttons.classList.remove("hide");
  });
}
let addButton = document.getElementById("addaccount");
addButton.addEventListener("click", async () => {
  let overlay = document.createElement("div");
  overlay.id = "popup-container-overlay";
  overlay.classList.add("popup-container-overlay");
  let container = document.createElement("div");
  container.classList.add("popup-container");
  let form = document.createElement("div");
  form.classList.add("form-container");
  let nameLabel = document.createElement("label");
  nameLabel.htmlFor = "nameInput";
  nameLabel.innerText = "ACCOUNT NAME";
  let nameInput = document.createElement("input");
  nameInput.name = "nameInput";
  let bankLabel = document.createElement("label");
  bankLabel.htmlFor = "bankSelect";
  bankLabel.innerText = "BANK";
  let bankSelect = createSelectCell(await getBanks(), "name", undefined, true, "country");
  bankSelect.name = "bankSelect";
  bankSelect.classList.add("bank-select");

  let typeLabel = document.createElement("label");
  typeLabel.htmlFor = "typeSelect";
  typeLabel.innerText = "ACCOUNT TYPE";
  let typeSelect = createSelectCell(await getAccountsType(), "name", undefined);
  typeSelect.name = "typeSelect";

  let saveButton = document.createElement("button");
  saveButton.innerText = "Create";
  saveButton.onclick = async (event) => {
    let cName = nameInput.value;
    if (!cName) {
      alert("Field Empty: Account Name");
    }
    let usersList = document.getElementById("list-container-users");
    let data = {
      name: nameInput.value,
      type_id: typeSelect.options[typeSelect.selectedIndex].value,
      bank_id: bankSelect.options[bankSelect.selectedIndex].value,
      user_id: usersList.querySelector(".selected").dataset.userId,
    };
    let result = await addAccount(data);
    console.log(result);
    if (result == 500) {
      alert("Account name already in use");
    } else {
      overlay.remove();
      await displayUserAccounts(usersList.querySelector(".selected").dataset.userId);
    }
  };
  form.appendChild(nameLabel);
  form.appendChild(nameInput);
  form.appendChild(bankLabel);
  form.appendChild(bankSelect);
  form.appendChild(typeLabel);
  form.appendChild(typeSelect);
  form.appendChild(saveButton);
  container.appendChild(form);
  overlay.appendChild(container);
  document.body.appendChild(overlay);
  const rect = addButton.getBoundingClientRect();
  const position = container.getBoundingClientRect();
  container.style.left = `${rect.left + window.scrollX}px`;
  container.style.top = `${rect.top + window.scrollY - position.height}px`;
});
window.onclick = (event) => {
  if (event.target.matches(".popup-container-overlay")) {
    let exists = document.getElementById("popup-container-overlay");
    if (exists) {
      exists.remove();
    }
  }
};

async function updateAccounts() {
  let usersList = document.getElementById("list-container-users");
  users.forEach((user) => {
    let userRow = document.createElement("div");
    userRow.dataset.userId = user["id"];
    let codeElement = document.createElement("code");
    userRow.classList.add("useroption");
    codeElement.innerText = user["name"];
    userRow.appendChild(codeElement);
    userRow.addEventListener("click", async () => {
      usersList.querySelectorAll(".selected").forEach((selected) => {
        selected.classList.remove("selected");
      });
      await displayUserAccounts(user["id"]);
      userRow.classList.add("selected");
    });
    usersList.appendChild(userRow);
  });
}
