const express = require('express');
const app = express();
const port = 3000;
const nano = require('nano')('http://admin:admin@localhost:5984');
const db = nano.db.use('projektarbeit-rezepte');

app.get('/', (req, res) => {
  //insertRezepte();
  try {
    let { search } = req.query;
    const query = {
      "selector": {
         "Zutaten": {
            "$elemMatch": {
              $regex: `.*${search}.*`
            }
         }
      }
   }

    if (!search) {
      query.selector = {};
    }

    db.find(query, function(err, data) {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred');
        return;
      }

      const docs = data.docs;
      const tableRows = docs.map(doc => {
        if (doc._id.startsWith("_"))
          return '';

        return `<tr>
                  <td>${(doc.Rezeptname == undefined) ? "-" : doc.Rezeptname}</td>
                  <td>${(doc.Rezeptkategorie == undefined) ? "-" : doc.Rezeptkategorie}</td>
                  <td>${(doc.Zutaten == undefined) ? "-" : doc.Zutaten}</td>
                  <td>${(doc.Anleitung == undefined) ? "-" : doc.Anleitung}</td>
                  <td>${(doc.Kommentar == undefined) ? "-" : doc.Kommentar}</td>
                  <td>${(doc.Bewertung == undefined) ? "-" : doc.Bewertung}</td>
                  <td>${(doc.Zeitaufwand == undefined) ? "-" : doc.Zeitaufwand}</td>
                  <td>${(doc.Herkunft == undefined) ? "-" : doc.Herkunft}</td>
                  <td><img src="${(doc.Bild == undefined) ? "https://caspianpolicy.com/no-image.png" : doc.Bild}"></td>
                </tr>`;
      }).join('');

      const searchForm = `
        <form method="GET" action="/">
          <input type="text" name="search" id="search">
          <button type="submit">Suchen</button>
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
          height: 100%;
          width: 150px;
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
              <th>Zutaten</th>
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
    });
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