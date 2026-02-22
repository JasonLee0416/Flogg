import React, { createContext, useContext, useState, useEffect } from 'react';
import { initDatabase, getAllReceipts, searchReceipts, insertReceipt, deleteReceipt, updateReceipt, deleteAllReceipts } from './db';

const DatabaseContext = createContext(null);

export function DatabaseProvider({ children }) {
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await initDatabase();
        await refreshReceipts();
      } catch (e) { console.error('DB init failed:', e); }
      finally { setIsLoading(false); }
    })();
  }, []);

  const refreshReceipts = async () => {
    try { setReceipts(await getAllReceipts()); }
    catch (e) { console.error('DB query failed:', e); }
  };

  const search = async (keyword) => {
    if (!keyword.trim()) { await refreshReceipts(); return; }
    try { setReceipts(await searchReceipts(keyword)); }
    catch (e) { console.error('Search failed:', e); }
  };

  const addReceipt = async (data) => {
    const id = await insertReceipt(data);
    await refreshReceipts();
    return id;
  };

  const editReceipt = async (id, data) => {
    await updateReceipt(id, data);
    await refreshReceipts();
  };

  const removeReceipt = async (id) => {
    await deleteReceipt(id);
    await refreshReceipts();
  };

  const clearAll = async () => {
    await deleteAllReceipts();
    await refreshReceipts();
  };

  return (
    <DatabaseContext.Provider value={{
      receipts, isLoading, refreshReceipts, search,
      addReceipt, editReceipt, removeReceipt, clearAll,
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const ctx = useContext(DatabaseContext);
  if (!ctx) throw new Error('useDatabase must be used within DatabaseProvider');
  return ctx;
}
