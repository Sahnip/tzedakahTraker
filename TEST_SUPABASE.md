# 🧪 Test de Connexion Supabase

## Méthode 1 : Test dans la Console du Navigateur

Ouvrez la console (F12) et copiez-collez ce code :

```javascript
// Import du client Supabase
import('http://localhost:8080/src/integrations:supubase/client.ts')
  .then(module => {
    const { supabase } = module;
    
    // Test de connexion
    supabase.from('profiles').select('count')
      .then(({ data, error }) => {
        if (error) {
          console.error('❌ Erreur:', error.message);
          console.error('Code:', error.code);
          console.error('Détails:', error);
        } else {
          console.log('✅ Connexion Supabase OK !');
          console.log('Données:', data);
        }
      });
  })
  .catch(err => {
    console.error('Erreur d\'import:', err);
    console.log('💡 Essayez la Méthode 2 ci-dessous');
  });
```

## Méthode 2 : Test Direct (Plus Simple)

Copiez-collez ce code dans la console :

```javascript
// Test direct avec fetch
const SUPABASE_URL = 'https://hxihjvqvmujobqkfcdll.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jVEWVSsGuN0xRCZyyExJ1A_4iDQJ6f0';

fetch(`${SUPABASE_URL}/rest/v1/profiles?select=count`, {
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`
  }
})
.then(r => r.json())
.then(data => {
  console.log('✅ Connexion OK !', data);
})
.catch(err => {
  console.error('❌ Erreur:', err);
});
```

## Méthode 3 : Vérifier les Variables d'Environnement

```javascript
// Vérifiez que les variables sont chargées
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('KEY:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.substring(0, 30) + '...');

// Si undefined, les variables ne sont pas chargées
if (!import.meta.env.VITE_SUPABASE_URL) {
  console.error('❌ Variables non chargées ! Redémarrez le serveur.');
}
```

## Interprétation des Résultats

### ✅ Succès
```
✅ Connexion Supabase OK !
```
→ Tout fonctionne, les tables existent probablement.

### ❌ Erreur : `relation "profiles" does not exist`
```
Code: 42P01
```
→ **Les tables n'ont pas été créées dans Supabase**
→ Solution : Exécutez `supabase/schema.sql` dans Supabase Dashboard

### ❌ Erreur : `new row violates row-level security policy`
```
Code: 42501
```
→ **RLS est activé mais mal configuré**
→ Solution : Vérifiez les politiques RLS dans Supabase

### ❌ Erreur : `Invalid API key`
```
Code: 401
```
→ **La clé API est incorrecte**
→ Solution : Vérifiez le fichier `.env`

### ❌ Erreur : `Failed to fetch`
→ **Problème de connexion réseau ou URL incorrecte**
→ Solution : Vérifiez l'URL dans `.env`

