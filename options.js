function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        bookmarkBackgroundColor: document.querySelector("#bookmarkBackgroundColor").value,
        bookmarkTextColor: document.querySelector("#bookmarkTextColor").value,
        // bookmarkBorderColor: document.querySelector("#bookmarkBorderColor").value,

        openTabsBackgroundColor: document.querySelector("#openTabsBackgroundColor").value,
        openTabsTextColor: document.querySelector("#openTabsTextColor").value,
        // openTabsBorderColor: document.querySelector("#openTabsBorderColor").value,

        focusItemBackgroundColor: document.querySelector("#focusItemBackgroundColor").value,
        focusItemBorderColor: document.querySelector("#focusItemBorderColor").value,
        focusItemTextColor: document.querySelector("#focusItemTextColor").value,

        scoreThreshold: document.querySelector("#scoreThreshold").value
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#bookmarkBackgroundColor").value = result.bookmarkBackgroundColor || "#CEE5F8";
        document.querySelector("#bookmarkTextColor").value = result.bookmarkTextColor || "black";
        // document.querySelector("#bookmarkBorderColor").value = result.bookmarkBorderColor || "#0060DF";

        document.querySelector("#openTabsBackgroundColor").value = result.openTabsBackgroundColor || "white";
        document.querySelector("#openTabsTextColor").value = result.openTabsTextColor || "black";
        // document.querySelector("#openTabsBorderColor").value = result.openTabsBorderColor || "#0060DF";

        document.querySelector("#focusItemBackgroundColor").value = result.focusItemBackgroundColor || "white";
        document.querySelector("#focusItemTextColor").value = result.focusItemTextColor || "black";
        document.querySelector("#focusItemBorderColor").value = result.focusItemBorderColor || "#0060DF";

        document.querySelector("#scoreThreshold").value = result.scoreThreshold || "5000";
    }

    var getting = browser.storage.sync.get([
        "bookmarkBackgroundColor",
        "bookmarkTextColor",
        // "bookmarkBorderColor",

        "openTabsBackgroundColor",
        "openTabsTextColor",
        // "openTabsBorderColor"

        "focusItemBackgroundColor",
        "focusItemTextColor",
        "focusItemBorderColor",

        "scoreThreshold"
    ]);
    getting.then(setCurrentChoice);

}

function resetOptions() {

    document.querySelector("#bookmarkBackgroundColor").value = "#CEE5F8";
    document.querySelector("#bookmarkTextColor").value = "black";
    // document.querySelector("#bookmarkBorderColor").value = "#0060DF";

    document.querySelector("#openTabsBackgroundColor").value = "white";
    document.querySelector("#openTabsTextColor").value = "black";
    // document.querySelector("#openTabsBorderColor").value = "#0060DF";

    document.querySelector("#focusItemBackgroundColor").value = "white";
    document.querySelector("#focusItemTextColor").value = "black";
    document.querySelector("#focusItemBorderColor").value = "#0060DF";

    document.querySelector("#scoreThreshold").value = "5000";

    browser.storage.sync.set({
        bookmarkBackgroundColor: "#CEE5F8",
        bookmarkTextColor: "black",
        // bookmarkBorderColor: "#0060DF",

        openTabsBackgroundColor: "white",
        openTabsTextColor: "black",
        // openTabsBorderColor: "#0060DF"

        focusItemBackgroundColor: "white",
        focusItemTextColor: "black",
        focusItemBorderColor: "#0060DF",

        scoreThreshold: "5000"
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("reset").addEventListener("click", resetOptions);

// Threshold for fuzzy matching
function update() {
    textInput.value = this.value;
}
var textInput = document.getElementById("scoreThreshold");
var rangeInput = document.getElementById("rangeInput");
rangeInput.addEventListener('change', update);
update.call(rangeInput); // first run
