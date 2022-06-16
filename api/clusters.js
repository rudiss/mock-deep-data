const express = require('express');
const router = express.Router();

const fs = require('fs');

const json = require('big-json');
const data = require('./data.json');


/**
 * @api {get} /api/security/ Get security data
 * @apiName GetSecurityData\
 * @apiGroup Security
 * @apiVersion 1.0.0
 * @apiDescription Get security data
 */



const paginator = (items, page, per_page) => {
  let formattedData = []

  var page = page || 1,
    per_page = per_page || 50,
    offset = (page - 1) * per_page,

    paginatedItems = items.slice(offset).slice(0, per_page),
    total_pages = Math.ceil(items.length / per_page);


  for (const key in paginatedItems) {

    console.log(paginatedItems[key], '\n');


    output = {};
    const items = Object.keys(paginatedItems[key]).forEach((mapKey, index) => {
      output[mapKey.replace(/ /g, '_').toLowerCase()] = Object.values(paginatedItems[key])[index]
    })
    formattedData.push(output);
  }

  return {
    page: page,
    per_page: per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: (total_pages > page) ? page + 1 : null,
    total: items.length,
    total_pages: total_pages,
    data: formattedData
  };
}

router.get('/', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');

    const readStream = fs.createReadStream(`${__dirname}/data.json`);
    const parseStream = json.createParseStream();


    readStream.pipe(parseStream);

    parseStream.on('data', function (items) {
      res.json({
        status: 200,
        data: paginator(data, req.query.page || 1, req.query.per_page || 50),
      })
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error")
  }
})

module.exports = router;