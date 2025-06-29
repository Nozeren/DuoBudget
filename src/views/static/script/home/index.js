let tableRows = document.getElementById("table-rows")
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
let editable = {
    ccell: null,
    cval: null,
    cselect: null,
    edit: (cell) => {
        editable.ccell = cell;
        if (cell.innerText.includes("€")) {
            cell.innerText = cell.innerText.replace("€", "");
        }
        editable.cval = cell.innerText;

        cell.classList.add("edit");
        cell.contentEditable = true;
        cell.focus();
        // Exit
        cell.onblur = editable.done;
        cell.onkeydown = (e) => {
            if (e.key == "Enter") {
                editable.done();
            }
            if (e.key == "Escape") {
                editable.done(1);
            }
        };
    },
    done: async (discard) => {
        editable.ccell.onblur = "";
        editable.ccell.onkeydown = "";

        editable.ccell.classList.remove("edit");
        editable.ccell.contentEditable = false;

        if (discard === 1) {
            editable.ccell.innerText = editable.cval;
        }
        if (editable.ccell.innerText != editable.cval && editable.ccell.innerText.trim() !== '') {
            editable.ccell.title = editable.ccell.innerText;
            let data = {
                row_id: editable.ccell.dataset.row_id,
                value: editable.ccell.innerText,
            };
            await updateAssigned(data);
            location.reload()
        }else{
            editable.ccell.innerText = editable.cval;
        }
    },
};

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
    subcategoryRow.onmouseover= async() => { await subcategory.menuOption(subcategoryRow)}
    subcategoryRow.classList.add("budget-table-row-subcategory");
    subcategoryRow.dataset.subcategory_id= row['subcategory_id'];
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
      if (column == "assigned"){
          cell.dataset.row_id=row['budget_id'];
          cell.addEventListener("click", ()=>editable.edit(cell))
      }
      subcategoryRow.appendChild(cell);
      categoriesAmounts[currentCategory][column] += formatNullValue(row[column]);
    }
    subcategories[currentCategory].push(subcategoryRow);
    // Category
      if (!Object.keys(categories).includes(currentCategory)) {
          let categoryRow = document.createElement("div");
          categoryRow.onmouseover= async() => { await subcategory.add(categoryRow)}
          categoryRow.classList.add("budget-table-row-category");
          categoryRow.dataset.category_id = row['category_id']
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
    //removeBorderTransaction();
}
async function addData() {
    await setupUserFilter();
    await setupDatePicker();
    await addRows();
}
window.addEventListener("load", async () => {
    await addData();
    await loadAccounts();
});
