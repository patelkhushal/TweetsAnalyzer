const port = 0;
// const home = '/eecs/home/york18';
const home = '/Users/patelkhushalibm.com'
const DB_PATH = home + '/4413/pkg/sqlite/Models_R_US.db';

const net = require('net');
const https = require('https');
const express = require('express');
const session = require('express-session');

var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(DB_PATH);
app.enable('trust proxy');

// const cors = require('cors');
// app.use(cors({
//     origin: [
//         "http://localhost:4200"
//     ], credentials: true
// }));

app.use(session(
    {
        secret: "mine",
        proxy: true,
        resave: true,
        saveUninitialized: true
    }));

app.use('/static', express.static('static'))

app.use('/list', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    let id = req.query.id;
    let query = "select id, name from product where catId = ?";
    db.all(query, [id], (err, rows) => {
        if (err) res.end("Error " + err)
        else res.json(rows)
    });
});

app.use("/cart", (req, res) => {
    // res.set('Content-Type', 'text/plain' );
    res.set("Access-Control-Allow-Origin", "http://localhost:4200");
    res.set("Access-Control-Allow-Credentials", true);
    // res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    // res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    if (!req.session.cart) {
        req.session.cart = [];
        if (req.query.item != null && JSON.parse(req.query.item).qty > 0) req.session.cart.push(JSON.parse(req.query.item))
    }
    else {
        let cart = req.session.cart;
        if (!req.query.item) { } //do nothing
        else if (JSON.parse(req.query.item).qty <= 0) {
            let json_req = JSON.parse(req.query.item);
            for (i = cart.length - 1; i >= 0; --i) {
                if (cart[i].id == json_req.id) {
                    cart.splice(i, 1);
                }
            }
        }
        else {
            let json_req = JSON.parse(req.query.item);
            let exists = false;
            cart.forEach(element => {
                if (element.id == json_req.id) {
                    exists = true;
                    element.qty = element.qty + json_req.qty
                }
            });
            if (!exists) req.session.cart.push(JSON.parse(req.query.item))
        }
    }
    res.json(req.session.cart)
});

app.use("/Catalog", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.query.id) {
        let id = req.query.id;
        let query = "select id, name from category where id = ?";
        db.all(query, [id], (err, rows) => {
            if (err) res.end("Error " + err)
            else res.json(rows)
        });
    }
    else {
        let query = "select id, name from category";
        db.all(query, (err, rows) => {
            if (err) res.end("Error " + err)
            else res.json(rows)
        });
    }
});

app.use("/Quote", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    let id = req.query.id
    let query = "select id, name, msrp from Product where id = ?";
    db.all(query, [id], (err, rows) => {
        if (err) res.end("Error " + err)
        else res.json(rows)
    });
});

// app.use('/Quote', function (req, res) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     let id = req.query.id;
//     var fs = require('fs')
//     filename = home + "/4413/ctrl/Quote.txt";
//     fs.readFile(filename, 'utf8', function (err, data) {
//         let ip; let port;
//         let response = "";
//         if (err) return callback(err);
//         let r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+\b/;
//         let t = data.match(r);
//         let tokens = t[0].split(":");
//         ip = tokens[0]
//         port = tokens[1]

//         var s = require('net').Socket();
//         s.connect(port, ip);
//         s.write(id.toString() + " json" + "\n");

//         s.on('data', function (d) {
//             response = d.toString();
//             s.destroy();
//             res.json(JSON.parse(response))
//         });
//     });
// });


// --------------------------------------SERVER
var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%d', host, port);
});