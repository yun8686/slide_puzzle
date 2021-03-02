import express from 'express';
import * as http from 'http';
import user from './src/api/user';
import game from './src/api/game';

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json());

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 8080;

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(user);
app.use(game);
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
