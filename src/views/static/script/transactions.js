
let table = document.getElementById("transactionsbody");
let columns = ['id', 'posted_date', 'description', 'user_id', 'bank_id', 'subcategory_id', 'shared_amount', 'amount']

function openImportFile(){
    let body = document.getElementById('import-container')
    fetch('/import').then(function(response){
        return response.text()
    }).then((html)=>{
        body.innerHTML = html
    })
}
window.onclick = (event) => {
    if(event.target.matches('.popup-container-overlay')){
        let exists = document.getElementById('importfileform')
        if (exists){
            exists.remove();
        }
    }
}

function createSelect(){
    let select = document.createElement('select');
    select.style.fontFamily = "Montserrat"
    select.style.border = "none";
    select.style.background = "transparent";
    select.style.outline= "none";
    select.style.appearance= "none";
    select.style.color = "white";
    select.style.fontSize = "16px";
    return select
}

let optionsBackground ='#1d2025'; 
function createSubcategorySelection(td, subcategories, selected_subcategory_id){
    let select = createSelect();
    let categories = {};
    for (let row of subcategories[0]){
        if (!(row['category'] in categories)){
            let optgroup = document.createElement('optgroup');
            optgroup.label = row['category']
            optgroup.style.backgroundColor= optionsBackground;
            categories[row['category']] = optgroup
        }
        let option = document.createElement('option');
        option.innerHTML = row['subcategory'] 
        option.value = row['id'];
        option.style.backgroundColor= optionsBackground;
        if (row['id'] == selected_subcategory_id){
            option.selected = true;
        }
        categories[row['category']].appendChild(option)
    }
    for (category of Object.keys(categories)){
        select.appendChild(categories[category])
    }
    td.appendChild(select)
};
function createUserSelection(td, users, selected_user_id){
    let select = createSelect();
    for (let row of users[0]){
        let option = document.createElement('option');
        option.innerHTML = row['name'] 
        option.value = row['id'];
        option.style.backgroundColor= optionsBackground;
        if (row['id'] == selected_user_id){
            option.selected = true;
        }
        select.appendChild(option);
    }
    td.appendChild(select)
}

