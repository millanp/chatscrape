// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts

var watchTabIds = [],
    chatTabIds = [];
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "setSubCount") {
            chrome.tabs.getSelected(null, function(tab) {
                watchTabIds.push(tab.id);
                subCount = request.subCount;
                dlSubCount(subCount, request.vidId);
                alert(watchTabIds);
            });
        }
        if (request.action == "setChatTabId") {
            chrome.tabs.getSelected(null, function(tab) {
                chatTabIds.push(tab.id);
            });
        }
        // var downloadUrl = "data:,";
        // downloadUrl += encodeURIComponent(request.urlList);
        // chrome.downloads.download({
        //     url: downloadUrl,
        //     filename: request.name
        // })
    }
);

function dlSubCount(subCount, vidId) {
    chrome.downloads.download({
        url: "data:," + subCount,
        filename: vidId + "-subs-" + (new Date()).getTime()
    });
}

var clockOn = true;
var writeIntervalMillis = 10 * 1000;
var downloadClock;

function startClock() {
    downloadClock = setInterval(function() {
        var time = (new Date()).getTime();
        chatTabIds.forEach(function(chatTabId) {
            chrome.tabs.sendMessage(chatTabId, { action: "getData" }, (function(currentTime) {
                return function(response) {
                    var chats = response.chatsObject;
                    var fileName = response.vidId + "-chat-" + currentTime;
                    var downloadUrl = "data:," + encodeURIComponent(JSON.stringify(chats));
                    chrome.downloads.download({
                        url: downloadUrl,
                        filename: fileName
                    });
                }
            })(time));
        })
        watchTabIds.forEach(function(watchTabId) {
            chrome.tabs.sendMessage(watchTabId, { action: "getData" }, (function(currentTime) {
                return function(response) {
                    var views = response.viewsObject;
                    var fileName = response.vidId + "-views-" + currentTime;
                    var downloadUrl = "data:," + encodeURIComponent(JSON.stringify(views));
                    chrome.downloads.download({
                        url: downloadUrl,
                        filename: fileName
                    });
                }
            })(time));
        });

    }, writeIntervalMillis)
}

startClock();

chrome.browserAction.onClicked.addListener(function() {
    if (clockOn) {
        clearInterval(downloadClock);
        chrome.browserAction.setIcon({ path: '/icons/redcircle.png' });
    } else {
        startClock();
        chrome.browserAction.setIcon({ path: '/icons/greencircle.png' });
    }
    clockOn = !clockOn;
});