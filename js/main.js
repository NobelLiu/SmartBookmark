
// Add form
var addForm = document.getElementById('addForm')
var addFormFavicon = document.getElementById('addFormFavicon')
var addFormTitle = document.getElementById('addFormTitle')
var addFormURL = document.getElementById('addFormURL')
var addFormAddButton = document.getElementById('addFormAdd')
var addFormCancelButton = document.getElementById('addFormCancel')

// Edit form
var editForm = document.getElementById('editForm')
var editFormFavicon = document.getElementById('editFormFavicon')
var editFormTitle = document.getElementById('editFormTitle')
var editFormURL = document.getElementById('editFormURL')
var editFormSaveButton = document.getElementById('editFormSave')
var editFormCancelButton = document.getElementById('editFormCancel')

// Index
var indexPage = document.getElementById('index')
var addButton = document.getElementById('add')
var indexList = document.getElementById('list')

// Add click event
window.addEventListener('load', function load(event) {

})

openIndex()


function openAddForm() {
    addForm.style.display = 'flex'
    editForm.style.display = 'none'
    indexPage.style.display = 'none'
    // get avtivie tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var current = tabs[0]
        addFormTitle.value = current.title
        addFormURL.value = current.url
        if (current.favIconUrl != null && current.favIconUrl != '') {
            addFormFavicon.src = current.favIconUrl
        }
    })
    var add = function () {
        // Fetch form value
        var title = addFormTitle.value
        var url = addFormURL.value
        var favicon = addFormFavicon.src
        var object = {
            title: title,
            url: url,
            favicon: favicon
        }
        // Read list
        chrome.storage.sync.get('list', function (dataList) {
            if (dataList.list) {
                dataList.list.push(object)
            } else {
                dataList.list = [object]
            }
            // Write list
            chrome.storage.sync.set({ 'list': dataList.list }, function (object) {
                // Notify that we saved.
                console.log('Bookmark saved')
                openIndex()
            })
        })
        addFormAddButton.removeEventListener('click', add)
        addFormCancelButton.removeEventListener('click', cancel)
    }
    var cancel = function () {
        addFormAddButton.removeEventListener('click', add)
        addFormCancelButton.removeEventListener('click', cancel)
    }
    addFormAddButton.addEventListener('click', add)
    addFormCancelButton.addEventListener('click', cancel)
}

function openEditForm(index) {
    addForm.style.display = 'none'
    editForm.style.display = 'flex'
    indexPage.style.display = 'none'
    chrome.storage.sync.get('list', function (dataList) {
        var object = dataList.list[index]
        editFormTitle.value = object.title
        editFormURL.value = object.url
        editFormFavicon.src = object.favicon
    })
    var edit = function () {
        // Fetch form value
        var title = editFormTitle.value
        var url = editFormURL.value
        var favicon = editFormFavicon.src
        var object = {
            title: title,
            url: url,
            favicon: favicon
        }
        // Read list
        chrome.storage.sync.get('list', function (dataList) {
            var start = dataList.list.slice(0, index)
            var end = dataList.list.slice(index + 2, dataList.count)
            // Write list
            chrome.storage.sync.set({ 'list': start + object + end }, function (object) {
                // Notify that we saved.
                console.log('Bookmark saved')
                openIndex()
            })
        })
        editFormSaveButton.removeEventListener('click', edit)
        editFormCancelButton.removeEventListener('click', edit)
    }
    var cancel = function () {
        editFormSaveButton.removeEventListener('click', edit)
        editFormCancelButton.removeEventListener('click', cancel)
    }
    editFormSaveButton.addEventListener('click', edit)
    editFormCancelButton.addEventListener('click', cancel)
}


function openIndex() {
    addForm.style.display = 'none'
    editForm.style.display = 'none'
    indexPage.style.display = 'flex'
    var add = function () {
        openAddForm()
        addButton.removeEventListener('click', add)
    }
    addButton.addEventListener('click', add)
    mapList()
}


function deleteBookmark(index) {
    // Read list
    chrome.storage.sync.get('list', function (dataList) {
        // Write list
        chrome.storage.sync.set({ 'list': dataList.list.splice(index, 1) }, function (object) {
            // Notify that we saved.
            console.log('Bookmark deleted')
            openIndex()
        })
    })
}

function mapList() {
    // Remove all cells
    while (indexList.firstChild) {
        indexList.removeChild(indexList.firstChild);
    }
    // Read list
    chrome.storage.sync.get('list', function (dataList) {
        for (let i = 0; i < dataList.list.length; i++) {
            var object = dataList.list[i];
            // <div class="cell">
            //         <img id="icon" src="image/icon.png" alt="icon">
            //         <p id="title">Webset title</p>
            //         <div class="action">
            //             <img id="edit" src="image/edit.png" alt="icon">
            //             <img id="delete" src="image/delete.png" alt="icon">
            //         </div>
            //     </div>
            var cell = document.createElement('div')
            cell.className = 'cell'
            // <img id="icon" src="image/icon.png">
            var icon = document.createElement('img')
            icon.src = object.favicon
            icon.id = 'icon'
            cell.appendChild(icon)
            // <p id="title">Webset title</p>
            var title = document.createElement('p')
            title.innerHTML = object.title
            title.id = 'title'
            cell.appendChild(title)
            // <div class="action">
            var action = document.createElement('div')
            action.className = 'action'
            cell.appendChild(action)
            // <img id="edit" src="image/edit.png">
            var edit = document.createElement('img')
            edit.id = 'edit'
            edit.src = 'image/edit.png'
            edit.addEventListener('click', function () { openEditForm(i) })
            action.appendChild(edit)
            // <img id="delete" src="image/delete.png">
            var del = document.createElement('img')
            del.id = 'delete'
            del.src = 'image/delete.png'
            del.addEventListener('click', function () { deleteBookmark(i) })
            action.appendChild(del)
            indexList.appendChild(cell)
        }
    })
}
