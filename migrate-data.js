const async = require('async')
const db = require("./lib/database.js")

const cust = require('./data/m3-customer-data.json')
const custAddr = require('./data/m3-customer-address-data.json')

let batchSize = process.argv[2]

if (typeof batchSize == "undefined") {
  console.log("No argument passed...")
  process.exit(1);
}

if (batchSize > cust.length) {
  console.log("Batch size passed must be lesser than total data count...")
  process.exit(1)
}

//Mongo db check
db.check((err) => {
  if (err) {
    console.log("Error in connecting mongodb...")
    process.exit(1)
  }

  let totalBatches = Math.ceil(cust.length / batchSize);

  let asyncTasks = []
  for (let i = 0; i < totalBatches; i++) {
    let batchStartIndex = i * batchSize;
    let batchEndIndex = (batchStartIndex + parseInt(batchSize) - 1)
    let dataToInsert = []

    for (let j = batchStartIndex; j < batchEndIndex; j++) {
      let customerData = {}
      Object.assign(customerData, cust[j], custAddr[j])
      dataToInsert.push(customerData)
    }

    asyncTasks.push(() => {
      console.log("Processing batch from " + batchStartIndex + " to  " + batchEndIndex)
      db.insertDocuments(dataToInsert, "edx-nodejs", "customers", (err, res) => {
        if (err) {
          console.log("error in inserting documents")
        }
      })
    })
  }

  console.log("Starting migration...")
  async.parallel(asyncTasks, (err, result) => {
    if (err) {
      console.log("Error in running async tasks...")
    }
    if (result) {
      console.log("Completed inserting data...")
      process.exit(1)
    }
  })
 })
