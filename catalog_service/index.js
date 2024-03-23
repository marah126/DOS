const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const port = 3002;

function searchBooks(topic) {
  return new Promise((resolve, reject) => {
    const books = [];
    fs.createReadStream('book.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (row.Topic === topic) {
          console.log("found book");
          books.push({ id: row.ID, title: row.Title });
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        resolve(books); // Resolve with the result
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error); // Reject in case of an error
      });
  });
}

app.get('/', (req, res) => {
  res.send('Hello from catalog!');
});

app.get('/catalog/search/:type', async (req, res) => {
  const type = req.params.type;
  try {
    const foundbooks = await searchBooks(type);
    if(foundbooks.length==0){
      res.json({message:'No books found for the specified topic'});
    }
    else{
      res.json(foundbooks);
    }
    console.log(foundbooks);
    
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).send('Error searching books');
  }
});

app.get('/catalog/info/:id', (req, res) => {
  const id = req.params.id;
  res.send(`This is the catalog info API endpoint for ID: ${id}`);
});

app.listen(port, () => {
  console.log(`Catalog server is running at ${port}`);
});
