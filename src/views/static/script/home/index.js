// Remove Border From
document.querySelectorAll(".budget-table-row-category").forEach((div) => {
  let prev = div.previousElementSibling;
  if (prev && prev.classList.contains("budget-table-row-subcategory")) {
    prev.style.border = "none";
  }
});

function formatNullValue(value) {
  if (!value) {
    return 0;
  }
  return value;
}
async function addRows() {
  while (tableRows.firstChild) {
    tableRows.removeChild(tableRows.firstChild);
  }
  let [year, month] = await getDatePickerValue();
  let user_id = document.getElementById("user_filter").value;
  let budget = await getBudget(user_id, month, year);
  let categories = {};
  let categoriesAmounts = {};
  let subcategories = {};
  budget.forEach((row) => {
    let currentCategory = row["category"];
    if (!Object.keys(categoriesAmounts).includes(currentCategory)) {
      categoriesAmounts[currentCategory] = { assigned: 0, activity: 0, available: 0 };
    }
    // Subcategory
    if (!Object.keys(subcategories).includes(currentCategory)) {
      subcategories[currentCategory] = [];
    }
    let subcategoryRow = document.createElement("div");
    subcategoryRow.classList.add("budget-table-row-subcategory");
    for (let column of ["subcategory", "assigned", "activity", "available"]) {
      let cell = document.createElement("div");
      cell.classList.add("budget-table-cell");
      cell.classList.add(column);
      cell.innerText = formatNullValue(row[column]);
      if (column != "subcategory") {
        cell.innerText += "€";
      }
      if (column == "available") {
        if (row[column] > 0) {
          cell.classList.add("positive");
        } else if (row[column] < 0) {
          cell.classList.add("negative");
        } else {
          cell.classList.add("inactive");
        }
      }
      subcategoryRow.appendChild(cell);
      categoriesAmounts[currentCategory][column] += formatNullValue(row[column]);
    }
    subcategories[currentCategory].push(subcategoryRow);
    // Category
    if (!Object.keys(categories).includes(currentCategory)) {
      let categoryRow = document.createElement("div");
      categoryRow.classList.add("budget-table-row-category");
      categories[currentCategory] = categoryRow;
      let cell = document.createElement("div");
      cell.classList.add("budget-table-cell");
      cell.classList.add("category");
      cell.innerText = row["category"];
      categories[currentCategory].appendChild(cell);
    }
  });
  // Add Rows to table element
  for (category of Object.keys(categories)) {
    for (column of ["assigned", "activity", "available"]) {
      cell = document.createElement("div");
      cell.classList.add("budget-table-cell");
      cell.classList.add(column);
      cell.innerText = categoriesAmounts[category][column] + "€";
      categories[category].appendChild(cell);
    }
    tableRows.appendChild(categories[category]);
    for (subcategoryRow of subcategories[category]) {
      tableRows.appendChild(subcategoryRow);
    }
  }
  removeBorderTransaction();
}
async function addData() {
  await setupUserFilter();
  await setupDatePicker();
  await addRows();
}
window.addEventListener("load", async () => {
  await addData();
});
