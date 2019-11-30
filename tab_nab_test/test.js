window.addEventListener("focus", function(event) {
  console.log("Test");
  document.getElementById('kitty').src
  = "https://graphicriver.img.customer.envatousercontent.com/files/270440720/CartoonDogPointer%20p.jpg?auto=compress%2Cformat&q=80&fit=crop&crop=top&max-h=8000&max-w=590&s=d7ccf47eef9f9a8f679c134cc70bffa5";
  document.getElementById('warning').textContent = "Oh no, what did I ask you to do!"
}, false);
