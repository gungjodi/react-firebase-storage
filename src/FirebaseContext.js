import React from "react";
import {FirestoreDB,FirestoreTimestamp} from './FirebaseApp';


const Constants ={
    firestoreTimestamp:FirestoreTimestamp,
    collection:{
        caleg : FirestoreDB.collection('caleg'),
        dapil : FirestoreDB.collection('dapil'),
        partai : FirestoreDB.collection('partai'),
        wilayahBali : FirestoreDB.collection('wilayahBali'),
        perolehanSuara : FirestoreDB.collection('perolehanSuara')
    }
};

const Context = React.createContext(Constants);
export const FirebaseContextProvider = Context.Provider;
export const FirebaseContextConsumer = Context.Consumer;
