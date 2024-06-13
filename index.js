// 시작점
// express를 다운받았기 때문에 가져올 수 있음
const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')

const dbURI = 'mongodb+srv://bbeenn97:asdf1997%21%21@reactclusterhws.id7yacl.mongodb.net/?retryWrites=true&w=majority&appName=ReactClusterHWS'

mongoose.connect(dbURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected..'))
.catch(err => console.error('MongoDB Connection Error:', err))


app.get('/', (req, res) => {
  res.send('ㅎㅇㅎㅇ 반가워')

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

