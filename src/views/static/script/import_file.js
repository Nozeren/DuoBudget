function addOptions(){
    fetch('/allusers').then(function(response){
            return response.json()
        }).then(function(data){
            let select = document.getElementById('user');  
            if (select){
                for (user of data[0]){
                    let opt = document.createElement('option');
                    opt.value = user['id'];
                    opt.innerHTML = user['name'];
                    select.appendChild(opt);
                }
            }
        })
    fetch('/allbanks').then(function(response){
            return response.json()
        }).then(function(data){
            let select = document.getElementById('bank');  
            if (select){
                for (bank of data[0]){
                    let opt = document.createElement('option');
                    opt.value = bank['id'];
                    opt.innerHTML = bank['name'];
                    select.appendChild(opt);
                }
            }
        })
}
