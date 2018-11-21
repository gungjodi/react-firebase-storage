import firebase from 'firebase';
require('firebase/firestore');

const config = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    databaseURL: "your-database-url",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id"
};

const settings = {timestampsInSnapshots: true};

export const FirebaseApp = firebase.initializeApp(config);

export const FirestoreDB = FirebaseApp.firestore(); 
FirestoreDB.settings(settings);

export const FirestoreTimestamp = firebase.firestore.FieldValue.serverTimestamp();

//After you change the config to match your own firebase configuration, change this filename to FirebaseApp.js
