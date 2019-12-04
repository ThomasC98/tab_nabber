var currentTab = 0; // base value for current tab in the event tab is refreshed
var currentURL;
var photoInterval;
var photoInProgress = false;
var photoDiff;
var percentChange;
var newerURL = new Map();
var priorURL = new Map();
var contPhoto = true; // boolean on whether or not we continue taking photos
// This is changed to false if the tab name is "Compare Photos" - the compare page

console.log("Tab Nabber Activated");

resemble.outputSettings({
  errorColor: {
    red: 255,
    green: 0,
    blue: 0
  },
  errorType: "movement",
  transparency: 1,
  useCrossOrigin: false,
  outputDiff: true
});

// Takes a photo of the page if it's completed loading
// if not then it waits 3 seconds and then takes a photo
// We then reset the timeout function
chrome.tabs.onActivated.addListener(function(tab) {
  var urlCheckPromise = new Promise(function(resolve, reject) {
    // This query needs to be asynchronus
    chrome.tabs.query({
      'active': true,
      'lastFocusedWindow': true
    }, function(tabs) {
      if (tabs[0].url != undefined) {
        currentURL = tabs[0].url;
        setMalicious(currentURL);
      }
      contPhoto = checkURL(tabs[0].url);
      resolve(contPhoto);
    });
  });

  urlCheckPromise.then(function(value) {
    clearTimeout(photoInterval);
    // console.log("Continue: " + contPhoto);
    if (contPhoto) {
      currentTab = tab.tabId; // changes the global id to the current tabId
      // takes photo of the window and checks it
      takePhoto(currentTab).then(function() {
        // Compare the past 2 photos
        if (priorURL.has(currentTab) && !photoInProgress) {
          comparePhotos(currentTab)
        }
      });

      // Set new interval of photo taking
      photoInterval = setInterval(function() {
        if (contPhoto && currentTab && !photoInProgress) {
          console.log("Cont Photo Taken id: " + currentTab);
          takePhoto(currentTab);
        }
      }, 5000);

    } else {
      console.log("Captures Suspended");
    }
  });
});

// We take a screenshot of the current page
// If the page has already been SC before we put the old photo in a map
// We store the current SC url within a map
function takePhoto(id) {
  photoDiff = null;
  percentChange = 0;
  return new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab(function(scURL) {
      photoInProgress = true;
      if (newerURL.has(id)) {
        priorURL.set(id, newerURL.get(id));
        console.log("Similar: " + (scURL == priorURL.get(id)));
        newerURL.delete(id);
      }
      newerURL.set(id, scURL);
      console.log("New Photo for TabId: " + id);
      resolve(scURL);
      // From here we'd compare the two photos from old and new if prior & new have it
      photoInProgress = false;
    });
  });
}

chrome.browserAction.onClicked.addListener(function() {
  // let keys = Array.from(newerURL.keys());
  //
  // for (var i = 0; i < keys.length; i++) {
  //   console.log(i + ": " + newerURL.get(keys[i]) == priorURL.get(keys[i]));
  // }

  if (percentChange > 7) {
    makeImages();
    contPhoto = true;
    percentChange = null;
  }

});

// checks if the url is an actual one
function checkURL(url) {
  if (url)
    return url.substring(0, 4) == "http";
  else
    return false;
}

function sendMaliciousWarning() {
  alert("WARNING:\nThis website has been known for Tab Nabbing");
}

function setMalicious(currURL) {
  if (maliciousURL.has(currURL)) {
    console.log(currURL);
    if (maliciousURL.get(currURL) == 0) {
      maliciousURL.set(currURL, 1)
      sendMaliciousWarning();
    }
  }
}

function removeTabs() {
  let keys = Array.from(newerURL.keys());
  for (var i = 0; i < keys.legnth; i++) {
    chrome.tabs.get(keys[i], function() {
      callBack(keys[i]);
    });
  }
}

function callback(tabID) {
  if (chrome.runtime.lastError) {
    if (newerURL.has(tabID)) {
      console.log("Tab: " + tabID + " Not found! Deleting...");
      newerURL.remove(tabID);
      priorURL.remove(tabID);
    }
  }
}

function comparePhotos(tabId) {
  resemble(priorURL.get(tabId))
    .compareTo(newerURL.get(tabId))
    .ignoreLess()
    .onComplete(function(data) {
      if (data.misMatchPercentage >= 7) {
        console.log(data.misMatchPercentage);
        contPhoto = false;
        photoDiff = data.getImageDataUrl();
        percentChange = data.misMatchPercentage;
        if (data.misMatchPercentage >= 20) {
          chrome.browserAction.setIcon({
            path: "warn/highWarn.png"
          });
        } else {
          chrome.browserAction.setIcon({
            path: "warn/mediumWarn.png",
          });
        }
      } else {
        chrome.browserAction.setIcon({
          path: "warn/noWarn.png"
        });
      }
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case "compare":
      makeImages();
      break;
  }
});

// Creates an HTML form the user to inspect the two input images
// When clicked the url is sent to the MySQL table
function makeImages() {
  removeTabs();
  if (percentChange != null) {
    var dangerLevel = percentChange;
    var tempTab = currentTab;
    var compareURL = chrome.runtime.getURL('capture.html?id=' + tempTab);

    new Promise((resolve, reject) => {
      chrome.tabs.create({
        url: compareURL
      })
      resolve(compareURL);
    }).then(() => {
      chrome.tabs.onUpdated.addListener(function addPhotos(tabs) {
        var views = chrome.extension.getViews();
        for (var i = 0; i < views.length; i++) {
          var view = views[i];
          if (view.location.href == compareURL) {
            setTimeout(function() {
              if (currentTab != null) {
                currentTab = null;
                chrome.tabs.onUpdated.removeListener(addPhotos);
                console.log(currentURL);
                view.setScreenshotUrl(priorURL.get(tempTab),
                  newerURL.get(tempTab), photoDiff, currentURL);
                view.setDangerLevel(dangerLevel);
              }
            }, 300);
            break;
          }
        }
      });
    })
  }
}
