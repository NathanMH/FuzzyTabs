var resultsTabsList = document.getElementById('tabs-list');
var tabsObjects = [];

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

function setOptions(result) {
    bookmarkBackgroundColor = result.bookmarkBackgroundColor;
    bookmarkTextColor = result.bookmarkTextColor;
    // bookmarkBorderColor = result.bookmarkBorderColor;

    openTabsBackgroundColor = result.openTabsBackgroundColor;
    openTabsTextColor = result.openTabsTextColor;
    // openTabsBorderColor = result.openTabsBorderColor;

    focusItemBackgroundColor = result.focusItemBackgroundColor;
    focusItemTextColor = result.focusItemTextColor;
    focusItemBorderColor = result.focusItemBorderColor;

    scoreThreshold = result.scoreThreshold;
}

var getting = browser.storage.sync.get([
    "bookmarkBackgroundColor",
    "bookmarkTextColor",
    // "bookmarkBorderColor",

    "openTabsBackgroundColor",
    "openTabsTextColor",
    // "openTabsBorderColor",

    "focusItemBackgroundColor",
    "focusItemTextColor",
    "focusItemBorderColor",
    "scoreThreshold"
]);

getting.then(setOptions);

function searchResultTabs() {

    resultsTabsList.textContent = '';
    let searchQuery = document.getElementById("find-input").value;

    // Get matching tabs TODO Add option to customize threshold for scores
    console.log(scoreThreshold);
    fuzzyResultsAll = fuzzysort.go(searchQuery, tabsObjects.map(a => a.title), { threshold: scoreThreshold });

    tabLink = document.createElement('a');

    for (i in fuzzyResultsAll) {
        currentTab = tabsObjects[tabsObjects.findIndex(x => x.title === fuzzyResultsAll[i].target)];

        let link = new TabLink(currentTab);
        tabLink = link.getLink();

        // console.log(tabLink)
        resultsTabsList.appendChild(tabLink);
    }

    // Switch to first item with Enter (ie. don't put <CR> into text box)
    document.getElementById("find-input").onkeydown = function (e) {
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
    function logItems(bookmarkItem) {
        if (bookmarkItem.url) {
            tabsObjects.push({
                title: bookmarkItem.title,
                url: bookmarkItem.url,
                bookmark: 1
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
            // console.log(tab.title + " : "  + tab.id + " : " + tab.windowId);
            tabsObjects.push({
                title: tab.title,
                url: tab.url,
                id: tab.id,
                winId: tab.windowId,
                bookmark: 0
            });
        }
    })
}

function focusItem() {
    this.style.backgroundColor = focusItemBackgroundColor;
    this.style.color = focusItemTextColor;
    this.style.border = "4px solid " + focusItemBorderColor;
}

function restoreBookmark() {
    this.style.backgroundColor = bookmarkBackgroundColor;
    this.style.color = bookmarkTextColor;
    this.style.border = "";
}

function restoreOpenTab() {
    this.style.backgroundColor = openTabsBackgroundColor;
    this.style.color = openTabsTextColor;
    this.style.border = "";
}

class TabLink {

    constructor(tabObject) {
        this.link = document.createElement('a');

        if (tabObject.bookmark) {

            this.link.classList.add('bookmark-link');
            this.link.textContent = tabObject.title.slice(0, 64);
            this.link.setAttribute('href', tabObject.url);
            this.link.setAttribute('window', tabObject.winId);

            this.link.style.backgroundColor = bookmarkBackgroundColor;
            this.link.style.color = bookmarkTextColor;
            this.link.onmouseenter = focusItem;
            this.link.onfocus = focusItem;
            this.link.onmouseleave = restoreBookmark;
            this.link.onblur = restoreBookmark
            // console.log(this.link);

        } else if (!tabObject.bookmark) {

            this.link.classList.add('open-tab-link')
            this.link.textContent = tabObject.title.slice(0, 64);
            this.link.setAttribute('href', tabObject.id);
            this.link.setAttribute('window', tabObject.winId);

            this.link.style.backgroundColor = openTabsBackgroundColor;
            this.link.style.color = openTabsTextColor;
            this.link.onmouseenter = focusItem;
            this.link.onfocus = focusItem;
            this.link.onmouseleave = restoreOpenTab;
            this.link.onblur = restoreOpenTab;
        }
    }
    getLink() {
        return this.link;
    }
}