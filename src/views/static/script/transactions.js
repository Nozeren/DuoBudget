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

