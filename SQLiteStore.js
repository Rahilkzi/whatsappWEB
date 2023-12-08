const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

class SQLiteStore {
  constructor() {
    this.db = new sqlite3.Database('whatsapp.db');
    this.createTable();
  }

  createTable() {
    this.db.run(`
            CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY, sessionName TEXT, sessionFile BLOB
            );
        `);
  }

  async sessionExists(options) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT COUNT(*) AS count FROM sessions WHERE sessionName = ?',
        [options.session],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(!!row.count);
          }
        }
      );
    });
  }

  async save(options) {
    const data = fs.readFileSync(`${options.session}.zip`);
    this.db.run(
      'INSERT OR REPLACE INTO sessions (sessionName, sessionFile) VALUES (?, ?)',
      [options.session, data]
    );
    await this.deletePrevious(options);
  }

  async extract(options) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT sessionFile FROM sessions WHERE sessionName   = ?',
        [options.session],
        (err, row) => {
          if (err) {
            // return res.status(500).send('Internal Server Error');
            console.log('Internal Server Error');
          }

          if (!row) {
            console.log('File not found');
          }
          const { sessionFile } = row;
          fs.writeFileSync(options.path, row.sessionFile);
          resolve();
        }
      );
    });
  }

  async delete(options) {
    this.db.run('DELETE FROM sessions WHERE sessionName = ?', [
      options.session,
    ]);
  }

  async deletePrevious(options) {
    // Implement logic to delete previous sessions based on your requirements
  }
}

module.exports = SQLiteStore;