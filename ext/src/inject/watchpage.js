var views = {};

function getVidId() {
    var url = new URL(window.location.href);
    return url.searchParams.get('v');
}

function getSubCount() {
    return document.getElementById('subscribe-button').querySelector('.deemphasize').innerText;
}

function getViewCount() {
    return document.querySelector('span.view-count').innerText.split(" watching now")[0]
}

// Make sure background.js has loaded and is ready to accept messages
chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            // The chat window loads asynchronously, so add a short waiting period before diving in
            setTimeout(function() {
                // ----------------------------------------------------------
                // This part of the script triggers when page is done loading
                console.log("Hello. This message was sent from scripts/inject.js");
                // ----------------------------------------------------------
                // Send sub count information
                chrome.extension.sendMessage({ action: "setSubCount", subCount: getSubCount(), vidId: getVidId() }, function response() {
                    // AFTER background.js has processed sub count, move on to observing the dynamic view count text field
                    var observer = new MutationObserver(function(mutations) {
                        views[(new Date()).getTime()] = getViewCount();
                    });
                    var viewCounter = document.querySelector('span.view-count').childNodes[0];
                    observer.observe(viewCounter, { characterData: true });

                    window.open(document.getElementById('chatframe').src + '#' + getVidId(), '_blank');
                });

            }, 3000);
        }

    }, 10);
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "getData") {
            sendResponse({ viewsObject: views, vidId: getVidId() });
            views = {};
        }
    }
);