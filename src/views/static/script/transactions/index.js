let tableRows = document.querySelector(".transactions-table-rows");
let subcategories;
function removeBorderTransaction() {
  // Remove Border From last transaction in table before next Account Row
  document.querySelectorAll(".transactions-table-row-account").forEach((div) => {
    let prev = div.previousElementSibling;
    if (prev && prev.classList.contains("transactions-table-row-transaction")) {
      prev.style.border = "none";
    }
  });
}
function formatDate(date) {
  if (!isNaN(date)) {
    let options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }
}
function createDateCell(cell, currentDate) {
  let spanDate = document.createElement("span");
  let dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.value = currentDate;

  let date = new Date(dateInput.value);
  spanDate.innerText = formatDate(date);
  dateInput.addEventListener("change", function () {
    let date = new Date(this.value);
    spanDate.innerText = formatDate(date);
    editable.dateDone(dateInput, cell);
    dateInput.focus();
  });
  cell.addEventListener("click", function () {
    dateInput.showPicker();
  });
  cell.appendChild(spanDate);
  cell.appendChild(dateInput);
  return cell;
}
function createSelectCell(cell, data, optionColumn, defaultOption, color = false) {
  let groups = {};
  let select = document.createElement("select");
  let optionGroups = {
    subcategory: "category",
  };
  let optionElement = document.createElement("option");
  optionElement.innerHTML = "Choose a category";
  select.style.color = "red";
  optionElement.selected = true;
  select.appendChild(optionElement);
  for (let row of data) {
    // Create option
    let optionElement = document.createElement("option");
    optionElement.innerHTML = row[optionColumn];
    optionElement.value = row["id"];
    if (color) {
      optionElement.dataset.color = row["color"];
    }

    if (row["id"] == defaultOption) {
      optionElement.selected = true;
      select.style.color = "white";
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
      select.appendChild(optionElement);
    }
  }
  if (Object.keys(optionGroups).includes(optionColumn)) {
    for (let group of Object.keys(groups)) {
      select.appendChild(groups[group]);
    }
  }
  cell.addEventListener("click", () => editable.select(cell));
  cell.appendChild(select);
  return cell;
}
function createInputCell(cell, value) {
  cell.innerText = value;
  cell.title = value;
  cell.addEventListener("click", () => editable.edit(cell));
  return cell;
}
async function addRows() {
  // Remove Existent rows
  while (tableRows.firstChild) {
    tableRows.removeChild(tableRows.firstChild);
  }
  subcategories = await getSubcategories();
  let [year, month] = await getDatePickerValue();
  let user_id = document.getElementById("user_filter").value;
  let transactions = await getTransactions(user_id, year, month);
  if (transactions.length) {
    document.getElementById("empty-rows").style.display = "none";
    let accounts = {};
    let transactionsElements = {};
    transactions.forEach((row) => {
      let currentAccount = row["account_name"];
      // Row Element
      let transactionRow = document.createElement("div");
      transactionRow.dataset.row_id = row["id"];
      transactionRow.classList.add("transactions-table-row-transaction");
      // Columns
      for (column of ["posted_date", "description", "subcategory_id", "shared_amount", "amount"]) {
        let cell = document.createElement("div");
        cell.classList.add("transactions-table-cell");
        cell.classList.add(column);
        cell.dataset.column = column;
        cell.dataset.row_id = row["id"];
        if (column == "posted_date") {
          cell = createDateCell(cell, row[column]);
        } else if (["description"].includes(column)) {
          cell = createInputCell(cell, row[column]);
        } else if (["shared_amount", "amount"].includes(column)) {
          cell.dataset.currency = true;
          cell = createInputCell(cell, row[column] + "€");
        } else {
          cell = createSelectCell(cell, subcategories, "subcategory", row[column], false);
        }
        transactionRow.appendChild(cell);
      }
      // Add bank account to Transactions Elements
      if (!Object.keys(transactionsElements).includes(currentAccount)) {
        transactionsElements[currentAccount] = [];
      }
      transactionRow.addEventListener("mouseover", async () => await menu.button(transactionRow));
      // Add Rows to Transactions Elements of current Bank Account
      transactionsElements[currentAccount].push(transactionRow);
      // Create Table for current account if doesn't exist
      if (!Object.keys(accounts).includes(currentAccount)) {
        let accountRow = document.createElement("div");
        accountRow.classList.add("transactions-table-row-account");
        accounts[currentAccount] = accountRow;
        let cell = document.createElement("div");
        cell.classList.add("transactions-table-cell");
        cell.classList.add("account");
        cell.innerText = row["account_name"];
        accounts[currentAccount].appendChild(cell);
      }
      //
      for (let account of Object.keys(accounts)) {
        tableRows.appendChild(accounts[account]);
        for (element of transactionsElements[account]) {
          tableRows.appendChild(element);
        }
      }
      removeBorderTransaction();
    });
  } else {
    document.getElementById("empty-rows").style.display = "flex";
  }
}
async function addData() {
  await setupUserFilter();
  await addUnverified();
  await setupDatePicker();
  await addRows();
}
window.addEventListener("load", async () => {
  await addData();
});

window.onclick = (event) => {
  //Responsible to close popups
  closeSideMenu(event);
  closeImportFile(event);
  closeSaveNewPopup(event);
};
