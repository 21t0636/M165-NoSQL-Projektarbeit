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

    const docs = response.rows.map(row => row.doc);

    const tableRows = docs.map(doc => {
      return `<tr>
                <td>${doc._id}</td>
                <td>${doc.name}</td>
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
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
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
