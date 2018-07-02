const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = process.env.PORT || 3010;
const router = express.Router();

const mongoUrl = 'mongodb://localhost:27017';
const databaseName = 'analytics';

let db;

router.route('/track').post((req, res) => {

  if (req.body) {

    const json = ((body) => {

      try {

        return JSON.parse(body);
      } catch (err) {

        return undefined;
      }
    })(req.body);

    if (json) {

      insert(json);
      res.sendStatus(201).end();
    } else {

      res.sendStatus(400).end();
    }
  }
});

router.get('/', (req, res) => {

  res.json({ message: 'Simple Node Analytics API is up and running.' });
});

function insert(data) {

  if (data.project) {
    // Aggregate values per tracking variable
    db.collection(data.project)
      .updateOne(
        {
          key: data.key,
          device: data.device
        },
        {
          $inc: {
            value: data.value
          }
        },
        {
          upsert: true
        },
        () => {
          // Callback
        }
      );
  }
}

// Allow Cross-origin request
app.use((req, res, next) => {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {

    res.sendStatus(200);
  } else {

    next();
  }
});

app.use(bodyParser.text());

app.use('/build', express.static('build'));
app.use('/', router);

MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (error, client) => {

  if (error) { console.error(error); }

  db = client.db(databaseName);

  app.listen(port, () => {

    console.log(`Server is running on ${port}`);
  });
});
