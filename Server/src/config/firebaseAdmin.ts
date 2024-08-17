import admin from 'firebase-admin';

const serviceAccount = require('./serviceAccountKey.json'); // Download this from Firebase console

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();
