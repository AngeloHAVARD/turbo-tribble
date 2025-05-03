const express = require("express");
const path = require("path");
const http = require("http");
//const WebSocket = require("ws");
const db = require("./db");

const app = express();
const server = http.createServer(app);
//const wss = new WebSocket.Server({ server });
const port = 80;

app.use(express.static(path.join(__dirname, "public2")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public2", "index.html"));
});

// Route de recherche
app.post('/searchuser', async (req, res) => {
  function detectVariable(str) {
    // Vérifier si la chaîne contient le caractère '/'
    if (str.includes('/')) {
        // Trouver la position du '/' dans la chaîne
      const slashIndex = str.indexOf('/');

        // Extraire la partie après le '/'
      const afterSlash = str.slice(slashIndex + 1);

        // Vérifier s'il y a un signe '='
      const equalIndex = afterSlash.indexOf('=');
      if (equalIndex !== -1) {
            // Extraire le nom de la variable avant le '=' et sa valeur après
        const variable = afterSlash.slice(0, equalIndex).trim();
        const value = afterSlash.slice(equalIndex + 1).trim();

            // Retourner le nom et la valeur de la variable
        return { variable, value };
      } else {
            return null; // Pas de '=' trouvé après '/'
          }
        }
    return null; // Pas de '/' trouvé
  }

  const { search } = req.body;
  let r = []; // Tableau pour stocker les résultats

  try {
    if (!detectVariable(search)) {
      // Recherche par nom
      const usersByNom = await db.searchUsersByNom(search);  // Attendre la promesse
      r.push(...usersByNom);

      // Recherche par prénom
      const usersByPrenom = await db.searchUsersByPrenom(search);  // Attendre la promesse
      r.push(...usersByPrenom);

      // Recherche par fonction
      const usersByFonction = await db.searchUsersByFonction(search);  // Attendre la promesse
      r.push(...usersByFonction);

      // Recherche par ID
      const usersById = await db.searchUsersById(search);  // Attendre la promesse
      r.push(...usersById);

      // Recherche par RFID
      const usersByRfidBadge = await db.searchUsersByRfidBadge(search);  // Attendre la promesse
      r.push(...usersByRfidBadge);
    } else {
      let x;
      x = detectVariable(search);
      if (x.variable === "id") {
        // Recherche par ID
      const usersById = await db.getUsersById(x.value);  // Attendre la promesse
      r.push(...usersById);
    }
    if (x.variable === "nom") {
          // Recherche par nom
        const usersByNom = await db.getUsersByNom(x.value);  // Attendre la promesse
        r.push(...usersByNom);
      }
      if (x.variable === "prenom") {
          // Recherche par prénom
        const usersByPrenom = await db.getUsersByPrenom(x.value);  // Attendre la promesse
        r.push(...usersByPrenom);
      }
      if (x.variable === "fonction") {
          // Recherche par fonction
        const usersByFonction = await db.getUsersByFonction(x.value);  // Attendre la promesse
        r.push(...usersByFonction);
      }
      if (x.variable === "rfid") {
        // Recherche par RFID
        const usersByRfidBadge = await db.getUsersByRfidBadge(x.value);  // Attendre la promesse
        r.push(...usersByRfidBadge);
      }
    }

    const seenIds = new Set();
    const result = [];

    for (const obj of r) {
      if (!seenIds.has(obj.id)) {
        seenIds.add(obj.id);
        result.push(obj);
      }
    }

    res.json(result);  // Retourner la liste des utilisateurs trouvés
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).send('Erreur serveur');
  }
});

app.post('/adduser', async (req, res) => {
  const { nom, prenom, fonction } = req.body;

  try {
    db.addUsers(nom, prenom, fonction);
    res.json("ok");
  } catch (error) {
    console.error(`Erreur lors de l'ajout d'utilisateur:`, error);
    res.status(500).send('Erreur serveur');
  }
});

