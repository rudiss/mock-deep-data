const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');
const json = require('big-json');

const readStream = fs.createReadStream('./data.json');
const parseStream = json.createParseStream();
readStream.pipe(parseStream);


/** 
 * @api {get} /api/security/ Get security data 
 * @apiName GetSecurityData\
 * @apiGroup Security
 * @apiVersion 1.0.0
 * @apiDescription Get security data
 */


router.get('/', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');

    parseStream.on('data', function (pojo) {
      const output = {};
      for (const key in pojo) {
        output[key.replace(/ /g, '_')] = pojo[key];
      }
      res.json({
        status: 200,
        data: [output]
      })
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error")
  }
})

module.exports = router;