let moveToButton = document.getElementById("moveTo");
let moveToSubmenu = document.getElementById("moveTo-submenu");
let menu = {
    row: null,
    buttonElement: null,
    letf: null,
    top: null,
    button: async (row) => {
        if (!document.querySelector(".sidemenu")) {
            menu.row = row;
            menu.buttonElement = document.createElement("div");
            menu.buttonElement.classList.add("sidemenu");
            let a = document.createElement("a");
            a.title = "Menu";
            a.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" ><path d="M479.79-192Q450-192 429-213.21t-21-51Q408-294 429.21-315t51-21Q510-336 531-314.79t21 51Q552-234 530.79-213t-51 21Zm0-216Q450-408 429-429.21t-21-51Q408-510 429.21-531t51-21Q510-552 531-530.79t21 51Q552-450 530.79-429t-51 21Zm0-216Q450-624 429-645.21t-21-51Q408-726 429.21-747t51-21Q510-768 531-746.79t21 51Q552-666 530.79-645t-51 21Z"/></svg>';
            a.addEventListener("click", async () => await menu.display());
            menu.buttonElement.appendChild(a);
            menu.row.appendChild(menu.buttonElement);
            const scrollX = window.scrollX || document.documentElement.scrollRight;
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            menu.top =
                menu.row.getBoundingClientRect().top +
                menu.row.getBoundingClientRect().height / 2 -
                menu.buttonElement.getBoundingClientRect().height / 2 +
                scrollY;
            menu.left = menu.row.getBoundingClientRect().left - menu.buttonElement.getBoundingClientRect().width;
            menu.buttonElement.style.top = `${menu.top}px`;
            menu.buttonElement.style.left = `${menu.left}px`;
            menu.buttonElement.style.height = menu.row.getBoundingClientRect().height;
            menu.row.onmouseleave = () => menu.buttonElement.remove();
        }
    },
    display: async () => {
        let overlay = document.getElementById("row-menu-overlay");
        overlay.style.display = "flex";
        let rowMenu = document.getElementById("row-menu");
        rowMenu.style.top = `${menu.top + 26}px`;
        rowMenu.style.left = `${menu.left + 26}px`;
        let details = document.getElementById("row_details");
        details.innerHTML = "Transaction <strong>" + menu.row.dataset.row_id + "</strong>";
        document.querySelectorAll(".menu-row-button").forEach((element) => {
            element.onmouseleave = () => {
                let selected = document.querySelector(".selected");
                if (selected) {
                    selected.classList.remove("selected");
                }
            };
            element.onmouseenter = () => {
                element.classList.add("selected");
            };
        });
        document.getElementById("deleteButton").addEventListener("click", function () {
            if (confirm("Delete transaction?") == true) {
                removeRow.remove(menu.row);
                overlay.style.display = "none";
            }
        });
        moveToButton.addEventListener("mouseenter", async function () {
            moveToSubmenu.style.display = "block";
            moveToSubmenu.style.left = `${menu.left + 170}px`;
            let accounts = await getAccounts();
            while (moveToSubmenu.firstChild) {
                moveToSubmenu.removeChild(moveToSubmenu.firstChild);
            }
            let users = {};
            accounts.forEach((account) => {
                if (!Object.keys(users).includes(account.user_name)) {
                    let user = document.createElement("div");
                    user.classList.add("menu-row-user");
                    user.innerText = account.user_name;
                    users[account.user_name] = user;
                }
                let button = document.createElement("div");
                button.classList.add("menu-row-button");
                let buttonText = document.createElement("div");
                buttonText.classList.add("row-menu-button-text");
                buttonText.innerHTML = account.name;
                button.appendChild(buttonText);
                users[account.user_name].appendChild(button);
                button.onclick = async () => {
                    let data = {
                        row_id: menu.row.dataset.row_id,
                        column: "user_id",
                        value: account.user_id,
                    };
                    await updateTransactions(data);
                    data = {
                        row_id: menu.row.dataset.row_id,
                        column: "account_id",
                        value: account.id,
                    };
                    await updateTransactions(data);
                    menu.close();
                    await addRows();
                };
            });
            for (let user of Object.values(users)) {
                moveToSubmenu.appendChild(user);
            }
        });
        moveToButton.addEventListener("mouseleave", function () {
            moveToSubmenu.style.display = "none";
        });
    },
    close: () => {
        let overlay = document.getElementById("row-menu-overlay");
        overlay.style.display = "none";
        moveToSubmenu.style.display = "none";
    },
};

function closeSideMenu(event) {
    if (event.target.matches(".menu-row-overlay")) {
        let exists = document.getElementById("row-menu");
        if (exists) {
            menu.close();
        }
    }
}
