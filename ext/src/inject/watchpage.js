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

chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            setTimeout(function() {
                // ----------------------------------------------------------
                // This part of the script triggers when page is done loading
                console.log("Hello. This message was sent from scripts/inject.js");
                // ----------------------------------------------------------
                chrome.extension.sendMessage({ action: "setVidIdAndSubCount", vidId: getVidId(), subCount: getSubCount() }, function response() {
                    var observer = new MutationObserver(function(mutations) {
                        views[(new Date()).getTime()] = getViewCount();
                        // console.log(views);
                    });
                    var viewCounter = document.querySelector('span.view-count').childNodes[0];
                    observer.observe(viewCounter, { characterData: true });

                    window.open(document.getElementById('chatframe').src, '_blank');
                });

            }, 3000);
        }

    }, 10);
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "getData") {
            sendResponse({ viewsObject: views });
            views = {};
        }
    }
);