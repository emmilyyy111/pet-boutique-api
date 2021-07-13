const admin = require('firebase-admin')
const credentials = require('../credentials.json')

function connectDB() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
    })
  }
  return admin.firestore()
}

exports.getCustomers = (request, response) => {
  const db = connectDB()
  db.collection('customers').get()
    .then(customerCollection => {
      const allCustomers = customerCollection.docs.map(doc => {
        let cust = doc.data()
        cust.id = doc.id
        return cust
    })
    response.send(allCustomers)
  })
    .catch(err => {
      console.error(err)
      response.status(500).send(err)
    })
}
exports.getCustomerById = (request, response) => {
  if (!request.params.id) {
    response.status(400).send('No customer specified!')
    return
  }
  const db = connectDB()
  db.collection('customers')
    .doc(request.params.id)
    .get()
    .then(doc => {
      let customer = doc.data()
      customer.id = doc.id
      response.send(customer)
    })
    .catch(err => {
      console.error(err)
      response.status(500).send(err)
    })
}

exports.getCustomerByQuery = (req, res) => {
  // get query from req.query
  const { fname } = req.query
  // connect to firestore
  const db = connectDB()
  // search customers collection based on query
  db.collection('customers')
    .where('firstName', '==', fname)
    .get()
    .then(customerCollection => {
      const matches = customerCollection.docs.map(doc => {
        let customer = doc.data()
        customer.id = doc.id
        return customer
      })
      res.send(matches)
    })
    .catch(err => res.status(500).send(err))
}

// create post to createCustomer
exports.createCustomer = (req, res) => {
  const db = connectDB() // connect to db

  
  db.collection('customers')
    .add(bodyParser.json(req.body))
    .then(docRef => res.send(docRef.id))
    .catch(err => res.status(500).send('Customer could not be created'))
}
// function to delete customer
exports.deleteCustomer = (req, res) => {
  const db = connectDB()
  const { docId } = req.params
  db.collection('customers').doc(docId).delete()
    .then(() => res.status(203).send('Document successfully deleted'))
    .catch(err => res.status(500).send(err))
  
}

exports.updateCustomer = (req, res) => {
  const db = connectDB()
  const { docId } = req.params
  db.collection('customers').doc(docId).update(
    {
      ...req.body, 
    timestamp: admin.firestore.FieldValue.serverTimestamp(), 
    gender: 'female',
    weight: 100
  })
  .then(() => res.status(202).send('Document successfully updated'))
  .catch(err => res.status(500).send(err))
}