
var list = [
    {
        title: "AAAAAAAAA"
    },
    {
        title: "BBBBBBBBB"
    },
    {
        title: "CCCCCCCCC"
    },
    {
        title: "DDDDDDDDD"
    }
]
var form = document.getElementById('form')
var formTitle = document.getElementById('formTitle')
var formURL = document.getElementById('formURL')
var addButton = document.getElementById('add')
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var current = tabs[0]
    formTitle.value = current.title
    formURL.value = current.url
    if (current.favIconUrl != null && current.favIconUrl != '') {
        icon.src = current.favIconUrl
    }
})

var list = document.getElementById('list')
var test = document.getElementById('test')
var icon = document.getElementById('icon')
window.addEventListener('load', function load(event) {
    addButton.addEventListener('click', function () { addBookmark(); });
})

function addBookmark() {
    var isHide = form.style.display == 'none'
    form.style.display = isHide ? 'flex' : 'none'
    list.style.display = isHide ? 'none' : 'flex'
    addButton.style.transform = isHide ? 'rotate(45deg)' : 'rotate(0deg)'
    // // Save it using the Chrome extension storage API.
    // chrome.storage.sync.set({ 'title': test.innerHTML }, function () {
    //     // Notify that we saved.
    //     alert('Settings saved');
    // });
}