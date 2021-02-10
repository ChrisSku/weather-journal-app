//imports
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

//global variables
const port = 3000
const app = express()

const projectData = {}

//app configuration
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('website'))

/*request-handler configurations
 * Getters */

app.get('/all', (req, res) => {
    res.send(projectData)
})

app.post('/', (req, res) => {
    if (!projectData.data) projectData['data'] = []
    projectData.data.push(req.body)
    res.send(req.body)
})

//start server
app.listen(port, () => console.log(`Server started on port ${port}`))
