const express = require('express')
const cors = require('cors')
const { getCustomers, getCustomerById, getCustomerByQuery, createCustomer } 
    = require('./src/customers') //how to get a function from another directory; an import

const app = express() // initializing our app with express
app.use(cors()) //making app use cors

app.get('/customers/search', getCustomerByQuery)
app.get('/customers/:id', getCustomerById)
app.get('/customers', getCustomers) // telling app to run getCustomers app when you go this route .get gets data
app.post('/customers', createCustomer)

app.listen(3000, () => {
    console.log('Listening to http://localhost:3000')
})