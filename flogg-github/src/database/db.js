import * as SQLite from 'expo-sqlite';

let db = null;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('flogg.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS receipts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_uri TEXT DEFAULT '',
      destination TEXT DEFAULT '',
      orderer TEXT DEFAULT '',
      product_detail TEXT DEFAULT '',
      ribbon_text TEXT DEFAULT '',
      raw_response TEXT DEFAULT '',
      memo TEXT DEFAULT '',
      created_at DATETIME DEFAULT (datetime('now', 'localtime')),
      updated_at DATETIME DEFAULT (datetime('now', 'localtime'))
    );
  `);
  console.log('✅ Flogg DB initialized');
  return db;
}

function getDb() {
  if (!db) throw new Error('DB not initialized');
  return db;
}

export async function insertReceipt({ imageUri, destination, orderer, productDetail, ribbonText, rawResponse, memo }) {
  const r = await getDb().runAsync(
    `INSERT INTO receipts (image_uri, destination, orderer, product_detail, ribbon_text, raw_response, memo) VALUES (?,?,?,?,?,?,?)`,
    [imageUri||'', destination||'', orderer||'', productDetail||'', ribbonText||'', rawResponse||'', memo||'']
  );
  return r.lastInsertRowId;
}

export async function getAllReceipts() {
  return await getDb().getAllAsync(`SELECT * FROM receipts ORDER BY created_at DESC`);
}

export async function searchReceipts(keyword) {
  const like = `%${keyword}%`;
  return await getDb().getAllAsync(
    `SELECT * FROM receipts WHERE destination LIKE ? OR orderer LIKE ? OR product_detail LIKE ? OR ribbon_text LIKE ? ORDER BY created_at DESC`,
    [like, like, like, like]
  );
}

export async function getReceiptById(id) {
  return await getDb().getFirstAsync(`SELECT * FROM receipts WHERE id = ?`, [id]);
}

export async function updateReceipt(id, { destination, orderer, productDetail, ribbonText, memo }) {
  await getDb().runAsync(
    `UPDATE receipts SET destination=?, orderer=?, product_detail=?, ribbon_text=?, memo=?, updated_at=datetime('now','localtime') WHERE id=?`,
    [destination||'', orderer||'', productDetail||'', ribbonText||'', memo||'', id]
  );
}

export async function deleteReceipt(id) {
  await getDb().runAsync(`DELETE FROM receipts WHERE id = ?`, [id]);
}

export async function deleteAllReceipts() {
  await getDb().runAsync(`DELETE FROM receipts`);
}
