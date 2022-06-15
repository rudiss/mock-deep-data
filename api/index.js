
const app = require('express')();
const port = 3030
const fs = require('fs');
const path = require('path');
const json = require('big-json');

const readStream = fs.createReadStream('./data.json');
const parseStream = json.createParseStream();
readStream.pipe(parseStream);

app.get('/api', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  parseStream.on('data', function (pojo) {
    const output = {};
    for (const key in pojo) {
      output[key.replace(/ /g, '_')] = pojo[key];
    }
    res.json([output])
});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;