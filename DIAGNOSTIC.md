# 🔍 Diagnostic - Problèmes Potentiels

## Si les variables d'environnement sont bien lues mais que ça ne fonctionne pas

### 1. ✅ Vérifier que les tables Supabase existent

**Le problème le plus courant :** Les tables n'ont pas été créées dans Supabase.

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

### 2. ✅ Vérifier que RLS est activé

**Dans Supabase Dashboard → Table Editor :**
- Chaque table doit avoir un cadenas 🔒 à côté
- Si ce n'est pas le cas, cliquez sur la table → **Enable RLS**

### 3. ✅ Vérifier les erreurs dans la console

Ouvrez la console du navigateur (F12) et cherchez :

**Erreur : `Table profiles does not exist`**
→ Les tables n'ont pas été créées (voir étape 1)

**Erreur : `new row violates row-level security policy`**
→ RLS est activé mais les politiques ne sont pas correctes (voir étape 2)

**Erreur : `Invalid API key`**
→ La clé dans `.env` est incorrecte ou expirée

**Erreur : `Failed to fetch`**
→ Problème de connexion réseau ou URL Supabase incorrecte

### 4. ✅ Tester la connexion Supabase directement

Dans la console du navigateur, tapez :

```javascript
// Testez la connexion
const { data, error } = await supabase.from('profiles').select('count');
console.log('Test connexion:', error ? error.message : 'OK');
```

**Si vous voyez une erreur :**
- Notez le message d'erreur exact
- Vérifiez que les tables existent
- Vérifiez que RLS est configuré

### 5. ✅ Vérifier que le trigger de création de profil fonctionne

**Le trigger `handle_new_user` doit être créé :**

Dans Supabase Dashboard → Database → Functions :
- Vérifiez que `handle_new_user` existe

Si non, réexécutez le script SQL `supabase/schema.sql`

### 6. ✅ Vérifier les logs Supabase

Dans Supabase Dashboard → Logs → API Logs :
- Regardez les requêtes récentes
- Vérifiez s'il y a des erreurs 400, 401, 403

## 🎯 Checklist Complète

- [ ] Variables d'environnement chargées (vérifié dans console)
- [ ] Tables créées dans Supabase (profiles, beneficiaries, incomes, donations)
- [ ] RLS activé sur toutes les tables
- [ ] Trigger `handle_new_user` créé
- [ ] Politiques RLS créées (voir schema.sql)
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Pas d'erreurs dans les logs Supabase
- [ ] Test de connexion réussi

## 🆘 Si rien ne fonctionne

1. **Vérifiez les logs Supabase** : Dashboard → Logs
2. **Vérifiez la console du navigateur** : F12 → Console
3. **Testez avec un nouveau compte** : Créez un compte de test
4. **Vérifiez que le projet Supabase est actif** : Dashboard → Settings → General

