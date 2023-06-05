const express = require('express');
const app = express();
const port = 3000;
const nano = require('nano')('http://admin:admin@localhost:5984');
const db = nano.db.use('projektarbeit-rezepte');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    let response;
    if (search) {
      response = await db.search('projektarbeit-rezepte', 'projektarbeit-rezepte', { q: search, include_docs: true });
    } else {
      response = await db.list({ include_docs: true });
    }

    //Alle Json-Dateien einfügen. Auskommentiert, weil die Jsons sonst immer wieder eingefügt werden würden!
    //insertRezepte();
    
    const docs = response.rows.map(row => row.doc);
    const tableRows = docs.map(doc => {
      if (doc._id.startsWith("_")) 
        return;

      return `<tr>
                <td>${doc.Rezeptname}</td>
                <td>${doc.Rezeptkategorie}</td>
                <td>${doc.Anleitung}</td>
                <td>${doc.Kommentar}</td>
                <td>${doc.Bewertung}</td>
                <td>${doc.Zeitaufwand}</td>
                <td>${doc.Herkunft}</td>
                <td><img src="${doc.Bild}"></td>
              </tr>`
    }).join('');

    const searchForm = `
      <form method="GET" action="/">
        <label for="search">Search:</label>
        <input type="text" name="search" id="search">
        <button type="submit">Submit</button>
      </form>
    `;

    const table = `
      ${searchForm}
      <table>
      <style>
      html {
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
      }

      img {
        object-fit: cover;
        width: 100%;
        height: 150px;
      }

      table {
        border-collapse: collapse;
        width: 100%;
      }
      
      table thead {
        background-color: #f2f2f2;
      }
      
      table th {
        padding: 8px;
        text-align: left;
        font-weight: bold;
      }
      
      table tbody tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      
      table td {
        padding: 8px;
      }
      
      table tbody tr:hover {
        background-color: #e6e6e6;
      }
      
              </style>
        <thead>
          <tr>
            <th>Rezeptname</th>
            <th>Rezeptkategorie</th>
            <th>Anleitung</th>
            <th>Kommentar</th>
            <th>Bewertung</th>
            <th>Zeitaufwand</th>
            <th>Herkunft</th>
            <th>Bild</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    res.send(table);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

function insertRezepte() {
  const fs = require('fs');
    const path = require('path');

    const rezepteOrdner = '../Rezepte'; 
    const rezeptDateien = fs.readdirSync(rezepteOrdner)
      .filter(file => path.extname(file) === '.json')
      .map(file => path.join(rezepteOrdner, file));

    rezeptDateien.forEach(jsonFile => {
      const jsonDocument = require(jsonFile);

      db.insert(jsonDocument, (err, body) => {
        if (err) {
          console.error(`Fehler beim Einfügen von ${jsonFile}:`, err);
          return;
        }

        console.log(`JSON-Datei erfolgreich eingefügt: ${jsonFile}`);
      });
    });
}
