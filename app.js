const express = require('express');
const app = express();
const port = 13635;


// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set the public directory for static assets
app.use(express.static('public'));


// Define routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/forecast', (req, res) => {
    res.render('forecast');
});

app.get('/report', (req, res) => {
    res.render('report');
});

app.get('/stats', (req, res) => {
  res.render('stats');
});


app.get('/standard_conditions', (req, res) => {
  res.render('std');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
