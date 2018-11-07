const express = require('express');
const router = express.Router();
const database = require('./db.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
      database.sendQuery(`SELECT * FROM products`, function (err, results) {
          if (err) {
            console.log(err)
          } else {
              res.json(results)
          }
      })
});

router.get('/:category', function(req, res, next) {
    let category = req.params.category
      database.sendQuery(`SELECT * FROM products WHERE category LIKE '${category}'`, function (err, results) {
          if (err) {
            console.log(err)
          } else {
              res.json(results)
          }
      })
});

module.exports = router;
