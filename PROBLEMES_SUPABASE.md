# 🔍 Problèmes Potentiels avec Supabase

## Si les variables d'environnement sont bien lues mais que ça ne fonctionne pas

### ✅ 1. Vérifier que les tables Supabase existent

**Le problème le plus courant :** Les tables n'ont pas été créées.

**Solution :**
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Table Editor**
4. Vérifiez que ces tables existent :
   - ✅ `profiles`
   - ✅ `beneficiaries`
   - ✅ `incomes`
   - ✅ `donations`

**Si les tables n'existent pas :**
1. Allez dans **SQL Editor**
2. Copiez-collez le contenu de `supabase/schema.sql`
3. Cliquez sur **Run** pour exécuter le script

### ✅ 2. Vérifier que RLS est activé

**Dans Supabase Dashboard → Table Editor :**
- Chaque table doit avoir un cadenas 🔒 à côté
- Si ce n'est pas le cas, cliquez sur la table → **Enable RLS**

### ✅ 3. Tester la connexion Supabase

**Méthode simple (copiez-collez dans la console) :**

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

**OU après avoir chargé la page, utilisez :**

```javascript
// Si supabase est exposé globalement (en développement)
const test = await window.supabase.from('profiles').select('count');
console.log('Test:', test.error ? test.error.message : '✅ Connexion OK');
```

**Voir `TEST_SUPABASE.md` pour plus de méthodes de test.**

**Si vous voyez une erreur :**
- `relation "profiles" does not exist` → Tables non créées
- `new row violates row-level security policy` → RLS mal configuré
- `Invalid API key` → Clé incorrecte

### ✅ 4. Vérifier les logs Supabase

Dans Supabase Dashboard → Logs → API Logs :
- Regardez les requêtes récentes
- Vérifiez s'il y a des erreurs 400, 401, 403

### ✅ 5. Vérifier le trigger de création de profil

Dans Supabase Dashboard → Database → Functions :
- Vérifiez que `handle_new_user` existe

Si non, réexécutez `supabase/schema.sql`

## 🎯 Checklist Complète

- [ ] Variables d'environnement chargées (vérifié dans console)
- [ ] Tables créées dans Supabase
- [ ] RLS activé sur toutes les tables
- [ ] Trigger `handle_new_user` créé
- [ ] Politiques RLS créées
- [ ] Pas d'erreurs dans la console
- [ ] Pas d'erreurs dans les logs Supabase

