const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const database = require('./db.js');


//Can not make [values] statement with sendQuery().
//so let's put connection again until fix:
const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE
});

con.connect(function(err) {
	if (err) throw err;
});


/* post order */
router.post('/new', function(req, res, next) {

	let deadlineDate = req.body.order.deadlineDate;
	let deadlineTime = req.body.order.deadlineTime;
	let clientId = req.body.order.clientId;
	let saved = req.body.order.saved;
	let orderName = req.body.order.orderName;
	let products = req.body.order.products;

	database.sendQuery(`INSERT INTO orders (clientId, deadlineDate, deadlineTime, saved, orderName, createdDate)
    VALUES ('${clientId}', '${deadlineDate}', '${deadlineTime}', '${saved}', '${orderName}', NOW())`,
		function(err, results) {
			if (err) {
				console.log(err);
				return
			} else {
				insertProductsOrder(err, results);
			}
		});

	function insertProductsOrder(err, results) {
		let rowId = results.insertId

		var sql = "INSERT INTO orderedProducts (orderId, productId, quantity) VALUES ?";
		//In order to make multiple query at once, i need to have an array for each
		//product in object products like ['[orderId]', '[product.id]', '[product.quantity]']
		//so :
		let values = [];
		for (let i = 0; i < products.length; i++) {
			let subArray = [];
			subArray.push(rowId, products[i].id, products[i].quantity);
			values.push(subArray);
		}
		con.query(sql, [values], function(err, result) {
			if (err) {
				console.log(err)
				return
			}
			let notifInfo = {
				message: 'Commande effectuée',
				type: 'success'
			}
			res.send(notifInfo)
		});
	};
});


// /* get pending orders WRONG WAY */
// router.get('/', function(req, res, next) {
// 	database.sendQuery(`SELECT
//                             O.status as status,
//                             O.createdDate as createdDate,
//                             O.deadlineDate as Date,
//                             O.deadlineTime as Time,
//                             C.name as clientName,
//                             O.id as OrderId
//                           FROM orders O
//                           LEFT JOIN clients C ON C.id = O.clientId
//                           WHERE O.status NOT IN('done', 'canceled')
//                           ORDER BY createdDate DESC`,
// 		function(err, results) {
// 			if (err) {
// 				console.log(err)
// 			} else {
// 				console.log('store\'s orders updated');
// 				res.json(results)
// 			}
// 		})
// });

// /* get all pendings orders RIGHT WAY*/
router.get('/', function(req, res, next) {
	database.sendQuery(`SELECT
                            O.id,
                            O.status,
                            O.deadlineDate as date,
                            O.deadlineTime as time,
                            O.createdDate,
							C.name as clientName,
                            GROUP_CONCAT(OP.quantity) AS quantity,
                            GROUP_CONCAT(P.name) AS name,
                            GROUP_CONCAT(P.price) AS price
                          FROM orders O
                          LEFT JOIN orderedProducts OP ON O.id = OP.orderId
                          LEFT JOIN products P ON P.id = OP.productId
						  LEFT JOIN clients C ON C.id = O.clientId
						  WHERE O.status NOT IN('done', 'canceled')
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

// /* get all orders */
router.get('/all', function(req, res, next) {
	database.sendQuery(`SELECT
                            O.id,
                            O.status,
                            O.deadlineDate as date,
                            O.deadlineTime as time,
                            O.createdDate,
							C.name as clientName,
                            GROUP_CONCAT(OP.quantity) AS quantity,
                            GROUP_CONCAT(P.name) AS name,
                            GROUP_CONCAT(P.price) AS price
                          FROM orders O
                          LEFT JOIN orderedProducts OP ON O.id = OP.orderId
                          LEFT JOIN products P ON P.id = OP.productId
						  LEFT JOIN clients C ON C.id = O.clientId
						  WHERE MONTH(O.createdDate) = MONTH(CURRENT_DATE())
						  AND YEAR(O.createdDate) = YEAR(CURRENT_DATE())
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

//Edit an order's status from orders board
router.patch('/editStatus/:orderId/:status', function(req, res, next) {
	let orderId = req.params.orderId
    let status = req.params.status
	database.sendQuery(`UPDATE orders SET status = '${status}' WHERE id = '${orderId}'`,
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

/* get an order's details */
router.get('/:orderId', function(req, res, next) {
	let orderId = req.params.orderId
	database.sendQuery(`SELECT
                            O.id,
                            O.status,
                            O.deadlineDate as date,
                            O.deadlineTime as time,
                            O.createdDate,
							C.name as clientName,
                            GROUP_CONCAT(OP.quantity) AS quantity,
                            GROUP_CONCAT(P.name) AS name,
                            GROUP_CONCAT(P.price) AS price
                          FROM orders O
                          LEFT JOIN orderedProducts OP ON O.id = OP.orderId
                          LEFT JOIN products P ON P.id = OP.productId
						  LEFT JOIN clients C ON C.id = O.clientId
						  WHERE O.id LIKE '${orderId}'
                          GROUP BY O.id
                          ORDER BY O.createdDate
                         `,
		function(err, results) {
			if (err) {
				console.log(err)
			} else {
				console.log('orders detail');
				res.json(results)
			}
		})
});


/* change an order's status */
router.patch('/changestatus', function(req, res, next) {

	let orderId = req.body.order.orderId
	let newStatus = req.body.order.newStatus

	database.sendQuery(`UPDATE orders SET status = '${newStatus}' WHERE id = '${orderId}'`,
		function(err, results) {
			if (err) {
				console.log(err)
			} else {
				let notifInfo = {
					message: 'vous avez accepté la commande',
					type: 'success'
				};
				if (newStatus == "done") {
					notifInfo.message = 'vous avez terminé la commande'
				};
				if (newStatus == "canceled") {
					notifInfo.message = 'vous avez annuler la commande'
					notifInfo.type = 'warning'
				}
				res.json(notifInfo);
			}
		})
});


// /* get saved orders */
router.get('/saved/:clientId', function(req, res, next) {
	let clientId = req.params.clientId
	database.sendQuery(`SELECT *
                        FROM orders
                        WHERE saved = 1
                        AND clientId LIKE '${clientId}' `,
		function(err, results) {
			if (err) {
				console.log(err)
			} else {
				res.json(results)
			}
		})
});


/* get orders for one connected client */
router.get('/client/:clientId', function(req, res, next) {
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
                          GROUP BY O.id
                          ORDER BY O.createdDate DESC
                         `,
		function(err, results) {
			if (err) {
				console.log(err)
			} else {
				res.json(results)
			}
		})

});

module.exports = router;
