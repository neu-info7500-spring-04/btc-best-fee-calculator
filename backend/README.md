# Getting Started with Node Server

In the project backend directory, you can run:

### `node app.js`

Runs the server on PORT 8080 by default.

## Endpoint URL
```javascript
// 1. GET Route to retrieve the transaction info on the last 10 transactions
GET /bitcoin/transactions
```
``
Returns 200 OK with the Transaction data as output.
``
##
```javascript
// 2. GET route to retrieve last 7 days Transaction and Transaction Inputs data
GET /bitcoin/inputs
```
``
Returns 200 OK with Transaction and Transaction Inputs data as output.
``
##