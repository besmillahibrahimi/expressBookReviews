const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", async function auth(req,res,next){
    const authToken = req.headers['authorization'] ?? req.headers['Authorization'];
    const token = authToken.startsWith('Bearer ') ? authToken.replace('Bearer ', ''): authToken;

    try {
        const {} = await jwt.verify(token, 'test_secret')
        next();
    }catch(error) {
        res.status(401).send("Please first login.")
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
