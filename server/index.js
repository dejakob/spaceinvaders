const express = require('express');
const CONFIG = require('./config.json');
const GameController = require('./controllers/game');

const app = express();
app.post('/game', GameController.createGame);
app.get('/game/:id', GameController.getGame);
app.use(express.static('client-screen'));
app.listen(CONFIG.PORT);