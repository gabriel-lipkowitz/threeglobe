const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;

const app = express();

console.log("aaaaaa")
// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static('./models'));
app.use(express.static('./imgs'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});