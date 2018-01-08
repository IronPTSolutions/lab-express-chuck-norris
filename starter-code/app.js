const express        = require('express');
const app            = express();

const expressLayouts = require('express-ejs-layouts');
const bodyParser     = require('body-parser');
const path           = require('path');

const Chuck          = require('chucknorris-io');
const client         = new Chuck();

app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.set('layout', 'layout');

app.get("/", (req, res) => {
  res.redirect('/random');
});

app.get('/random', (req, res) => {
  client.getRandomJoke().then((joke) => {
    res.render('random', { joke: joke.value });
  });
});

app.get('/categories', (req, res) => {
  let category = req.query.cat;

  if (category) {
    client.getRandomJoke(category).then(function (joke) {
      res.render('joke-by-category', {
        joke: joke.value,
        category
      });
    });
  } else {
    client.getJokeCategories().then((categories) => {
      res.render('categories', { categories });
    });
  }
});

app.post('/search', (req, res) => {
  let keyword = req.body.keyword;

  client.search(keyword).then((jokes) => {
    let randomIndex = Math.floor(Math.random() * jokes.items.length -1);

    let joke = jokes.items[randomIndex];

    res.render('joke-by-search', {
      joke: joke.value,
      query: keyword
    });
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
