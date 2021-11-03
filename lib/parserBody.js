const VALID = ['POST', 'PUT', 'PATCH'];
// saves valid types of request methods

const parserBody = async (req) => {
  if  (!VALID.includes(req.method)) return null;
  // checks that the request method is not one of the VALID types, if it isn't then returns null since this promise is for changing or creating data and not just a simple GET
  return new Promise((resolve, reject) => {
    if (req.headers['content-type'] !== 'application/json') {
      // if the object isn't in json then it thows an error
      reject('Content-type must be application/json');
      return;
    }

    let data = '';
    // initializes data
    req.on('data', (chunk) => {
      data += chunk;
      // adds all the chunks to the data object
    });

    req.on('end', async () => {
      try {
        resolve(JSON.parse(data));
        // parses all the data that was put into data
      } catch (err) {
        reject('Bad JSON');
      }
    });
  });
};

module.exports = parserBody;
