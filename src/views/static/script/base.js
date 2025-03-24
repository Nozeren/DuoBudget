// SHORTCUT
let icons = {
  add: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>',
  trash:
    '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>',
};

function openPages(event) {
  // Dashboard
  if (event.ctrlKey && event.code == "KeyD") {
    event.preventDefault();
    window.location.href = "/";
  } else if (event.ctrlKey && event.code == "KeyS") {
    event.preventDefault();
    window.location.href = "/settings/user";
  }
}

document.addEventListener("keydown", openPages);
setTimeout(function () {
  let message = document.querySelector(".alert-container");
  if (message) {
    message.remove();
  }
}, 5000);

function addNotification(category, text) {
  let notificationContainer = document.createElement("div");
  notificationContainer.classList.add("alert-container");
  let notification = document.createElement("div");
  notification.classList.add(`alert-${category}`);
  notification.innerHTML = text;
  let span = document.createElement("span");
  span.classList.add("closebtn");
  span.onclick = () => {
    notificationContainer.style.display = "none";
  };
  span.innerHTML = "&times";
  notification.appendChild(span);
  notificationContainer.appendChild(notification);
  document.body.appendChild(notificationContainer);
}
