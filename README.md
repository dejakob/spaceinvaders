# spaceinvaders
<h2>About</h2>
<p>
  This repository contains all the source code of my spaceinvaders experiment.
  It's a multiplayer game that can be controlled by fysically moving a smartphone.
  This project was made especially for the Annual Belgian SFHTML Meeting of 2015.
  (http://www.meetup.com/sfhtml5/events/219966697)
</p>

<h2>How to install</h2>
<ol>
  <li>Download and install couchdb (http://couchdb.apache.org/)</li>
  <li>Clone this repository</li>
  <li>Register Twitter app (http://apps.twitter.com)</li>
  <li>Add passwords file (server/SECRET.js)
      <div><code>
        GLOBAL.TWITTER_CONSUMER_KEY = '';
        GLOBAL.TWITTER_CONSUMER_SECRET = '';
      </code></div>
  </li>
  <li>Run the install script
      <div>
        <code>
          nodejs install.js
        </code>
      </div>
      <div>or</div>
      <div>
        <code>
          node install.js
        </code>
      </div>      
  </li>
  <li>Start the server
    <div>
        <code>
          nodejs .
        </code>
      </div>
      <div>or</div>
      <div>
        <code>
          node .
        </code>
      </div>   
  </li>
  <li>Spread the love!</li>
</ol>
