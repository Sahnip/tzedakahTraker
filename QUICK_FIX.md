# 🔧 Correction Immédiate - Variables d'Environnement

## Problème identifié

Les erreurs montrent que le code utilise `placeholder.supabase.co`, ce qui signifie que les variables d'environnement ne sont **PAS chargées** par Vite.

## ✅ Solution en 3 étapes

### Étape 1 : Vérifier le fichier `.env`

Le fichier `.env` doit contenir **EXACTEMENT** ces deux lignes (sans guillemets, sans espaces) :

```env
VITE_SUPABASE_URL=https://hxihjvqvmujobqkfcdll.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_jVEWVSsGuN0xRCZyyExJ1A_4iDQJ6f0
```

**⚠️ Important :**
- Pas de ligne `VITE_SUPABASE_PROJECT_ID` (non utilisée)
- Pas de guillemets autour des valeurs
- Pas d'espaces avant ou après le `=`
- Le fichier doit être à la racine du projet

### Étape 2 : Redémarrer le serveur

**ARRÊTEZ complètement le serveur** (Ctrl+C ou Cmd+C) puis :

```bash
npm run dev
```

**Pourquoi ?** Vite charge les variables d'environnement **UNIQUEMENT au démarrage**.

### Étape 3 : Vérifier dans la console du navigateur

Ouvrez la console (F12) et tapez :

```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('KEY:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.substring(0, 30));
```

**Si vous voyez `undefined` :**
- Le serveur n'a pas été redémarré
- Le fichier `.env` n'est pas au bon endroit
- Il y a une erreur de syntaxe dans le fichier `.env`

## 🚨 Erreurs courantes

### Erreur : `placeholder.supabase.co`

**Cause :** Variables d'environnement non chargées

**Solution :**
1. Vérifiez le fichier `.env`
2. Redémarrez le serveur
3. Vérifiez qu'il n'y a pas d'espaces dans le fichier

### Erreur : `ERR_NAME_NOT_RESOLVED`

**Cause :** Tentative de connexion à `placeholder.supabase.co` (domaine invalide)

**Solution :** Les variables ne sont pas chargées → Suivez les étapes ci-dessus

## 📝 Checklist

- [ ] Fichier `.env` existe à la racine du projet
- [ ] Fichier `.env` contient exactement 2 lignes (URL et KEY)
- [ ] Pas de guillemets dans le fichier `.env`
- [ ] Pas d'espaces autour du `=`
- [ ] Serveur complètement arrêté puis redémarré
- [ ] Console du navigateur vérifiée (variables chargées)

## 🔍 Vérification finale

Après avoir redémarré, dans la console du navigateur vous devriez voir :
- ✅ Plus d'erreur "Variables d'environnement Supabase manquantes"
- ✅ Les variables chargées correctement
- ✅ La page de connexion s'affiche

Si le problème persiste, vérifiez les logs du serveur (terminal où vous avez lancé `npm run dev`).

