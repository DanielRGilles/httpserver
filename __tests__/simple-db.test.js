const { rm, mkdir } = require('fs/promises');
const SimpleDb = require('../lib/simple-db');

describe('simple db', () => {
  const rootDir = './__tests__/store';

  beforeEach(async () => {
    await rm(rootDir, { force: true, recursive: true });
    await mkdir(rootDir, { recursive: true });
  });

  it('saved object has id', async () => {
    const db = new SimpleDb(rootDir);
    // initializes instance of db
    const winnie = { name: 'winnie', type: 'mottled' };
    // saves cat object
    await db.save(winnie);
    // makes sure that the db.save adds an id to the object
    expect(winnie.id).toEqual(expect.any(String));
  });

  it('saves and gets an object', async () => {
    const db = new SimpleDb(rootDir);
    // initializes instance of db
    const winnie = { name: 'winnie', type: 'mottled' };
    await db.save(winnie);
    // saves winnie in db
    const gets = await db.get(winnie.id);
    // grabs winnie from db by id and compares
    expect(gets).toEqual(winnie);
  });

  it('returns null for non-existant id', async () => {
    const db = new SimpleDb(rootDir);
    // initializes db
    const gets = await db.get('non-existant');
    expect(gets).toBeNull();
  });

  it('gets all objects', async () => {
    const cats = [
      { name: 'winnie', type: 'mottled' },
      { name: 'garfield', type: 'orange tabby' },
      { name: 'quiby', type: 'shaded' },
    ];

    const db = new SimpleDb(rootDir);

    await Promise.all(cats.map(cat => db.save(cat)));
    // maps through the cats array and saves each one which adds an id
    const gets = await db.getAll();
    // returns all cats and compares to initial array
    expect(gets).toEqual(expect.arrayContaining(cats));
  });

  it('deletes an object', async () => {
    const db = new SimpleDb(rootDir);
    // initializes db
    const winnie = { name: 'winnie', type: 'mottled' };
    // saves winnie
    await db.save(winnie);
    // deletes winnie
    await db.delete(winnie.id);
    // tries to get winnie but she has been del-yeeted
    const gets = await db.get(winnie.id);
    expect(gets).toBeNull();
  });

  it('updates an object', async () => {
    const db = new SimpleDb(rootDir);
    // initializes db
    const winnie = { name: 'winnie', type: 'mottled' };
    // creates obj
    await db.save(winnie);
    // saves winnie
    winnie.type = 'demon';
    // changes winnie type
    await db.update(winnie);
    // calls update method
    // compares winnie with updated winnie to make sure they are equal
    const gets = await db.get(winnie.id);
    expect(gets).toEqual(winnie);
  });

});
