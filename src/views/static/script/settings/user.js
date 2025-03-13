let addUser = document.getElementById('adduser')
let removeUser = document.getElementById('removeuser')
let saveUser = document.getElementById('saveuser')
let cancelUser = document.getElementById('canceluser')
let newUserOption = document.getElementById('newuseroption')
function closeEdit(){
    let saveUser = document.getElementById('saveuser')
    let cancelUser = document.getElementById('canceluser')
    saveUser.style.display = 'none';
    cancelUser.style.display = 'none';
    addUser.style.display = 'flex';
    removeUser.style.display = 'flex';
    let input= document.getElementById('inputusername');
    input.remove();
}
async function updateUsers(){
    fetch('/allusers').then(function(response){
        return response.json()
    }).then(function(data){
        for (user of data[0]){
            let form = document.getElementById('userform');
            let div = document.createElement('div');
            let inputUserName = document.createElement('input');
            let label = document.createElement('label');
            let code = document.createElement('code');
            let exists = document.getElementById('useroption' + user['id'])
            if (!exists){
                div.className = 'useroption';
                inputUserName.type = 'radio';
                inputUserName.name =  'useroption';
                inputUserName.id = 'useroption' + user['id'];
                inputUserName.value = user['id'];
                label.htmlFor = 'useroption' + user['id'];
                code.innerText = user['name']; 
                div.appendChild(inputUserName)
                label.appendChild(code)
                div.appendChild(label)
                form.insertBefore(div,newUserOption)
            }
        }
    })
}
function postUser(data){
   fetch( '/adduser',{
    method: 'POST',
    headers: {
            'Content-Type': 'application/json'
           },
    body: JSON.stringify(data), 
   })
}
window.onload = function(){
    updateUsers()
}; 
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
            div.remove();
            fetch( '/deleteuser',{
                    method: 'DELETE',
                    headers: {
                    'Content-Type': 'application/json'
           },
            body: JSON.stringify({id:radio.value}), 
            })
        }
    }
})


cancelUser.addEventListener('click', function(e){
   closeEdit();
})
saveUser.addEventListener('click', async function(e){
    let input= document.getElementById('inputusername');
    let dataFormat = {name:input.value, color:'black'};
    postUser(dataFormat);
    closeEdit();
    await updateUsers();
})