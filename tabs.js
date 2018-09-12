var resultsTabsList = document.getElementById('tabs-list');
var tabsObjects = [];
var bookmarksObjects = [];

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

function searchResultTabs() {
    // console.log("search working");
    resultsTabsList.textContent = '';

    let tabsTitles = tabsObjects.map(a => a.title);
    let bookmarksTitles = bookmarksObjects.map(a => a.title);
    let allTitles = tabsTitles.concat(bookmarksTitles);

    let searchQuery = document.getElementById("find-input").value;
    let fuzzyResultsAll = fuzzysort.go(searchQuery, allTitles);

    for (i in fuzzyResultsAll) {
        // console.log(i);
        let tabLink = document.createElement('a');

        if (tabsTitles.includes(fuzzyResultsAll[i].target)) {
            // retrieve tab object from tabsObjects with matching title
            var currTab = tabsObjects.filter(obj => obj.title === fuzzyResultsAll[i].target);
            // tabLink.textContent = currTab[0].title || currTab[0].id;
            tabLink.textContent = currTab[0].title.slice(0, 64);
            tabLink.setAttribute('href', currTab[0].id);
            tabLink.setAttribute('window', currTab[0].winId);
            tabLink.classList.add('open-tab-link');
            // console.log(tabLink);
        } else if (bookmarksTitles.includes(fuzzyResultsAll[i].target)) {
            // retrieve bookmark object from bookmarksObjects with matching title
            var currTab = bookmarksObjects.filter(obj => obj.title === fuzzyResultsAll[i].target);
            // tabLink.textContent = currTab[0].title || currTab[0].id;
            tabLink.textContent = currTab[0].title.slice(0, 64);
            tabLink.setAttribute('href', currTab[0].url);
            tabLink.setAttribute('window', currTab[0].winId);
            tabLink.classList.add('bookmark-link');
            // console.log(tabLink);
        } else {
            // console.log("no known tab");
        }

        resultsTabsList.appendChild(tabLink);
        colourFirst();
    }

    // Switch to first item with Enter (ie. don't put <CR> into text box)
    document.getElementById("find-input").onkeydown = function (e) {
        // if (e.keyCode === 13 && document.getElementById("find-input").hasFocus()) {
        if (e.keyCode === 13) {
            e.preventDefault();
            document.getElementById("tabs-list").firstChild.click();
            // Close popup after switching tabs
            window.close();
        }
    }
}

document.addEventListener("DOMContentLoaded", function (e) {

    getTabs();
    getBookmarks();

    // Do this whenever the text box changes
    var input = document.getElementById("find-input");
    if (input != null) {
        input.oninput = searchResultTabs;
        // Focus on the input box on load
        document.getElementById("find-input").focus();
    }

    // Click on link to switch to that tab/window
    document.addEventListener("click", (e) => {
        var openTabId = +e.target.getAttribute('href');
        var winId = +e.target.getAttribute('window');
        var bookmarkUrl = e.originalTarget.href;

        // console.log(openTabId);
        if (Number.isInteger(openTabId)) {
            browser.windows.update(winId, {
                focused: true
            });
            browser.tabs.update(openTabId, {
                active: true
            });
        }
        else {
            browser.tabs.create({ "url": bookmarkUrl });
        }
        e.preventDefault();
    });
});

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
}

function getTabs() {
    tabsObjects = [];
    browser.tabs.query({}, function (tabs) {
        for (let tab of tabs) {
            // console.log(tab.title);
            // console.log(tab.id);
            // console.log(tab.windowId);
            tabsObjects.push({
                title: tab.title,
                url: tab.url,
                id: tab.id,
                winId: tab.windowId
            });
        }
    })
}

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
