// Firebase sales database logic
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveSales(sales: any[]) {
  const salesCol = collection(db, 'sales');
  for (const sale of sales) {
    await addDoc(salesCol, sale);
  }
}

export async function getSalesByDateRange(startDate: string, endDate: string) {
  const salesCol = collection(db, 'sales');
  const q = query(salesCol, where('edate', '>=', startDate), where('edate', '<=', endDate));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}