app.post('/removeuser', async (req, res) => {
  const { id } = req.body;

  try {
    db.removeUsers(id);
    res.json("ok");
  } catch (error) {
    console.error(`Erreur lors de la supretion de l'utilisateur:`, error);
    res.status(500).send('Erreur serveur');
  }
});

// Route de recherche
app.post('/searchbadge', async (req, res) => {
  function detectVariable(str) {
    // Vérifier si la chaîne contient le caractère '/'
    if (str.includes('/')) {
        // Trouver la position du '/' dans la chaîne
      const slashIndex = str.indexOf('/');

        // Extraire la partie après le '/'
      const afterSlash = str.slice(slashIndex + 1);

        // Vérifier s'il y a un signe '='
      const equalIndex = afterSlash.indexOf('=');
      if (equalIndex !== -1) {
            // Extraire le nom de la variable avant le '=' et sa valeur après
        const variable = afterSlash.slice(0, equalIndex).trim();
        const value = afterSlash.slice(equalIndex + 1).trim();

            // Retourner le nom et la valeur de la variable
        return { variable, value };
      } else {
            return null; // Pas de '=' trouvé après '/'
          }
        }
    return null; // Pas de '/' trouvé
  }

  const { search } = req.body;
  let r = []; // Tableau pour stocker les résultats

  try {
    if (!detectVariable(search)) {
      // Recherche par rfid
      const badgeByRfid = await db.searchBadgeByRfid(search);  // Attendre la promesse
      r.push(...badgeByRfid);

      // Recherche par user_id
      const badgeByUser_id = await db.searchBadgeByUser_id(search);  // Attendre la promesse
      r.push(...badgeByUser_id);

      // Recherche par ActivityTime
      const badgeByActivityTime = await db.searchBadgeByActivityTime(search);  // Attendre la promesse
      r.push(...badgeByActivityTime);

      // Recherche par ID
      const badgeById = await db.searchBadgeById(search);  // Attendre la promesse
      r.push(...badgeById);

      // Recherche par RFID
    } else {
      let x;
      x = detectVariable(search);
      if (x.variable === "id") {
        // Recherche par ID
      const badgeById = await db.getBadgeById(x.value);  // Attendre la promesse
      r.push(...badgeById);
    }
    if (x.variable === "activitytime") {
          // Recherche par nom
        const badgeByActivityTime = await db.getBadgeByActivityTime(x.value);  // Attendre la promesse
        r.push(...badgeByActivityTime);
      }
      if (x.variable === "user_id") {
          // Recherche par prénom
        const badgeByUser_id = await db.getBadgeByUser_id(x.value);  // Attendre la promesse
        r.push(...badgeByUser_id);
      }
      if (x.variable === "rfid") {
        // Recherche par RFID
        const badgeByRfid = await db.getBadgeByRfid(x.value);  // Attendre la promesse
        r.push(...badgeByRfid);
      }
    }

    const seenIds = new Set();
    const result = [];

    for (const obj of r) {
      if (!seenIds.has(obj.id)) {
        seenIds.add(obj.id);
        result.push(obj);
      }
    }

    res.json(result);  // Retourner la liste des utilisateurs trouvés
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).send('Erreur serveur');
  }
});

app.post('/addbadge', async (req, res) => {
  const { user_id, rfid, activityTime } = req.body;

  try {
    db.addBadge(user_id, rfid, activityTime);
    res.json("ok");
  } catch (error) {
    console.error(`Erreur lors de l'ajout d'utilisateur:`, error);
    res.status(500).send('Erreur serveur');
  }
});

app.post('/removebadge', async (req, res) => {
  const { id } = req.body;

  try {
    db.removeBadge(id);
    res.json("ok");
  } catch (error) {
    console.error(`Erreur lors de la supretion de l'utilisateur:`, error);
    res.status(500).send('Erreur serveur');
  }
});

server.listen(port, () => {
  console.log(`Le serveur écoute sur http://localhost:${port}`);
});