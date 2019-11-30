function grabImages() {
  chrome.runtime.sendMessage({
    type: "compare"
  });
}
document.getElementById("grabImagess")
  .addEventListener("click", grabImages());
