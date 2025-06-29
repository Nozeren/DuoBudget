const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function addOptionsToNew(selectElement, data, optionColumn, defaultOption) {
  while (selectElement.firstChild) {
    selectElement.removeChild(selectElement.firstChild);
    console.log("removed")
  }
  let groups = {};
  let optionGroups = {
    subcategory: "category",
    name: "user_name",
  };
  let dataset = {
    subcategory: "category_id",
    name: "user_id",
  };
  for (let row of data) {
    // Create option
    let optionElement = document.createElement("option");
    optionElement.innerHTML = row[optionColumn];
    optionElement.value = row["id"];
    optionElement.dataset[optionGroups[optionColumn]] = row[dataset[optionColumn]];
    if (row["id"] == defaultOption) {
      optionElement.selected = true;
    }
    if (Object.keys(optionGroups).includes(optionColumn)) {
      // Create optiongroups and save
      if (!(row[optionGroups[optionColumn]] in groups)) {
        let optgroup = document.createElement("optgroup");
        optgroup.label = row[optionGroups[optionColumn]];
        groups[row[optionGroups[optionColumn]]] = optgroup;
      }
      groups[row[optionGroups[optionColumn]]].appendChild(optionElement);
    } else {
      selectElement.appendChild(optionElement);
    }
  }
  if (Object.keys(optionGroups).includes(optionColumn)) {
    for (let group of Object.keys(groups)) {
      selectElement.appendChild(groups[group]);
    }
  }
  return selectElement;
}
let addNew = {
  row: async () => {
    let overlay = document.getElementById("save-new-overlay");
    overlay.style.display = "flex";
      // Accounts
    let accounts = await getAccounts();
    let account = document.getElementById("account");
    account.addEventListener("change",async function(){
        let subcategory = document.getElementById("subcategory");
        let index = account.selectedIndex;
        let user_id = account.options[index].dataset.user_name;
        let subcategories = await getSubcategories(user_id);
        addOptionsToNew(subcategory, subcategories, "subcategory", undefined);
    })
    addOptionsToNew(account, accounts, "name", undefined);
      //Subcategories
    let subcategory = document.getElementById("subcategory");
    let index = account.selectedIndex;
    let user_id = account.options[index].dataset.user_name;
    let subcategories = await getSubcategories(user_id);
    addOptionsToNew(subcategory, subcategories, "subcategory", undefined);
    
    let saveButton = document.getElementById("saveButton");
    saveButton.onclick = async () => {
      let description = document.getElementById("description").value;
      if (!description) {
        alert("Description must be filled out");
        return;
      }
      let date = document.getElementById("date-new").value;
      if (!date) {
        alert("Date must be filled out");
        return;
      }
      let subcategory_id = subcategory.value;
      let index = account.selectedIndex;
      let user_id = account.options[index].dataset.user_name;
      let account_id = account.value;
      let shared_amount = document.getElementById("shared_amount").value;
      if (!shared_amount) {
        alert("Shared Amount must be filled out");
        return;
      }
      let amount = document.getElementById("amount").value;
      if (!amount) {
        alert("Amount must be filled out");
        return;
      }
      let transaction = {
        posted_date: date,
        description: description,
        user_id: user_id,
        account_id: account_id,
        subcategory_id: subcategory_id,
        shared_amount: shared_amount,
        amount: amount,
      };
      await addTransaction(transaction);
      overlay.style.display = "none";
      await addRows();
    };
  },
};

let removeRow = {
  remove: async (row) => {
    let id = row.dataset.row_id;
    let deleted = await deleteTransaction(id);
    if (deleted[1] == 200) {
      row.classList.add("fade-out");
      row.addEventListener(
        "animationend",
        () => {
          row.remove();
          addNotification("success", `${icons.trash} Transaction&nbsp;<strong>${id}</strong>&nbsp;deleted `);
        },
        { once: true }
      );
    } else {
      addNotification("error", `Error: ${id} not deleted`);
    }
  },
};

function closeSaveNewPopup(event) {
  if (event.target.matches(".save-new-transaction-overlay")) {
    let exists = document.getElementById("save-new-form");
    if (exists) {
      let overlay = document.getElementById("save-new-overlay");
      overlay.style.display = "none";
    }
  }
}
