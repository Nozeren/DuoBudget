let editable = {
  ccell: null,
  cval: null,
  cselect: null,
  select: (cell) => {
    editable.ccell = cell;
    editable.cselect = cell.querySelector("select");
    editable.cval = editable.cselect.value;
    cell.classList.add("edit");
    editable.cselect.onchange = editable.selectDone;
  },

  edit: (cell) => {
    editable.ccell = cell;
    if (cell.dataset.currency) {
      cell.innerHTML = cell.innerHTML.replace("€", "");
    }
    editable.cval = cell.innerHTML;

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
  dateDone: (input, cell) => {
    let data = {
      row_id: cell.dataset.row_id,
      column: cell.dataset.column,
      value: input.value,
    };
    fetch("/updatetransaction", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
  selectDone: () => {
    editable.ccell.classList.remove("edit");
    if (editable.cselect.value != editable.cval) {
      let index = editable.cselect.selectedIndex;
      editable.cselect.style.borderColor = editable.cselect.options[index].dataset.color;
      let data = {
        row_id: editable.ccell.dataset.row_id,
        column: editable.ccell.dataset.column,
        value: editable.cselect.value,
      };
      fetch("/updatetransaction", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    }
  },
  done: (discard) => {
    editable.ccell.onblur = "";
    editable.ccell.onkeydown = "";

    editable.ccell.classList.remove("edit");
    editable.ccell.contentEditable = false;

    if (discard === 1) {
      editable.ccell.innerHTML = editable.cval;
    }
    if (editable.ccell.innerHTML != editable.cval) {
      let data = {
        row_id: editable.ccell.dataset.row_id,
        column: editable.ccell.dataset.column,
        value: editable.ccell.innerHTML,
      };
      fetch("/updatetransaction", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    }
    if (editable.ccell.dataset.currency) {
      editable.ccell.innerHTML += "€";
    }
  },
};
