const request = require('supertest');
const { rm, mkdir } = require('fs/promises');
const app = require('../lib/app');
const SimpleDb = require('../lib/simple-db');

const rootDir = `${__dirname}/store`;

describe('cat CRUD API', () => {
  beforeEach(() => {
    return rm(rootDir, { force: true, recursive: true }).then(() => mkdir(rootDir, { recursive: true })
    );
  });
  afterAll(() => {
    return rm(rootDir, { force: true, recursive: true }).then(() => mkdir(rootDir, { recursive: true })
    );
  });

  it('creates a new cat and returns it via POST', async () => {
    const cat = { name: 'winnie', age: 8, weight: '8lbs' };
    const res = await request(app).post('/cats').send(cat);
    
    expect(res.body).toEqual({ ...cat, id: expect.any(String) });
  });

  it('gets a cat by id', async () => {
    const cat = { name: 'winnie', age: 8, weight: '8lbs' };
    const db = new SimpleDb(rootDir);
    await db.save(cat);

    const res = await request(app).get(`/cats/${cat.id}`);
    expect(res.body).toEqual(cat);
  });
  it('gets all cats when no id is specified', async () => {
    const winnie = { name: 'winnie', age: 8, weight: '8lbs' };
    const daisy = { name: 'daisy', age: 12, weight: '10lbs' };
    const skeeter = { name: 'skeeter', age: 4, weight: '9lbs' };

    const db = new SimpleDb(rootDir);

    Promise.all([db.save(winnie), db.save(daisy), db.save(skeeter)]);

    const res = await request(app).get('/cats');

    expect(res.body).toEqual(expect.arrayContaining([winnie, daisy, skeeter]));
  });

  it('gets a cat by id, then updates it and saves it again', async () => {
    const cat = { name: 'winnie', age: 8, weight: '8lbs' };
    //creates cat ojbect
    const db = new SimpleDb(rootDir);
    // creates new instance of simpledb
    await db.save(cat);
    // saves cat object in new Db
    const changedCat = { name: 'winifred', age: 7, weight: '18lbs', id: cat.id };
    await db.update(changedCat);
    const newCat = await request(app).get(`/cats/${changedCat.id}`);
    expect(newCat.body).toEqual(changedCat);
  });
  
  it('gets a cat by id then deletes it', async () => {
    const cat = { name: 'winnie', age: 8, weight: '8lbs' };
    const db = new SimpleDb(rootDir);
    await db.save(cat);
    const savedCat = await db.get(cat.id);
    console.log('line 65', savedCat);
    // logging so that cat object is proven to exist in db
    await db.delete(cat.id);
    const res = await request(app).get(`/cats/${cat.id}`);
    const actual = res.body;
    console.log('line 69', actual);
    // logging so that you can see actual === null and cat is no longer in db
    expect(actual).not.toBe(cat);
  });

});
