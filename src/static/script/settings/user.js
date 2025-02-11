let addUser = document.getElementById('adduser')
let removeUser = document.getElementById('removeuser')
let newUserOption = document.getElementById('newuseroption')

addUser.addEventListener('click', function(e){
    let checkInputUserName = document.getElementById('inputusername');
    if (checkInputUserName===null){
    let inputUserName = document.createElement('input');
    inputUserName.id = 'inputusername';
    inputUserName.autofocus =true;
    newUserOption.appendChild(inputUserName);
    newUserOption.submit();
    }
})

removeUser.addEventListener('click', function(e){
    const radios = document.querySelectorAll('input[name="useroption"]')
    for (const radio of radios){
        if (radio.checked){
            let div = radio.parentElement
            div.remove();
        }
    }
})