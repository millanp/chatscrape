var chats = {};

function getFilename() {
    var vidId = window.URL
}

function getVidId() {
    return window.location.hash;
}

function getUsernameAndContent(newNode) {
    return {
        user: newNode.querySelector('#author-name').innerText,
        text: newNode.querySelector('#message').innerText
    }
}
chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            chrome.extension.sendMessage({ action: "setChatTabId" }, function response() {});
            setTimeout(function() {
                // ----------------------------------------------------------
                // This part of the script triggers when page is done loading
                console.log("Hello. This message was sent from scripts/inject.js");
                // ----------------------------------------------------------
                var observer = new MutationObserver(function(mutations) {
                    console.log('chat added');
                    var newNode = mutations[0].addedNodes[0];
                    console.log(newNode);
                    chats[(new Date()).getTime()] = getUsernameAndContent(newNode);
                });
                var items = document.getElementById('item-offset').children[0];
                observer.observe(items, { childList: true });
            }, 3000);
        }

    }, 10);
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "getData") {
            sendResponse({ chatsObject: chats, vidId: getVidId() });
            chats = {};
        }
    }
);