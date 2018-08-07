var resultsTabsList = document.getElementById('tabs-list');
var tabsObjects = [];
var bookmarksObjects = [];

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

function searchResultTabs() {
    resultsTabsList.textContent = '';

    let tabsTitles = tabsObjects.map(a => a.title);
    let bookmarksTitles = bookmarksObjects.map(a => a.title);
    let allTitles = tabsTitles.concat(bookmarksTitles);

    let searchQuery = document.getElementById("find-input").value;
    let fuzzyResultsAll = fuzzysort.go(searchQuery, allTitles);


    for (i in fuzzyResultsAll) {
        let tabLink = document.createElement('a');

        if (tabsTitles.includes(fuzzyResultsAll[i].target)) {
            // retrieve tab object from tabsObjects with matching title
            var currTab = tabsObjects.filter(obj => obj.title === fuzzyResultsAll[i].target);
            tabLink.textContent = currTab[0].title || currTab[0].id;
            tabLink.setAttribute('href', currTab[0].id);
            tabLink.setAttribute('window', currTab[0].winId);
            tabLink.classList.add('open-tab-link');
            // console.log(tabLink);
        } else if (bookmarksTitles.includes(fuzzyResultsAll[i].target)) {
            // retrieve bookmark object from bookmarksObjects with matching title
            var currTab = bookmarksObjects.filter(obj => obj.title === fuzzyResultsAll[i].target);
            // console.log(currTab);
            tabLink.textContent = currTab[0].title || currTab[0].id;
            tabLink.setAttribute('href', currTab[0].url);
            tabLink.setAttribute('window', currTab[0].winId);
            tabLink.classList.add('bookmark-link');
        } else {
            console.log("no known tab");
        }

        resultsTabsList.appendChild(tabLink);
        colourFirst();
    }

    // Switch to first item with Enter (ie. don't put <CR> into text box)
    document.getElementById("find-input").onkeydown = function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            document.getElementById("tabs-list").firstChild.click();
        }
    }
}

document.addEventListener("DOMContentLoaded", function (e) {

    getTabs();
    getBookmarks();

    // Do this whenever the text box changes
    var input = document.getElementById("find-input");
    input.oninput = searchResultTabs;

    // Focus on the input box on load
    document.getElementById("find-input").focus();

    // Click on link to switch to that tab/window
    document.addEventListener("click", (e) => {
        var tabId = +e.target.getAttribute('href');
        var winId = +e.target.getAttribute('window');

        browser.windows.update(winId, {
            focused: true
        });
        browser.tabs.update(tabId, {
            active: true
        });
    });
});

// Make the first link coloured on load, then uncoloured when focus lost
function focusLost() {
    document.getElementById("tabs-list").firstChild.style.backgroundColor = "white";
    document.getElementById("tabs-list").firstChild.style.color = "black";
    document.getElementById("tabs-list").firstChild.style.border = "unset";
}
function focusGained() {
    document.getElementById("tabs-list").firstChild.style.backgroundColor = "white";
    document.getElementById("tabs-list").firstChild.style.color = "black";
    document.getElementById("tabs-list").firstChild.style.border = "4px solid #0060DF";
}

// Make the first link coloured on load, then uncoloured when focus lost
function colourFirst() {
    document.getElementById("tabs-list").firstChild.addEventListener("focusout", focusLost);
    document.getElementById("tabs-list").firstChild.addEventListener("focus", focusGained);
}

function getBookmarks() {
    bookmarksObjects = [];
    function logItems(bookmarkItem) {
        if (bookmarkItem.url) {
            bookmarksObjects.push({
                title: bookmarkItem.title,
                url: bookmarkItem.url
            });

        }
        if (bookmarkItem.children) {
            for (child of bookmarkItem.children) {
                logItems(child);
            }
        }
    }

    function logTree(bookmarkItems) {
        logItems(bookmarkItems[0]);
    }

    browser.bookmarks.getTree(logTree);

    // var gettingTree = browser.bookmarks.getTree();
    // gettingTree.then(logTree);
}

function getTabs() {
    tabsObjects = [];
    browser.tabs.query({}, function (tabs) {
        // browser.tabs.query({}).then((tabs) => {
        for (let tab of tabs) {
            tabsObjects.push({
                title: tab.title,
                url: tab.url,
                id: tab.id,
                winId: tab.windowId
            });
        }
    })
}