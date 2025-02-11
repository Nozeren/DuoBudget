let addUser = document.getElementById('adduser')
let removeUser = document.getElementById('removeuser')
let saveUser = document.getElementById('saveuser')
let cancelUser = document.getElementById('canceluser')
let newUserOption = document.getElementById('newuseroption')

addUser.addEventListener('click', function(e){
    let checkInputUserName = document.getElementById('inputusername');
    if (checkInputUserName===null){
        let inputUserName = document.createElement('input');
        inputUserName.id = 'inputusername';
        inputUserName.name = 'inputusername';
        inputUserName.autofocus = true;
        newUserOption.appendChild(inputUserName);
        addUser.style.display = 'none';
        removeUser.style.display = 'none';
        saveUser.style.display = 'flex';
        cancelUser.style.display = 'flex';
        newUserOption.submit();
    }
})

removeUser.addEventListener('click', function(e){
    const radios = document.querySelectorAll('input[name="useroption"]')
    for (const radio of radios){
        if (radio.checked){
            let div = radio.parentElement
            //div.remove();
            document.getElementById('userform').submit();
        }
    }
})

cancelUser.addEventListener('click', function(e){
    saveUser.style.display = 'none';
    cancelUser.style.display = 'none';
    addUser.style.display = 'flex';
    removeUser.style.display = 'flex';
    let input= document.getElementById('inputusername');
    input.remove();
})
saveUser.addEventListener('click', function(e){
    document.getElementById('userform').submit();
})