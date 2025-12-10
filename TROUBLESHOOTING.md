# 🔧 Guide de Dépannage - Page ne s'affiche pas

## Problème : La page d'accueil ou de connexion ne s'affiche pas

### ✅ Vérifications à faire dans l'ordre

#### 1. Vérifier les variables d'environnement

**Vérifiez que le fichier `.env` existe et contient :**
```bash
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=votre-clé-publique
```

**Où trouver ces valeurs :**
- Supabase Dashboard → Settings → API
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** → `VITE_SUPABASE_PUBLISHABLE_KEY`

**⚠️ Important :**
- Le fichier doit s'appeler `.env` (avec le point au début)
- Pas de guillemets autour des valeurs
- Pas d'espaces autour du `=`

#### 2. Redémarrer le serveur de développement

**Après avoir créé/modifié le fichier `.env`, vous DEVEZ redémarrer :**

```bash
# Arrêtez le serveur (Ctrl+C ou Cmd+C)
# Puis relancez-le
npm run dev
```

**Pourquoi ?** Vite charge les variables d'environnement uniquement au démarrage.

#### 3. Vérifier la console du navigateur

Ouvrez la console du navigateur (F12 ou Cmd+Option+I) et vérifiez :

**Erreurs possibles :**
- ❌ `Variables d'environnement Supabase manquantes !`
  → Le fichier `.env` n'est pas chargé ou les variables sont incorrectes
  
- ❌ `Error getting session`
  → Problème de connexion à Supabase
  
- ❌ `Table profiles not found`
  → Vous devez exécuter le script SQL dans Supabase (voir étape 4)

#### 4. Vérifier que les tables existent dans Supabase

**Si vous voyez "Table profiles not found" :**

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Copiez-collez le contenu de `supabase/schema.sql`
5. Cliquez sur **Run** pour exécuter le script

**Vérifiez ensuite dans Table Editor que les tables existent :**
- ✅ `profiles`
- ✅ `beneficiaries`
- ✅ `incomes`
- ✅ `donations`

#### 5. Vérifier que RLS est activé

Dans Supabase Dashboard → Table Editor :
- Chaque table doit avoir un cadenas 🔒 (RLS activé)
- Si ce n'est pas le cas, les données ne seront pas accessibles

#### 6. Vérifier la connexion réseau

**Testez la connexion à Supabase :**

Ouvrez la console du navigateur et tapez :
```javascript
// Vérifiez que les variables sont chargées
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('KEY:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.substring(0, 20) + '...');
```

**Si les valeurs sont `undefined` :**
- Le fichier `.env` n'est pas chargé
- Redémarrez le serveur
- Vérifiez que le fichier est à la racine du projet

## 🐛 Scénarios courants

### Scénario 1 : Écran blanc / Rien ne s'affiche

**Causes possibles :**
1. Variables d'environnement manquantes
2. Erreur JavaScript non gérée
3. Serveur non redémarré après modification du `.env`

**Solution :**
1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs
3. Vérifiez le fichier `.env`
4. Redémarrez le serveur

### Scénario 2 : "Chargement..." qui ne se termine jamais

**Causes possibles :**
1. Table `profiles` n'existe pas dans Supabase
2. Erreur de connexion à Supabase
3. Variables d'environnement incorrectes

**Solution :**
1. Vérifiez la console du navigateur
2. Exécutez le script SQL dans Supabase
3. Vérifiez les variables d'environnement

### Scénario 3 : Erreur "Invalid API key"

**Causes possibles :**
1. Mauvaise clé utilisée (service_role au lieu de anon)
2. Clé expirée ou invalide
3. Projet Supabase supprimé

**Solution :**
1. Allez dans Supabase Dashboard → Settings → API
2. Copiez la clé **anon public** (pas service_role)
3. Mettez à jour le fichier `.env`
4. Redémarrez le serveur

## 📋 Checklist de vérification

Avant de lancer le projet, vérifiez :

- [ ] Fichier `.env` existe à la racine du projet
- [ ] `VITE_SUPABASE_URL` est défini et correct
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` est défini et correct
- [ ] Pas de guillemets dans le fichier `.env`
- [ ] Serveur redémarré après modification du `.env`
- [ ] Tables créées dans Supabase (schema.sql exécuté)
- [ ] RLS activé sur toutes les tables
- [ ] Console du navigateur vérifiée pour les erreurs

## 🆘 Si rien ne fonctionne

1. **Vérifiez les logs du serveur** (terminal où vous avez lancé `npm run dev`)
2. **Vérifiez la console du navigateur** (F12)
3. **Vérifiez que Supabase est accessible** : https://status.supabase.com
4. **Créez un nouveau projet Supabase** si nécessaire

## 📞 Informations à fournir en cas de problème

Si vous avez toujours un problème, fournissez :

1. **Message d'erreur exact** de la console du navigateur
2. **Contenu du fichier `.env`** (sans les valeurs sensibles, juste les noms de variables)
3. **État des tables** dans Supabase (screenshot de Table Editor)
4. **Logs du serveur** (terminal)

