const parserBody = require('./parserBody');
const SimpleDb = require('./simple-db');

const db = new SimpleDb(`${__dirname}/../__tests__/store`);

const catsRouter = {
  async post(req, res) {
    const cat = await parserBody(req);
    await db.save(cat);
    const savedCat = await db.get(cat.id);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(savedCat));
  },

  async get(req, res) {
    const [, , id] = req.url.split('/');
      
    if(id) {
      const cat = await db.get(id);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(cat));
    } else {
      const cats = await db.getAll();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(cats));
    }
  },

};

module.exports = catsRouter;
