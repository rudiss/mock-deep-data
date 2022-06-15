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

  var page = page || 1,
    per_page = per_page || 10,
    offset = (page - 1) * per_page,

    paginatedItems = items.slice(offset).slice(0, per_page),
    total_pages = Math.ceil(items.length / per_page);
  return {
    page: page,
    per_page: per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: (total_pages > page) ? page + 1 : null,
    total: items.length,
    total_pages: total_pages,
    data: paginatedItems
  };
}

router.get('/', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');

    const readStream = fs.createReadStream(`${__dirname}/data.json`);
    const parseStream = json.createParseStream();

    console.log(readStream);
    readStream.pipe(parseStream);

    parseStream.on('data', function (items) {
      res.json({
        status: 200,
        data: paginator(data, req.query.page || 1, req.query.per_page || 10),
      })
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error")
  }
})

module.exports = router;