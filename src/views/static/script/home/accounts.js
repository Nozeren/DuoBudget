
async function loadAccounts(){
    let user_id = document.getElementById("user_filter").value;
    let accounts = await getAccountsByUserId(user_id)
    let assigned = await getTotalAssigned(user_id)
    let fullDebitBalance = 0;

    let accountsList = document.createElement("div")
    accountsList.classList.add('accounts-list')
    let totalRow = document.createElement("div")
    totalRow.classList.add('accounts-list-total-row')
    let totalText= document.createElement("a")
    let total= document.createElement("a")
    totalRow.appendChild(totalText)
    totalRow.appendChild(total)
    totalText.innerText = "Balance"
    totalText.title = 'Assign all the balance between categories and dont let it as negative number'
    totalText.style.textDecoration = 'underline dotted';

    accountsList.appendChild(totalRow)

    let assignedRow = document.createElement("div")
    assignedRow.classList.add('accounts-list-assigned-row')
    let text = document.createElement("a")
    let totalAssigned= document.createElement("a")
    text.innerText = 'Assigned'
    totalAssigned.innerText = '-'+assigned['total']+ '€'
    assignedRow.appendChild(text)
    assignedRow.appendChild(totalAssigned)
    accountsList.appendChild(assignedRow)

    accounts.forEach((account)=>{
        if (account['type_id']==1){
            let accountRow = document.createElement("div")
            accountRow.classList.add('accounts-list-account-row')
            let accountName = document.createElement("a")
            let accountBalance = document.createElement("a")
            accountName.innerText = account["name"]
            accountBalance.innerText = account["balance"]+ '€'
            accountRow.appendChild(accountName)
            accountRow.appendChild(accountBalance)
            accountsList.appendChild(accountRow)
            fullDebitBalance += account['balance']
        }
    })
    let totalResult = fullDebitBalance-assigned['total']
    total.innerText = totalResult + '€'
    if (totalResult < 0){
        total.classList.add('negative')
    }else{
        total.classList.add('positive')
    }
    let organizer = document.getElementsByClassName('organizer')[0]
    organizer.appendChild(accountsList)
}

