var xmlhttp = new XMLHttpRequest();
var url = "http://localhost:4000/api/malicious";

// Every site gets a warning once unless a malicious site is found
// All sites are reset then
var maliciousURL = new Map();
//
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var myArr = JSON.parse(this.responseText);
    setMaliciousArray(myArr);
  }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

function setMaliciousArray(arr) {
  for (var i in arr) {
    maliciousURL.set(arr[i].web_url, 0);
  }
  console.log(maliciousURL);
}
