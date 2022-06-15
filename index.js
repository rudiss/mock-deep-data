const express = require('express');
const app = express();
const security = require('./api/security');

const PORT = process.env.PORT || 5050;

app.use('/api/security', security);

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`))