let sideMenu = {
  left: null,
  top: null,
  menu: null,
  row: null,
  display: (row) => {
    if (!document.querySelector(".sidemenu")) {
      sideMenu.row = row;
      sideMenu.menu = document.createElement("div");
      sideMenu.menu.classList.add("sidemenu");
      a = document.createElement("a");
      a.title = "Delete Row";
      a.addEventListener("click", () => removeRow.remove(row));
      a.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" ><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>';
      sideMenu.menu.appendChild(a);
      a = document.createElement("a");
      sideMenu.row.appendChild(sideMenu.menu);
      const scrollX = window.scrollX || document.documentElement.scrollRight;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      sideMenu.top =
        sideMenu.row.getBoundingClientRect().top +
        sideMenu.row.getBoundingClientRect().height / 2 -
        sideMenu.menu.getBoundingClientRect().height / 2 +
        scrollY;
      sideMenu.right = sideMenu.row.getBoundingClientRect().right - sideMenu.menu.getBoundingClientRect().width + scrollX;
      sideMenu.menu.style.top = `${sideMenu.top}px`;
      sideMenu.menu.style.right = `${sideMenu.right}px`;
      sideMenu.menu.style.height = sideMenu.row.getBoundingClientRect().height;
      sideMenu.row.onmouseleave = sideMenu.done;
    }
  },
  done: (discard) => {
    sideMenu.menu.remove();
  },
};
