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
  dateDone: async (input, cell) => {
    let value = input.value;
    let data = {
      row_id: cell.dataset.row_id,
      column: cell.dataset.column,
      value: value,
    };
    await updateTransactions(data);
  },
  selectDone: async () => {
    editable.ccell.classList.remove("edit");
    if (editable.cselect.value != editable.cval) {
      let index = editable.cselect.selectedIndex;
      editable.cselect.style.borderColor = editable.cselect.options[index].dataset.color;
      editable.cselect.classList.remove("uncategorized");
      let data = {
        row_id: editable.ccell.dataset.row_id,
        column: editable.ccell.dataset.column,
        value: editable.cselect.value,
      };
      await updateTransactions(data);
    }
  },
  done: async (discard) => {
    editable.ccell.onblur = "";
    editable.ccell.onkeydown = "";

    editable.ccell.classList.remove("edit");
    editable.ccell.contentEditable = false;

    if (discard === 1) {
      editable.ccell.innerText = editable.cval;
    }
    if (editable.ccell.innerText != editable.cval) {
      editable.ccell.title = editable.ccell.innerText;
      let data = {
        row_id: editable.ccell.dataset.row_id,
        column: editable.ccell.dataset.column,
        value: editable.ccell.innerText,
      };
      await updateTransactions(data);
    }
    if (editable.ccell.dataset.currency) {
      editable.ccell.innerText += "€";
      editable.ccell.title += "€";
    }
  },
};
