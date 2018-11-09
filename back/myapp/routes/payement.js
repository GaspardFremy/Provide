const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

const express = require('express');
const router = express.Router();
const stripe = require("stripe")(keySecret);
const bodyParser = require("body-parser");
const database = require('./db.js');


// STRIPE PAYEMENT
router.post('/charge', (req, res) => {

    let token = req.body.token;
	let invoiceId = req.body.invoiceId;
    let amount = Math.round(req.body.invoiceAmount);
	let userId =req.body.userId;
    let userEmail = req.body.userEmai;
    let customer = null;

    database.sendQuery(`SELECT * FROM clients WHERE id = '${userId}'`, (err, results) => {
        if (err) {
            console.log('error fetching clients', err)
            return
        }
        customer = results[0].stripe_id
    })
    if (customer == null){
        stripe.customers.create({
        email: userEmail,
        })
        .then((customer) => {
                database.sendQuery(`UPDATE clients SET stripeId = '${customer.id}' WHERE id = ${userId}`, (err, results) => {
                    if (err) {
                        console.log('error in updating stripe user', err)
                        return
                    }
                })
                return stripe.customers.createSource(customer.id, {
                    source: 'tok_visa'
                })
            })
        .then(source =>
            stripe.charges.create({
                amount,
                description: "Paiment de la facture",
                currency: "eur",
                customer: source.customer
            })
        )
        .then((charge) => {
            if (charge.status == 'succeeded') {
                database.sendQuery(`UPDATE invoices SET status = 1 WHERE id = ${invoiceId}`, (err, results) => {
                    if (err) {
                        console.error('error in invoice validation', err)
                        return
                    }
                    else {
                        console.log('payement succeeded');
                        res.json(charge.status)
                    }
                })
            }
        })
        .catch(err => {
            console.log("Error:", err);
            res.status(500).send({error: "Purchase Failed"});
        })

        }
        else {
            stripe.customers.createSource(customer, {
               source: token
           }).then(source => {
               stripe.charges.create({
                   amount,
                   currency: 'eur',
                   description: 'Paiment de la facture',
                   customer: source.customer
               })
               .then((charge) => {
                   if (charge.status == 'succeeded') {
                       database.sendQuery(`UPDATE invoices SET status = 1 WHERE id = ${invoiceId}`, (err, results) => {
                           if (err) {
                               console.error('error in invoice validation', err)
                           }
                           else {
                               console.log('payement succeeded');
                           }
                       })
                   }
                   res.json(charge.status)
               })
               .catch(e => {
                   console.error('error', e)
               })
           })
        }
 });




module.exports = router;
