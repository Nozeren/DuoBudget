// SHORTCUT

function openPages(event){
    // Dashboard
    if (event.ctrlKey && event.code == "KeyD"){
        event.preventDefault();
        window.location.href = "/";
    } else if (event.ctrlKey && event.code == "KeyS"){
        event.preventDefault();
        window.location.href = "/settings/user";
    }
}

document.addEventListener("keydown", openPages)