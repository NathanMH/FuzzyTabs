// window.browser = (function () {
//     return window.msBrowser ||
//         window.browser ||
//         window.chrome;
// })();

function updateCount(tabId, isOnRemoved) {
    let badgeOption = false;
    browser.tabs.query({}, function (tabs) {
        // browser.tabs.query({}).then((tabs) => {
        let length = tabs.length;

        if (badgeOption) {
            // onRemoved fires too early and the count is one too many.
            // see https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
            if (isOnRemoved && tabId && tabs.map((t) => { return t.id; }).includes(tabId)) {
                length--;
            }

            browser.browserAction.setBadgeText({ text: length.toString() });
            if (length > 2) {
                browser.browserAction.setBadgeBackgroundColor({ 'color': 'green' });
            } else {
                browser.browserAction.setBadgeBackgroundColor({ 'color': 'red' });
            }
        }
    });
}

// browser.tabs.onRemoved.addListener(
//     (tabId) => {
//         updateCount(tabId, true);
//     });
// browser.tabs.onCreated.addListener(
//     (tabId) => {
//         updateCount(tabId, false);
//     });
// updateCount();