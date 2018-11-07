const express = require('express');
const router = express.Router();
const database = require('./db.js');

/* GET client's orders for current month */
router.get('/currentMonth/:clientId', function(req, res, next) {
    let clientId = req.params.clientId
    let day =
      database.sendQuery(`SELECT
          O.id,
          O.status,
          O.deadlineDate as date,
          O.deadlineTime as time,
          O.createdDate,
          OP.quantity AS quantity,
          P.name AS name,
          P.price AS price
      FROM orders O
      LEFT JOIN orderedProducts OP ON O.id = OP.orderId
      LEFT JOIN products P ON P.id = OP.productId
      WHERE O.clientId LIKE '${clientId}'
      AND MONTH(O.createdDate) = MONTH(CURRENT_DATE())
      AND YEAR(O.createdDate) = YEAR(CURRENT_DATE())
      AND O.status = 'done'
      ORDER BY O.createdDate
                           `,
  		function(err, results) {
  			if (err) {
  				console.log(err)
  			} else {
  				res.json(results)
  			}
  		})
});

/* GET client's orders for current month BY day */
router.get('/currentMonthByDay/:day/:clientId', function(req, res, next) {
    let clientId = req.params.clientId
    let day = req.params.day
      database.sendQuery(`SELECT
          O.id,
          O.status,
          O.deadlineDate as date,
          O.deadlineTime as time,
          O.createdDate,
          OP.quantity AS quantity,
          P.name AS name,
          P.price AS price
      FROM orders O
      LEFT JOIN orderedProducts OP ON O.id = OP.orderId
      LEFT JOIN products P ON P.id = OP.productId
      WHERE O.clientId LIKE '${clientId}'
      AND MONTH(O.createdDate) = MONTH(CURRENT_DATE())
      AND YEAR(O.createdDate) = YEAR(CURRENT_DATE())
      AND DAYOFMONTH(O.createdDate) = '${day}'
      AND O.status = 'done'
      ORDER BY O.createdDate
                           `,
  		function(err, results) {
  			if (err) {
  				console.log(err)
  			} else {
  				res.json(results)
  			}
  		})
});

/* GET client's orders for current year BY month */
router.get('/currentYearByMonth/:month/:clientId', function(req, res, next) {
    let clientId = req.params.clientId
    let month = req.params.month
      database.sendQuery(`SELECT
          O.id,
          O.status,
          O.deadlineDate as date,
          O.deadlineTime as time,
          O.createdDate,
          OP.quantity AS quantity,
          P.name AS name,
          P.price AS price
      FROM orders O
      LEFT JOIN orderedProducts OP ON O.id = OP.orderId
      LEFT JOIN products P ON P.id = OP.productId
      WHERE O.clientId LIKE '${clientId}'
      AND MONTH(O.createdDate) = '${month}'
      AND YEAR(O.createdDate) = YEAR(CURRENT_DATE())
      AND O.status = 'done'
      ORDER BY O.createdDate
                           `,
  		function(err, results) {
  			if (err) {
  				console.log(err)
  			} else {
  				res.json(results)
  			}
  		})
});

// database.sendQuery(`SELECT
//     O.id,
//     O.status,
//     O.deadlineDate as date,
//     O.deadlineTime as time,
//     O.createdDate,
//     OP.quantity AS quantity,
//     P.name AS name,
//     P.price AS price
// FROM orders O
// LEFT JOIN orderedProducts OP ON O.id = OP.orderId
// LEFT JOIN products P ON P.id = OP.productId
// WHERE O.clientId LIKE '${clientId}'
// AND MONTH(O.createdDate) = MONTH(CURRENT_DATE())
// AND YEAR(O.createdDate) = YEAR(CURRENT_DATE())
// GROUP BY O.id
// ORDER BY O.createdDate
//                      `,
//   function(err, results) {
//       if (err) {
//           console.log(err)
//       } else {
//           res.json(results)
//       }
//   })


/* get validated orders for one client in past month */
router.get('/pastMonth/:clientId', function(req, res, next) {
	let clientId = req.params.clientId
	database.sendQuery(`SELECT
                            O.id,
                            O.status,
                            O.deadlineDate as date,
                            O.deadlineTime as time,
                            O.createdDate,
                            GROUP_CONCAT(OP.quantity) AS quantity,
                            GROUP_CONCAT(P.name) AS name,
                            GROUP_CONCAT(P.price) AS price
                          FROM orders O
                          LEFT JOIN orderedProducts OP ON O.id = OP.orderId
                          LEFT JOIN products P ON P.id = OP.productId
                          WHERE O.clientId LIKE '${clientId}'
						  AND O.status LIKE 'done'
                          AND MONTH(O.createdDate) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
                          AND YEAR(O.createdDate) = YEAR(CURRENT_DATE)
                          GROUP BY O.id
                          ORDER BY O.createdDate
                         `,
		function(err, results) {
			if (err) {
				console.log(err)
			} else {
				res.json(results)
			}
		})
});

/* post new invoice */
router.post('/new', function(req, res, next) {
	let userId = req.body.userId;
	let amount = req.body.amount;

	database.sendQuery(`INSERT INTO invoices (clientId, amount, createdDate)
    VALUES ('${userId}', '${amount}', NOW())`,
		function(err, results) {
			if (err) {
				console.log(err);
				return
			} else {
                console.log("insert row done");
			}
		});
});


//check invoice status given a month and a clientId
router.get('/statusByMonth/:month/:clientId', function(req, res, next) {
    let month = req.params.month
	let clientId = req.params.clientId
	database.sendQuery(`SELECT *
                          FROM invoices i
                          WHERE i.clientId LIKE '${clientId}'
                          AND MONTH(i.createdDate) = '${month}'
                          AND YEAR(i.createdDate) = YEAR(CURRENT_DATE)
                         `,
		function(err, results) {
			if (err) {
				console.log(err)
			} else {
				res.json(results)
			}
		})
});


//get all invoices for a given client
router.get('/all/:clientId', function(req, res, next) {
	let clientId = req.params.clientId
	database.sendQuery(`SELECT *
                          FROM invoices i
                          WHERE i.clientId LIKE '${clientId}'
                         `,
		function(err, results) {
			if (err) {
				console.log(err)
			} else {
				res.json(results)
			}
		})
});

//get all invoices for every clients
router.get('/all', function(req, res, next) {
	let clientId = req.params.clientId
	database.sendQuery(`SELECT I.*, C.name as name
                          FROM invoices I
                          LEFT JOIN clients C ON I.clientId = C.id
                          ORDER BY i.createdDate DESC
                         `,
		function(err, results) {
			if (err) {
				console.log(err)
			} else {
				res.json(results)
			}
		})
});


//Edit invoice's status
router.patch('/editStatus/:invoiceId/:status', function(req, res, next) {
	let invoiceId = req.params.invoiceId
    let status = req.params.status
	database.sendQuery(`UPDATE invoices SET status = '${status}' WHERE id = '${invoiceId}'`,
		function(err, results) {
			if (err) {
				console.log(err)
			} else {
                let notifInfo = {
                    message: 'Status de la facture modifié',
                    type: 'success'
                }
                res.json(notifInfo);
			}
		})
});


module.exports = router;
