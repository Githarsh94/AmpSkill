import admin from 'firebase-admin';

const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccountBase64) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT environment variable');
}

const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf-8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();