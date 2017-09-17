chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            console.log("Hello. This message was sent from scripts/inject.js");
            // ----------------------------------------------------------
            var target = document.getElementById('item-list');
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    console.log(mutation.type);
                });
            });
            var config = { attributes: false, childList: false, characterData: false };
            observer.observe()
        }

    }, 10);
});