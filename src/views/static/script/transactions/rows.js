const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let addNew = {
  row: async () => {
    if (!document.querySelector("#addrow")) {
      tr = document.createElement("tr");
      tr.addEventListener("mouseover", () => sideMenu.display(tr));
      let transaction = await addTransaction();
      let status_code = transaction[1];
      transaction = transaction[0];
      if (status_code == 201) {
        let tr = addCell(transaction);
        tableBody.prepend(tr);
        addNotification("success", `${icons.add}Transaction Added: <strong>${transaction["id"]}</strong>`);
        addEvents();
      } else {
        addNotification("error", `Error: ${transaction}`);
      }
    }
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
          addNotification("success", `${icons.trash} Transaction Deleted: ${id}`);
        },
        { once: true }
      );
    } else {
      addNotification("error", `Error: ${id} not deleted`);
    }
  },
};

function sortRows(index) {
  let rows = tableBody.rows;
  let switching = true;
  let switchCount = 0;
  let dir = "asc";
  while (switching) {
    switching = false;
    for (i = 0; i < rows.length; i++) {
      let toSwitch = false;
      let currentRow, nexRow;
      if (rows[i + 1]) {
        if (rows[i].querySelectorAll("td")[index].innerHTML.includes("select")) {
          let current = rows[i].querySelectorAll("td")[index].querySelector("select");
          let next = rows[i + 1].querySelectorAll("td")[index].querySelector("select");
          currentRow = current.options[current.selectedIndex].innerHTML.toLowerCase();
          nexRow = next.options[next.selectedIndex].innerHTML.toLowerCase();
        } else {
          currentRow = rows[i].querySelectorAll("td")[index].innerHTML.toLowerCase();
          nexRow = rows[i + 1].querySelectorAll("td")[index].innerHTML.toLowerCase();
        }
      }
      if (dir == "asc") {
        if (currentRow > nexRow) {
          toSwitch = true;
        }
      } else if (dir == "dsc") {
        if (currentRow < nexRow) {
          toSwitch = true;
        }
      }
      if (toSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchCount++;
      } else {
        if (switchCount == 0 && dir == "asc") {
          dir = "dsc";
          switching = true;
        }
      }
    }
  }
}
