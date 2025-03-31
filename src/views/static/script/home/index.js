let tableRows = document.querySelector(".budget-table-rows");
let budget;
function removeBorderSubcategory() {
  //style last subcategory rows
  document.querySelectorAll(".budget-table-row-category").forEach((div) => {
    let prev = div.previousElementSibling;
    if (prev && prev.classList.contains("budget-table-row-subcategory")) {
      prev.style.border = "none";
    }
  });
}
function formatNullValue(value) {
  if (!value) {
    return 0;
  }
  return value;
}
function addRows(budget) {
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
}
window.addEventListener("load", async () => {
  budget = await getBudget();
  addRows(budget);
  removeBorderSubcategory();
});
