let addUser = document.getElementById("adduser");
let removeUser = document.getElementById("removeuser");
let saveUser = document.getElementById("saveuser");
let cancelUser = document.getElementById("canceluser");
let newUserOption = document.getElementById("newuseroption");

function closeEdit() {
  let saveUser = document.getElementById("saveuser");
  let cancelUser = document.getElementById("canceluser");
  addUser.classList.add("show");
  addUser.classList.remove("hide");
  removeUser.classList.add("show");
  removeUser.classList.remove("hide");
  saveUser.classList.add("hide");
  saveUser.classList.remove("show");
  cancelUser.classList.add("hide");
  cancelUser.classList.remove("show");
  let input = document.getElementById("inputusername");
  if (input) {
    input.remove();
  }
}
async function updateUsers() {
  for (user of users) {
    let form = document.getElementById("addUsersList");
    let div = document.createElement("div");
    let inputUserName = document.createElement("input");
    let label = document.createElement("label");
    let code = document.createElement("code");
    let exists = document.getElementById("useroption" + user["id"]);
    if (!exists) {
      div.className = "useroption";
      inputUserName.type = "radio";
      inputUserName.name = "useroption";
      inputUserName.id = "useroption" + user["id"];
      inputUserName.value = user["id"];
      label.htmlFor = "useroption" + user["id"];
      div.addEventListener("click", () => {
        inputUserName.checked = true;
      });
      code.innerText = user["name"];
      div.appendChild(inputUserName);
      label.appendChild(code);
      div.appendChild(label);
      form.insertBefore(div, newUserOption);
    }
  }
  document.getElementById("users-quantity").innerText = users.length;
}

let add = {
  input: null,
  inputValue: null,
  addUser: async (input) => {
    add.input = input;
    add.inputValue = input.value;

    input.classList.add("add-user");
    input.onblur = add.done;
    input.onkeydown = async (e) => {
      if (e.key == "Enter") {
        await add.done();
      }
      if (e.key == "Escape") {
        await add.done(1);
      }
    };
  },
  done: async (discard) => {
    if (discard === 1) {
      add.input.value = add.inputValue;
    }
    if (add.input.value != add.inputValue) {
      let input = document.getElementById("inputusername");
      let dataFormat = { name: input.value, color: "black" };
      await postUser(dataFormat);
      await updateUsers();
    }
    closeEdit();
  },
};

addUser.addEventListener("click", async function (e) {
  let checkInputUserName = document.getElementById("inputusername");
  if (checkInputUserName === null) {
    let inputUserName = document.createElement("input");
    inputUserName.id = "inputusername";
    inputUserName.name = "inputusername";
    inputUserName.addEventListener("onfocus", await add.addUser(inputUserName));
    newUserOption.appendChild(inputUserName);
    inputUserName.focus();
    addUser.classList.add("hide");
    addUser.classList.remove("show");
    removeUser.classList.add("hide");
    removeUser.classList.remove("show");
    saveUser.classList.add("show");
    saveUser.classList.remove("hide");
    cancelUser.classList.add("show");
    cancelUser.classList.remove("hide");
  }
});

removeUser.addEventListener("click", async function (e) {
  const radios = document.querySelectorAll('input[name="useroption"]');
  for (const radio of radios) {
    if (radio.checked) {
      let div = radio.parentElement;
      div.remove();
      await deleteUser(radio.value);
      await updateUsers();
    }
  }
});

cancelUser.addEventListener("click", function (e) {
  closeEdit();
});
saveUser.addEventListener("click", async function (e) {
  let input = document.getElementById("inputusername");
  let dataFormat = { name: input.value, color: "black" };
  await postUser(dataFormat);
  await add.done();
  await updateUsers();
});
