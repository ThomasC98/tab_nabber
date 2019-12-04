Team Name: CHEAT CODE

Team Members: Thomas Clarke, Tamieem Jaffary, Jessica Guan, Mo Jahan

Team Project: Tab Nabber

Welcome to Tab-Nabber!

This extension is to help protect you against malicious website code.

A website may attempt to change page contents once you change tabs in order to
trick you into believe they are another page they weren't before such as a bank
or an email login

This program takes screenshots at regular intervals and compares them when you
return to the tab. In the event there are perceived changes the extension icon
will change colors to alert you to the change.

- Green:     Little to no change detected
- Yellow:    Moderate change detected
- Red:       Extreme change detected

When Yellow or Red are shown click the icon to visit a screen that shows both
photos of the tab and the perceived changes. From there you may determine if those
changes were of a malicious intent and send the URL to our server for further
user warning.

When the program first runs a list is created of all dangerous websites so that
it may warn you in the event one is visited.

Have Fun, Good Luck & Be Safe!


HOW TO RUN LOCAL SERVER:

- A local MYSQL server is required with the following properties
  1. It must run at port 3306
  2. It must be named tab_nabber with a single table called 'websites'
      - This table must have 2 columns named "web_url" & 'unix_time_added'
      - The values of these tables are VARCHAR(512) & INT(11) respectively
  3. This shall be run though user 'root' with a password of 'pass'

- A local Node.js server shall be run using the 'tab_nab_server' folder
  1. Install node if not already installed
  2. Start the server with command: node ./app.js

- Load the unpacked extension into a chrome engine browser and enjoy!
  - Separate the test & server folders from the main tab_nabber folder before loading

If testing is warranted then run a local server of the 'tab_nab_test'
This is an example website that changes data when a user leaves it
