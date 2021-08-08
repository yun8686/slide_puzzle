import express from 'express';
import * as http from 'http';
import user from './src/api/user';
import game from './src/api/game';
import image from './src/api/image';
import ranking from './src/api/ranking';
import gameview, {gameviewPost} from './src/site/controller/game';
import imageview from './src/site/controller/image';

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json());

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 8080;

app.get('/', (_req, res) => {
  console.log('access to root path', _req.headers['x-forwarded-for']);
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static('public'));
app.use(user);
app.use(game);
app.use(ranking);
app.use(image);

app.set('view engine', 'ejs');
app.set('views', './src/site/views');
app.get('/view/game', gameview);
app.post('/view/game', gameviewPost);
app.use(imageview);

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
