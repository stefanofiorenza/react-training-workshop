var express = require('express');
var React = require('react');
var renderToString = require('react-dom/server').renderToString;

var ReactRouter = require('react-router');
var routes = require('./routes').routes;

var app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('*', function(req, res) {
  // routes is our object of React routes defined above
  ReactRouter.match({
    routes: routes,
    location: req.url
  }, function(err, redirectLocation, props) {
    if (err) {
      // something went badly wrong, so 500 with a message
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      // we matched a ReactRouter redirect, so redirect from the server
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (props) {
      // if we got props, that means we found a valid component to render
      // for the given route
      var markup = renderToString(
        React.createElement(ReactRouter.RouterContext, props, null)
      );

      // render `index.ejs`, but pass in the markup we want it to display
      res.render('index', { markup })

    } else {
      // no route match, so 404. In a real app you might render a custom
      // 404 view here
      res.sendStatus(404);
    }
  });
});

app.listen(3003, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:3003');
});