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
          console.log("founddddd book");
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

function searchBooksbyID(id) {
  return new Promise((resolve, reject) => {
    const books = [];
    fs.createReadStream('book.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (row.ID === id) {
          console.log("founddddd book");
          books.push({ id: row.ID, title: row.Title,quantity:row.Quantity });
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

function reduceQuantity(id) {
  const filename = 'book.csv';

  // Read the content of the CSV file
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }
    const lines = data.trim().split('\n');

    for (let i = 1; i < lines.length; i++) { 
      const fields = lines[i].split(',');
      if (fields[0] === id) { // Assuming ID is the first field
        // Reduce the quantity by the specified amount
        const newQuantity = parseInt(fields[2]) - 1;
        fields[2] = newQuantity.toString(); // Update the quantity field
        lines[i] = fields.join(','); // Update the line
        break;
      }
    }
    const updatedData = lines.join('\n');

    fs.writeFile(filename, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to the file:', err);
        return;
      }
      console.log('Quantity reduced successfully.');
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

app.get('/catalog/info/:id',async (req, res) => {
  const id = req.params.id;
  console.log(book);

  res.send(`This is the catalog info API endpoint for ID: ${id}`);
});

app.get('/catalog/item/:id',async (req, res) => {
  const id =req.params.id;
  console.log("from itemmmm service from catalog with id: "+id);
  const book=await searchBooksbyID(id);

  res.json(book);

});

app.get('/catalog/reduce/:id',async (req, res) => {
  const id =req.params.id;
  console.log("from itemmmm service from catalog with id: "+id);
  const book=await searchBooksbyID(id);
  reduceQuantity(id);
  res.json(book);

});

app.listen(port, () => {
  console.log(`Catalog server is running at ${port}`);
});
