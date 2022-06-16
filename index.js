const express = require('express');
var cors = require('cors')
const app = express();
const clusters = require('./api/clusters');
const PORT = process.env.PORT || 5050;

app.use(cors())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile('data.json', {
    root: path.join(__dirname, 'public')
  });
})

app.use('/api/clusters', clusters);

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`))