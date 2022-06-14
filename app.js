const express = require('express')
const app = express()
const port = 3030
const fs = require('fs');
const path = require('path');
const json = require('big-json');

const readStream = fs.createReadStream('./data.json');
const parseStream = json.createParseStream();
readStream.pipe(parseStream);

app.get('/', (req, res) => {
  parseStream.on('data', function (pojo) {
    const output = {};
    for (const key in pojo) {
      output[key.replace(/ /g, '_')] = pojo[key];
    }
    res.send([output])
});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
