const catsRouter = require('./cats');
// creates object map for each route
const routes = {
  cats: catsRouter,
};

const app = async (req, res) => {
// deconstructs array w/o saving first index position and splits on /
  const [, resource] = req.url.split('/');
  // saves route to the endpoint /cats saved as cats
  const route = routes[resource];

  if (route) {
    try {
    // takes the method like POST and makes lower case so that it will call the post() method in catsRouter
      const routeHandlerFunc = route[req.method.toLowerCase()];
      await routeHandlerFunc(req, res);
    } catch (err) {
    // throws an error if the try fails
      console.error(err);
      res.statusCode = 500;
      res.end(err.message);
    }


  } else { res.statusCode = 404;
    res.end('Not found');
  }
};
module.exports = app;
