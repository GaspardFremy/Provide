const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const database = require('./db.js');


/* POST new user. */
router.post('/new/client', function(req, res, next) {

    let name = req.body.clientInfo.name;
    let legalName = req.body.clientInfo.legalName;
    let siret = req.body.clientInfo.siret;
    let address = req.body.clientInfo.address;
    let phone = req.body.clientInfo.phone;
    let sector = req.body.clientInfo.sector;
    let email = req.body.clientInfo.email;
    let password = req.body.clientInfo.password;
    let storeId = 1;

    database.sendQuery(`SELECT * FROM clients WHERE email LIKE '${email}'`, function (err, result) {
        if (err) {
            console.log(err);
        }else {
            console.log(result);
            if (result.length > 0) {
                let notifInfo = {
                    message : 'l\'adresse mail ' + email + ' existe déjà',
                    type : 'error'
                }
                res.send(notifInfo);
                console.log('client already exist');
            } else {
                console.log('client don\'t exist yet');
                bcrypt.hash(password, 10).then(function(hash){
                    database.sendQuery(
                        `INSERT INTO clients
                            (name,
                            legalName,
                            siret,
                            address,
                            phone,
                            sector,
                            storeId,
                            email,
                            password,
                            createdDate)
                        VALUES
                            ('${name}',
                            '${legalName}',
                            '${siret}',
                            '${address}',
                            '${phone}',
                            '${sector}',
                            '${storeId}',
                            '${email}',
                            '${hash}',
                            NOW())`,
                        function (err, results) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                let notifInfo = {
                                    message : 'le client '+ name + 'a été ajouté avec succès',
                                    type : 'success'
                                }
                                res.send(notifInfo);
                                console.log("client added");
                            }
                        }
                    )
                })
            }
        }
    } )
});


// GET client info given an id
router.get('/client/:clientId', function(req, res, next) {
    let clientId = req.params.clientId
    database.sendQuery(`SELECT * FROM clients WHERE clients.id LIKE '${clientId}'`, function (err, results){
        if(err){
            console.log(err);
        }else {
            res.send(results)
        }
    })
});


/* GET all clients. */
router.get('/clients/', function(req, res, next) {
    database.sendQuery(`SELECT * FROM clients`, function (err, results){
        if(err){
            console.log(err);
        }else {
            res.send(results)
        }
    })

});

/* CONNEXION */
router.post('/connect', function(req, res, next) {

    let email = req.body.connectInfo.email
    let password = req.body.connectInfo.password

    // uncoment when using postman
    // let email = req.body.email
    // let password = req.body.password

    //Check if it is a client, then log. Or if it's an admin, then log.
    database.sendQuery(`SELECT * FROM clients WHERE clients.email LIKE '${email}'` , function(err, results) {
        if (err) {
            console.log(err);
        } else {
            if (results.length > 0){
                bcrypt.compare(password, results[0].password).then(function(result) {
                    if (result == true) {
                        res.json(results)
                    } else {
                        console.log('Mauvais identifiant ou mot de passe');
                        let error = 'Mauvais identifiant ou mot de passe'
                        res.json(error)
                    }
                });
            } else {
                database.sendQuery(`SELECT * FROM stores WHERE stores.email LIKE '${email}'`, function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (results.length > 0){
                            bcrypt.compare(password, results[0].password).then(function(result) {
                                if (result == true) {
                                    res.json(results)
                                } else {
                                    console.log('Mauvais identifiant ou mot de passe');
                                    let error = 'Mauvais identifiant ou mot de passe'
                                    res.json(error)
                                }
                            })
                        } else {
                            console.log('Mauvais identifiant ou mot de passe');
                            let error = 'Mauvais identifiant ou mot de passe'
                            res.json(error)
                        }
                    }
                })
            }
        }
    });

})

module.exports = router;
