import admin from "firebase-admin";
import path from "path";

// Ruta a tu JSON descargado
const serviceAccount = path.resolve("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export { db };