async function add_transaction(){
    let transaction = {'posted_date':'2025-01-01',
                        'description':'----',
                        'user_id':1,
                        'bank_id':1,
                        'subcategory_id':1,
                        'shared_amount':0, 
                        'amount':0}
    return fetch( '/addtransaction',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(transaction),
            }).then(function(response){
                return response.json()
            }).then(function(data){
                return data;
            });
}
function createBankSelection(td, banks, selected_bank_id){
    let select = createSelect();
    let countries = {}
    for (let row of banks[0]){
        if (!(row['country'] in countries)){
            let optgroup = document.createElement('optgroup');
            optgroup.label = row['country']
            optgroup.style.backgroundColor= optionsBackground;
            countries[row['country']] = optgroup
        }
        let option = document.createElement('option');
        option.innerHTML = row['name'] 
        option.value = row['id'];
        option.style.backgroundColor= optionsBackground;
        if (row['id'] == selected_bank_id){
            option.selected = true;
        }
        countries[row['country']].appendChild(option)
    }
    for (country of Object.keys(countries)){
        select.appendChild(countries[country])
    }
    td.appendChild(select)
}
let addNew = {
    row: async(previousRow) => {
        let banks = await getBanks()
        let users = await getUsers();
        let subcategories = await getSubcategories();
        if(!document.querySelector('#addrow')){
            tr = document.createElement('tr')
            tr.addEventListener("mouseover", () => sideMenu.display(tr));
            let transaction = await add_transaction() 
            for (let column of columns){
                let td = document.createElement('td');
                if (column == "subcategory_id"){
                    createSubcategorySelection(td, subcategories, transaction[column]) 
                }else if(column == 'user_id'){
                    createUserSelection(td, users, transaction[column])
                }else if(column == 'bank_id'){
                    createBankSelection(td, banks, transaction[column])
                }else{td.innerHTML = transaction[column]}
                td.dataset.row_id = transaction['id'];
                td.dataset.column = column;
                if(td.querySelector('select')){
                    td.querySelector('select').addEventListener("click", () => editable.select(td));
                }else{td.addEventListener("dblclick", () => editable.edit(td));}
                tr.appendChild(td);
                }
            previousRow.parentNode.insertBefore(tr, previousRow.nextSibling) 
        }
    }
}
let sideMenu = {
    left: null,
    top: null,
    menu:null,
    row: null,
    display: row => {
        if(!document.querySelector('.sidemenu')){
            sideMenu.row = row
            sideMenu.menu = document.createElement('div')
            sideMenu.menu.classList.add("sidemenu")
            let a = document.createElement('a')
            a.title = 'Add Row'
            a.innerHTML = '+'
            a.addEventListener("click", () => addNew.row(row));
            sideMenu.menu.appendChild(a)
            a = document.createElement('a')
            a.title = 'Delete Row'
            a.innerHTML = '-'
            sideMenu.menu.appendChild(a)
            a = document.createElement('a')
            sideMenu.row.appendChild(sideMenu.menu)
            sideMenu.top = sideMenu.row.getBoundingClientRect().top - (sideMenu.menu.getBoundingClientRect().height/4);
            sideMenu.left= sideMenu.row.getBoundingClientRect().left - sideMenu.menu.getBoundingClientRect().width;
            sideMenu.menu.style.top = `${sideMenu.top}px`
            sideMenu.menu.style.left = `${sideMenu.left}px`
            sideMenu.menu.style.height = sideMenu.row.getBoundingClientRect().height
            sideMenu.row.onmouseleave = sideMenu.done
        }
    },
    done : discard => {
       sideMenu.menu.remove()
    },
}
let editable = {
    ccell : null,
    cval: null,
    cselect: null,
    select : (cell) =>{
        editable.ccell = cell;
        editable.cselect = cell.querySelector("select");
        editable.cval = editable.cselect.value;
        cell.classList.add("edit");
        editable.cselect.onchange = editable.selectDone;
    },

    edit : (cell) => {
        editable.ccell = cell;
        editable.cval = cell.innerHTML;
        
        cell.classList.add("edit");
        cell.contentEditable = true;
        cell.focus();

        // Exit
        cell.onblur = editable.done;
        cell.onkeydown = e => {
        if (e.key == "Enter") {
            editable.done();
        }
        if (e.key == "Escape") {
            editable.done(1);
        }
        }
    },
    selectDone: () => {
        editable.ccell.classList.remove("edit");
        if(editable.cselect.value != editable.cval){
            let data = {row_id: editable.ccell.dataset.row_id,
                        column: editable.ccell.dataset.column,
                        value: editable.cselect.value,
            }
            fetch( '/updatetransaction',{
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data), 
            })
        };
    },
    done: discard => {
        editable.ccell.onblur = "";
        editable.ccell.onkeydown = "";

        editable.ccell.classList.remove("edit");
        editable.ccell.contentEditable = false;
        
        if(discard===1){
            editable.ccell.innerHTML = editable.cval;
        }
        if (editable.ccell.innerHTML != editable.cval){
            let data = {row_id: editable.ccell.dataset.row_id,
                        column: editable.ccell.dataset.column,
                        value: editable.ccell.innerHTML,
            }
            fetch( '/updatetransaction',{
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data), 
            })
        }
    }
};
async function getBanks(){
    return fetch('/allbanks').then(function(response){
        return response.json()
    }).then(function(data){
            return data;
    });
};
async function getUsers(){
    return fetch('/allusers').then(function(response){
        return response.json()
        }).then(function(data){
            return data;
        });
};
async function getSubcategories(){
    return fetch('/subcategories').then(function(response){
            return response.json()
        }).then(function(data){
            return data;
        });

}
window.addEventListener("load", async () =>{
    let banks = await getBanks()
    let users = await getUsers();
    let subcategories = await getSubcategories();

    fetch('/alltransactions').then(function(response){
            return response.json()
        }).then(function(data){
            for (transaction of data[0]){
                let tr = document.createElement('tr');
                tr.addEventListener("mouseover", () => sideMenu.display(tr));
                for (let column of columns){
                    let td = document.createElement('td');
                    if (column == "subcategory_id"){
                       createSubcategorySelection(td, subcategories, transaction[column]) 
                    }else if(column == 'user_id'){
                        createUserSelection(td, users, transaction[column])
                    }else if(column == 'bank_id'){
                        createBankSelection(td, banks, transaction[column])
                    }else{
                    td.innerHTML = transaction[column]
                    }
                    td.dataset.row_id = transaction['id'];
                    td.dataset.column = column;
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            for (let td of document.querySelectorAll(".transactions td")){
                if(td.querySelector('select')){
                    td.querySelector('select').addEventListener("click", () => editable.select(td));
                }else{
                    td.addEventListener("dblclick", () => editable.edit(td));
                }
            }
    })
})