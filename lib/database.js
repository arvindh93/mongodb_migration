const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient
const url = "mongodb://localhost:27017"

class MongoConn {
  check(callback) {
    mongoClient.connect(url, {useNewUrlParser: true},(err, res) => {
      if (err) {
        callback(new Error("Error in mongo db connection..."));
      } else {
        callback(null)
      }
    })
  }

  insertDocuments(dataToInsert, dbName, collectionName, callback) {
    mongoClient.connect(url, {useNewUrlParser: true}, (err, conn) => {
      if (err) {
        console.log("Error in connecting database")
        callback(new Error("Error in connecting database..."))
      }

      let db = conn.db(dbName)
      db.collection(collectionName).insertMany(dataToInsert, (err, res) => {
        if (err) {
          console.log("Error in inserting records...")
          conn.close()
          process.exit(1)
        }

        conn.close()
        callback(null)
      })
    })
  }
}

module.exports = new MongoConn()
