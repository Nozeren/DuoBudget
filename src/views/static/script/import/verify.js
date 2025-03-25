// Main Variables
const table = document.getElementById("transactionstable");
let tableBody = document.getElementById("transactionsbody");
const tableHeader = document.getElementById("transactionsHead");
let firstDay, lastDay, transactionsCount;
let banks;
let subcategories;
let users;
let transactions;

// Transactions
function createDateCell(currentDate) {
  let cellDate = document.createElement("td");
  let spanDate = document.createElement("span");
  let dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.value = currentDate;

  let date = new Date(dateInput.value);
  spanDate.innerText = formatDate(date);
  dateInput.addEventListener("change", function () {
    let date = new Date(this.value);
    spanDate.innerText = formatDate(date);
    editable.dateDone(dateInput, cellDate);
    dateInput.focus();
  });
  cellDate.addEventListener("click", function () {
    dateInput.showPicker();
  });
  cellDate.appendChild(spanDate);
  cellDate.appendChild(dateInput);
  return cellDate;
}

// Style cell with color
function createSelectCell(data, optionColumn, defaultOption, color = false, optionGroup = false, groupColumn = undefined) {
  let groups = {};
  let select = document.createElement("select");
  if (!defaultOption) {
    let optionElement = document.createElement("option");
    optionElement.innerText = "Needs a category";
    select.classList.add("uncategorized");
    optionElement.select = true;
    select.appendChild(optionElement);
  }

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
  let td = document.createElement("td");
  td.appendChild(select);
  return td;
}
function formatDate(date) {
  if (!isNaN(date)) {
    let options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }
}
function addCell(transaction) {
  let tr;
  tr = document.createElement("tr");
  // Add Side Menu to row
  tr.addEventListener("mouseover", () => sideMenu.display(tr));
  // Add Cells
  let column = "id";
  let td = document.createElement("td");
  td.innerHTML = transaction[column];
  td.dataset.row_id = transaction["id"];
  td.dataset.column = column;
  tr.appendChild(td);
  column = "posted_date";
  td = createDateCell(transaction[column]);
  td.dataset.row_id = transaction["id"];
  td.dataset.column = column;
  tr.appendChild(td);
  column = "description";
  td = document.createElement("td");
  td.innerText = transaction[column];
  td.dataset.row_id = transaction["id"];
  td.dataset.column = column;
  tr.appendChild(td);
  column = "subcategory_id";
  td = createSelectCell(subcategories, "subcategory", transaction[column], false, true, "category");
  td.dataset.row_id = transaction["id"];
  td.dataset.column = column;
  tr.appendChild(td);
  column = "user_id";
  td = createSelectCell(users, "name", transaction[column], true);
  td.dataset.row_id = transaction["id"];
  td.dataset.column = column;
  tr.appendChild(td);
  column = "bank_id";
  td = createSelectCell(banks, "name", transaction[column], true, true, "country");
  td.dataset.row_id = transaction["id"];
  td.dataset.column = column;
  tr.appendChild(td);
  column = "shared_amount";
  td = document.createElement("td");
  td.innerText = transaction[column] + "€";
  td.dataset.currency = true;
  td.dataset.row_id = transaction["id"];
  td.dataset.column = column;
  td.classList.add(transaction[column] === 0 ? "shadow" : "positive");
  tr.appendChild(td);
  column = "amount";
  td = document.createElement("td");
  td.innerText = transaction[column] + "€";
  td.dataset.currency = true;
  td.dataset.row_id = transaction["id"];
  td.dataset.column = column;

  tr.dataset.row_id = transaction["id"];
  tr.appendChild(td);
  transactionsCount++;
  return tr;
}

function addTransactionsToTable(transactions) {
  // Remove rows from Table
  while (tableBody.rows.length > 0) {
    tableBody.deleteRow(0);
  }

  // --- Create Rows
  let tbody = document.getElementById("transactionsbody");
  transactionsCount = 0;
  transactions.forEach((transaction) => {
    let tr = addCell(transaction);
    document.getElementById(
      "transactions-quantity"
    ).innerHTML = `<strong>${transactionsCount}</strong> new transactions to import, approve or categorize.`;
    if (tr) {
      tbody.appendChild(tr);
    }
  });
  addEvents();
}

function addEvents() {
  document.querySelectorAll("td select").forEach((el) => {
    // Add Color to Cells
    if (el.selectedOptions[0].dataset.color) {
      el.style.border = "1px solid " + el.selectedOptions[0].dataset.color;
      el.dataset.color = el.selectedOptions[0].dataset.color;
    }
  });
  // Add Event to cells
  document.querySelectorAll("td").forEach((td) => {
    if (td.querySelector("select")) {
      td.querySelector("select").addEventListener("click", () => editable.select(td));
    } else if (!td.querySelector("span")) {
      td.addEventListener("click", () => editable.edit(td));
    }
  });
  // Sort rows by columns
  for (let [index, column] of tableHeader.querySelectorAll("th").entries()) {
    column.addEventListener("click", () => sortRows(index));
  }
  document.getElementById("savebtn").addEventListener("click", async () => {
    let saved = await saveImport();
    if (saved) {
      transactions = await getTransactions();
      addTransactionsToTable(transactions);
    }
  });
}
window.addEventListener("load", async () => {
  banks = await getBanks();
  users = await getUsers();
  subcategories = await getSubcategories();
  transactions = await getTransactions();
  addTransactionsToTable(transactions);
});
