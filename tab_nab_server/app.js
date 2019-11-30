const express = require('express');
// const bodyparser = require('body-parser');
const mysql = require('mysql');
var app = express();

var table = [];

app.use(express.urlencoded());

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pass',
  database: 'tab_nabber'
});

con.connect((err) => {
  if (err)
    console.log("Failed Connection");
  else
    console.log("Successful Connection!");
});


app.get('/api/malicious', (req, res) => {
  console.log("Grabbing From Server");
  con.query("SELECT * FROM tab_nabber.websites;", function(err, result) {
    if (err) throw err;

    for (var i in result) {
      table.push(result[i].web_url);
    }

    res.send(result);
  });
});

app.put('/api/insertURL', (req, res) => {
  console.log("Sending to Server: " + req.body.url);
  addURL(req.body.url);
});

var server = app.listen(4000, () => {
  console.log('Server is running.. on Port 4000');
});

//  INSERT INTO `tab_nabber`.`websites` (`web_url`, `unix_time_added`) VALUES ('https://test.google.com/', '1234343433')
function addURL(url) {
  if (!(table.includes(url))) {
    var query = "INSERT INTO `tab_nabber`.`websites`(`web_url`, `unix_time_added`) VALUES ('" + url + "', '" + Math.floor(Date.now() / 1000) + "');";
    console.log("Sent To Server: " + url);
    con.query(query, function(err, result) {
      if (err) throw err;
    });
  }
  else {
    console.log("URL already in server");
  }
}
