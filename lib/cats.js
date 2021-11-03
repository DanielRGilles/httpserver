const parserBody = require('./parserBody');
const SimpleDb = require('./simple-db');

const db = new SimpleDb(`${__dirname}/../__tests__/store`);

const catsRouter = {
  async post(req, res) {
    const cat = await parserBody(req);
    // parses data into a json object from req
    await db.save(cat);
    // calls save method from simple db gives cat an id
    const savedCat = await db.get(cat.id);
    // saves cat with id
    res.setHeader('Content-Type', 'application/json');
    // puts header info in res
    res.end(JSON.stringify(savedCat));
    // stringify res of cat object
  },

  async get(req, res) {
    const [, , id] = req.url.split('/');
    // uses array deconstruction to grab id and save without saving the first two index positions
      
    if(id) {
      const cat = await db.get(id);
      // checks if there is an id then calls get method with the id passed in from the previous req.url
      res.statusCode = 200;
      // send success
      res.setHeader('Content-Type', 'application/json');
      // passes header info
      res.end(JSON.stringify(cat));
      // stringy the json
    } else {
      const cats = await db.getAll();
      // if there is no id then it returns all the cats with getAll
      res.statusCode = 200;
      // sends success
      res.setHeader('Content-Type', 'application/json');
      // header info passed
      res.end(JSON.stringify(cats));
      //stringy
    }
  },
  async put(req, res) {
    const [, , id] = req.url.split('/');
    // grabs id from req url
    const cat = await db.get(id);
    // gets object by id and saves to cat
    const updatedCat = await db.update(cat);
    // calls update method from simple db which changes the object
    res.setHeader('Content-Type', 'application/json');
    // puts header info in res
    res.end(JSON.stringify(updatedCat));
    // stringify res of updated cat object
  },
  async delete(req, res) {
    const [, , id] = req.url.split('/');
    // grabs id from req url
    const cat = await db.get(id);
    // gets object by id and saves to cat
    const deletedCat = cat.name;
    // saves the deleted cats name for use in the res message
    await db.delete(cat);
    // calls delete method for cat object
    res.end(`this ${deletedCat} has been deleted`);
    // sends response indicating the cat has been deleted
  }
};

module.exports = catsRouter;
