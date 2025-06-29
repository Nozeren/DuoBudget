let subcategory = {
    row: null,

    add: async (category) => {
        if (!document.querySelector(".menu-option-overlay")){
            subcategory.row = category 
            let overlay = document.createElement('div')
            let option = document.createElement('a')
            overlay.classList.add('menu-option-overlay')
            option.classList.add('menu-option')

            option.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg>';
            overlay.appendChild(option)
            subcategory.row.appendChild(overlay)

            // Position
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            let top =
                subcategory.row.getBoundingClientRect().top +
                subcategory.row.getBoundingClientRect().height / 2 -
                overlay.getBoundingClientRect().height / 2 +
                scrollY;
            let left = subcategory.row.getBoundingClientRect().left - overlay.getBoundingClientRect().width;
            overlay.style.top = `${top}px`;
            overlay.style.left = `${left}px`;
            overlay.style.height = subcategory.row.getBoundingClientRect().height;
            subcategory.top = top;
            subcategory.left = left;

            // events
            subcategory.row.onmouseleave = async () => { overlay.remove()}
            option.onclick = () => {
                let overlay = document.createElement('div')
                let displayer = document.createElement('div')
                displayer.style.top = `${subcategory.top + 26}px`;
                displayer.style.left = `${subcategory.left + 26}px`;

                overlay.appendChild(displayer)
                overlay.classList.add('menu-overlay')
                displayer.classList.add('menu-displayer')

                let fieldName = document.createElement('input');
                fieldName.placeholder = 'New subcategory'
                let accept = document.createElement('button');
                accept.innerText = 'Add'

                displayer.appendChild(fieldName);
                displayer.appendChild(accept);
                category.appendChild(overlay);
                accept.addEventListener("click", async function(event) {
                    let user_id = document.getElementById("user_filter").value;
                    let data = {user_id: user_id,
                        subcategory_name: fieldName.value,
                        category_id: subcategory.row.dataset.category_id
                    }
                    await postSubcategory(data)
                    location.reload()
                })
                overlay.addEventListener("click", function(event) {
                    if (event.target === overlay){
                        overlay.remove()
                    }
                })

            }
        }
    },
    menuOption: async (row) => {
        if (!document.querySelector(".menu-option-overlay")){
            subcategory.row = row
            let overlay = document.createElement('div')
            let option = document.createElement('a')
            overlay.classList.add('menu-option-overlay')
            option.classList.add('menu-option')
            option.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" ><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>';
            overlay.appendChild(option)
            subcategory.row.appendChild(overlay)

            // Position
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            let top =
                subcategory.row.getBoundingClientRect().top +
                subcategory.row.getBoundingClientRect().height / 2 -
                overlay.getBoundingClientRect().height / 2 +
                scrollY;
            let left = subcategory.row.getBoundingClientRect().left - overlay.getBoundingClientRect().width;
            overlay.style.top = `${top}px`;
            overlay.style.left = `${left}px`;
            overlay.style.height = subcategory.row.getBoundingClientRect().height;
            subcategory.top = top;
            subcategory.left = left;

            // events
            subcategory.row.onmouseleave = async () => { overlay.remove()}
            option.onclick = () => {subcategory.menu(row)}
        }
    },
    menu: async (row) => {
            subcategory.row = row
            let name = subcategory.row.getElementsByClassName('budget-table-cell subcategory')[0].innerText
            let overlay = document.createElement('div')
            let displayer = document.createElement('div')
            displayer.style.top = `${subcategory.top + 26}px`;
            displayer.style.left = `${subcategory.left + 26}px`;

            overlay.appendChild(displayer)
            overlay.classList.add('menu-overlay')
            displayer.classList.add('menu-displayer')

            let fieldName = document.createElement('input');
            fieldName.value = name;
            fieldName.placeholder = 'Change subcategory name'
            let deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'Delete'

            displayer.appendChild(fieldName);
            displayer.appendChild(deleteBtn);
            subcategory.row.appendChild(overlay);

            fieldName.addEventListener("change", async function(event) {
                let data = {row_id: row.dataset.subcategory_id,
                    value: fieldName.value
                }
                await changeSubcategoryName(data)
                location.reload()
        })
            deleteBtn.addEventListener("click", async function(event) {
                let id= row.dataset.subcategory_id
                await deleteSubcategory(id)

                location.reload()
        })
        overlay.addEventListener("click", function(event) {
            if (event.target === overlay){
                overlay.remove()
            }
        })
    }
}
