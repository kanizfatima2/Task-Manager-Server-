const express = require('express');
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

//middleware
app.use(cors())
app.use(express.json())

// console.log(process.env.DB_USER, process.env.PASSWORD)

//Mongodb connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.t3dzelv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
//database Connection
if (uri) {
    console.log('Database Connected')
}

async function run() {
    const New_Task = client.db('TaskManager').collection('AddTask')
    try {

        // Add task 
        app.post('/addTask', async (req, res) => {
            const result = await New_Task.insertOne(req.body)
            if (result.insertedId) {
                res.send({
                    success: true,
                    message: 'Successfully Added Your Task!!'
                })
            }
            else {
                res.send({
                    success: false,
                    error: 'Your Attempt is failed!'
                })
            }
        })

        //Get all Task By Email Id
        app.get('/addTask', async (req, res) => {
            let query = {};


            try {
                if (req.query.email) {
                    query = {
                        email: req.query.email
                    }
                }

                const cursor = New_Task.find(query);
                const allTask = await cursor.toArray();
                res.send({
                    success: true,
                    message: 'Successfully read all Task',
                    data: allTask
                })
            }
            catch (error) {
                console.log(error.message);
                res.send({
                    success: false,
                    error: error.message
                })
            }

        })

        //Delete Task
        app.delete('/addTask/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const task = await New_Task.findOne({ _id: ObjectId(id) })

                //task does not exist
                if (!task?._id) {
                    res.send({
                        success: false,
                        error: "No task",
                    });
                    return;
                }

                //Task Exist
                const result = await New_Task.deleteOne({ _id: ObjectId(id) });

                if (result.deletedCount) {
                    res.send({
                        success: true,
                        message: `Successfully deleted the task!`,
                    });
                }
            }

            catch (error) {
                res.send({
                    success: false,
                    error: error.message,
                });
            }
        })

    }

    finally {

    }
}
run().catch(err => console.error(err.message))


app.get('/', (req, res) => {
    res.send('Task manager Server is running')
})

app.listen(port, (req, res) => {
    console.log('listening to port ', port)
})