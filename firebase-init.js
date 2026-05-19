'use strict';
(function () {
  const firebaseConfig = {
    apiKey: 'AIzaSyBSSeMTLVn3qRXXPGikqNMEu5y2Kd-5mlY',
    authDomain: 'easyridersvietnam-a559e.firebaseapp.com',
    projectId: 'easyridersvietnam-a559e',
    storageBucket: 'easyridersvietnam-a559e.firebasestorage.app',
    messagingSenderId: '256202959661',
    appId: '1:256202959661:web:db9eaedd4fa4f2a2a881a4',
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  window.db = firebase.firestore();
}());
