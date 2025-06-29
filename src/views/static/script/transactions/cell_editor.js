let editable = {
    ccell: null,
    cval: null,
    cselect: null,
    select: async (cell) => {
        editable.ccell = cell;
        editable.cselect = cell.querySelector("select");
        cell.classList.add("edit");
        let index = editable.cselect.selectedIndex;
        editable.cselect.style.borderColor = editable.cselect.options[index].dataset.color;
        editable.cselect.classList.remove("uncategorized");
        let data = {
            row_id: editable.ccell.dataset.row_id,
            column: editable.ccell.dataset.column,
            value: editable.cselect.value,
        };
        await updateTransactions(data);

        editable.ccell.classList.remove("edit");
    },

    edit: (cell) => {
        editable.ccell = cell;
        if (cell.dataset.currency && cell.innerText.includes("€")) {
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
                column: editable.ccell.dataset.column,
                value: editable.ccell.innerText,
            };
            await updateTransactions(data);
        }else{
            editable.ccell.innerText = editable.cval;
        }
        if (editable.ccell.dataset.currency) {
            editable.ccell.innerText += "€";
            editable.ccell.title += "€";
        }
    },
};
