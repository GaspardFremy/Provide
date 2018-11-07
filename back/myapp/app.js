var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv').config();
var bodyParser = require('body-parser');
var cron = require('node-cron');
var fs = require('fs');
var axios = require('axios');
const $axios = 'http://localhost:3000';
const hbs = require('handlebars');
const stripe = require('stripe')("sk_test_9E5ektcRmXri0s9wXs2A0qA6");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var ordersRouter = require('./routes/orders');
var invoicesRouter = require('./routes/invoices');


let data = {name:"Le béguin", address:"56 rue de Clichy"};


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/invoices', invoicesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



const charge = stripe.charges.create({
  amount: 999,
  currency: 'usd',
  source: 'tok_visa',
  receipt_email: 'jenny.rosen@example.com',
});


// CODE BELOW GENERATE A PDF FOR EACH INVOICE
// const compile = async function(templateName, data) {
//     const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
//     const html = await fs.readFile(filePath, 'utf-8');
//     console.log(filePath);
//     return hbs.compile(html)(data);
// };
//
// (async function () {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//
//         const content = await compile('invoiceTemplate', data)
//
//         await page.setContent(content);
//         await page.emulateMedia('screen');
//         await page.pdf({
//             path: 'mypdf.pdf',
//             format: 'A4',
//             printBackground: true
//         });
//
//         console.log('done');
//         await browser.close();
//         process.exit();
//
//     } catch (e) {
//         console.log('our error',e);
//     }
// })();

// Cron jobs run the script below every month
cron.schedule("* * 1 * *", function() {
    let totalsOrders = [];
    //Get all clients ID
    axios.get($axios + '/users/clients')
        .then(function (response) {
            let res = response.data
            for (let user in res){
                //Get total price for past month orders for each user
                axios.get($axios + '/invoices/pastMonth/' + res[user]['id'])
                .then(function (response) {
                    userId = res[user]['id'];
                    if (response.data.length === 0) {totalsOrders = [];}
                    else
                    {
                        for (let item of response.data) {
                			item.quantity = item.quantity.split(',')
                			item.price = item.price.split(',')
                			item.total = 0
                			for (var i = 0; i < item.quantity.length; i++) {
                				let quantity = item.quantity[i]
                				let price = item.price[i]
                				item.total += quantity * price
                                totalsOrders.push(item.total)
                			}
                		}
                        let totalMonth = totalsOrders.reduce(function(a, b) { return a + b; }, 0);
                        console.log(userId + ' ordered for ' + totalMonth + ' €');
                        //For each debitor account, create a row in 'invoices'.
                        axios.post($axios + '/invoices/new', {
                            userId: userId,
                            amount: totalMonth
                        })
                        .then(function (response) {
                            console.log('row inserted');
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                    }
                })
                .catch(function (error) {
                // handle error
                console.log(error);
                })
            }
        })
        .catch(function (error) {
        console.log(error);
        })
        .then(function () {
        // always executed
        });
})





module.exports = app;
