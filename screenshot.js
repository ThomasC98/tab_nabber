var testingURL;
var photosSet = false;

function setScreenshotUrl(url1, url2, url3, tabURL) {
  if (photosSet) {
    console.log("Parameters Not Set Corrrectly OR Image Already Set");
    return;
  }
  // console.log(url1 == undefined);
  // console.log(url2 == undefined);
  // console.log(url3);

  console.log("Setting URLS");
  document.getElementById('prior').src = url1;
  document.getElementById('newer').src = url2;
  document.getElementById('diff').src = url3;
  testingURL = tabURL;
  photosSet = true;
}

function setDangerLevel(percent) {
  console.log(percent);
  if (percent >= 20) {
    document.getElementById('title').textContent = "WARNING: Severe Tab Change Detected";
    document.getElementById('title').style.color = "red";
  } else if (percent >= 7) {
    document.getElementById('title').textContent = "WARNING: Minor Tab Change Detected";
    document.getElementById('title').style.color = "#CCCC00";
  } else {
    document.getElementById('title').textContent = "No Tab-Nabbing Detected";
    document.getElementById('title').style.color = "#4C9900";
  }
}

function sendMaliciousIntent() {
  var xmlhttp = new XMLHttpRequest();
  var url = "http://localhost:4000/api/insertURL";
  xmlhttp.open("PUT", url, true);
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xmlhttp.send("url=" + testingURL);
}

document.getElementById("sendURL").onclick = function() {
  if (document.getElementById("malicious").checked) {
    sendMaliciousIntent();
    this.textContent = "URL sent, click here to close";
    var element = document.getElementById("changeChoice");
    element.parentNode.removeChild(element);
    this.addEventListener("click", function() {
      close();
    });
  } else {
    close();
  }
}
