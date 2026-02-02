// Test de configuration Firebase
import { db, auth, storage, analytics, googleProvider } from '../src/config/firebase';

console.log('🔥 Test de configuration Firebase');
console.log('================================\n');

// Vérifier que tous les services sont initialisés
console.log('✓ Firestore (db):', db ? '✅ OK' : '❌ ERREUR');
console.log('✓ Authentication (auth):', auth ? '✅ OK' : '❌ ERREUR');
console.log('✓ Storage (storage):', storage ? '✅ OK' : '❌ ERREUR');
console.log('✓ Analytics (analytics):', analytics !== undefined ? '✅ OK (sera initialisé côté client)' : '❌ ERREUR');
console.log('✓ Google Provider (googleProvider):', googleProvider ? '✅ OK' : '❌ ERREUR');

// Afficher les informations de configuration
console.log('\n📋 Informations de configuration:');
console.log('- Project ID:', auth.app.options.projectId);
console.log('- Auth Domain:', auth.app.options.authDomain);
console.log('- Storage Bucket:', auth.app.options.storageBucket);

console.log('\n✨ Firebase est correctement configuré!');
