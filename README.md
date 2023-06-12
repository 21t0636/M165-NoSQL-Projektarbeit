# M165-NoSQL-Projektarbeit

## Ausführen

- cd in Code-Ordner (cd C:\Users\raffa\Desktop\M165_NoSQL_Projektarbeit\M165-NoSQL-Projektarbeit\Code)
- node .\server.js
    - http://localhost:3000/
    - http://admin:admin@localhost:5984/_utils
    - http://localhost@localhost:5984/_utils/#database/projektarbeit-rezepte/_all_docs



Validation-doc:

{
  "_id": "_design/validation",
  "_rev": "8-b7ae618907a8ba27252e2ffd28310a85",
  "validate_doc_update": "function(newDoc, oldDoc, userCtx) { if (!newDoc.Rezeptname) { throw({ forbidden: 'Das JSON-Dokument muss das Feld \"Rezeptname\" enthalten.' }); } if (!newDoc.Rezeptkategorie) { throw({ forbidden: 'Das JSON-Dokument muss das Feld \"Rezeptkategorie\" enthalten.' }); } if (!newDoc.Anleitung) { throw({ forbidden: 'Das JSON-Dokument muss das Feld \"Anleitung\" enthalten.' }); } }",
  "language": "javascript"
}




