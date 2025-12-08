# Quick Test Guide - Language Sync Fix

## 🚀 Quick Start

Server is running at: **http://localhost:3000**

## 📋 Test Checklist

### Step 1: Clear Cache (Important!)
Open browser console (F12) and run:
```javascript
localStorage.clear();
location.reload();
```

### Step 2: Test Language Sync
1. Go to: http://localhost:3000/test-language-sync.html
2. Click "Check Sync Status"
3. Click "Set English"
4. Verify both keys show 'en'

### Step 3: Test Divination Page
1. Go to: http://localhost:3000/divination.html
2. Switch language to **English** using the language selector
3. Open console (F12) and check for:
   ```
   [UnifiedI18n] Updated preferredLanguage to: en
   ```
4. Fill in birth information:
   - Birth Date: Any date
   - Birth Time: Any time
   - Birth Place: Any place
   - Gender: Any gender
5. Select at least one category (Career, Wealth, etc.)
6. Click **"Analyze"**
7. Wait for results
8. **Verify**: All AI output should be in English

### Step 4: Verify Console Logs
Look for these logs in console:
```
🌐 Current language for divination: en
🌐 localStorage preferredLanguage: en
🌐 Backup data language: en
🌐 Is English: true
```

### Step 5: Test Language Switch
1. Switch back to **中文** (Chinese)
2. Click **"New Reading"**
3. Fill in information again
4. Click **"Analyze"**
5. **Verify**: All AI output should be in Chinese

## ✅ Success Criteria

- [ ] localStorage keys are synced (both show same language)
- [ ] Console logs show correct language
- [ ] AI output matches selected language
- [ ] Switching languages updates AI output immediately

## 🐛 If Something Goes Wrong

### Problem: AI output still in wrong language

**Solution 1**: Hard refresh
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

**Solution 2**: Clear cache again
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

**Solution 3**: Check console for errors
- Open DevTools (F12)
- Look for red error messages
- Share error messages if issue persists

### Problem: Language selector not working

**Check**:
1. Is the page fully loaded?
2. Are there any console errors?
3. Try refreshing the page

## 📊 Test Results Template

Copy this and fill in your results:

```
Test Date: ___________
Browser: ___________

✅ / ❌  localStorage sync working
✅ / ❌  Console logs correct
✅ / ❌  English AI output correct
✅ / ❌  Chinese AI output correct
✅ / ❌  Language switching works

Notes:
_________________________________
_________________________________
```

## 🔗 Quick Links

- Test Page: http://localhost:3000/test-language-sync.html
- Divination: http://localhost:3000/divination.html
- Feng Shui: http://localhost:3000/fengshui.html
- I-Ching: http://localhost:3000/iching.html

## 📝 Console Commands

### Check current language
```javascript
console.log('UI Language:', localStorage.getItem('destinyai_language'));
console.log('AI Language:', localStorage.getItem('preferredLanguage'));
```

### Force set English
```javascript
localStorage.setItem('destinyai_language', 'en');
localStorage.setItem('preferredLanguage', 'en');
location.reload();
```

### Force set Chinese
```javascript
localStorage.setItem('destinyai_language', 'zh-CN');
localStorage.setItem('preferredLanguage', 'zh-CN');
location.reload();
```

## 🎯 Expected Behavior

### When switching to English:
1. Page text changes to English immediately
2. localStorage keys both update to 'en'
3. Next AI analysis returns English results
4. Console shows: `preferredLanguage: en`

### When switching to Chinese:
1. Page text changes to Chinese immediately
2. localStorage keys both update to 'zh-CN'
3. Next AI analysis returns Chinese results
4. Console shows: `preferredLanguage: zh-CN`

---

**Need Help?**
Check the detailed documentation:
- English: `LANGUAGE_SYNC_FIX.md`
- Chinese: `占卜页面AI翻译问题终极修复.md`
