# Troubleshooting Guide - BD Performance Dashboard

## 🔧 Common Issues and Solutions

### Data Loading Issues

#### Issue: "No data fetched from Google Sheets, using demo data"

**Possible Causes:**
1. Google Sheet is not publicly accessible
2. Sheet tabs are named incorrectly
3. CORS policy blocking request
4. Network connectivity issues

**Solutions:**

**Solution 1: Check Sheet Permissions**
```
1. Open your Google Sheet
2. Click "Share" button (top right)
3. Change to "Anyone with the link can view"
4. Click "Copy link" and verify the ID matches in config
```

**Solution 2: Verify Sheet Names**
```
1. Check each tab name matches format: DD-MM-YYYY
2. Examples: 24-03-2026, 25-03-2026
3. No extra spaces or characters
4. Leading zeros for single-digit days/months
```

**Solution 3: CORS Workaround**
```
The dashboard tries to fetch via Google's export API.
If CORS blocks this:
- The demo data will be used automatically
- Consider deploying to a server that can proxy requests
- Or use Google Sheets API with API key (requires code update)
```

**Solution 4: Check Network**
```
1. Open browser console (F12)
2. Look for network errors
3. Verify you can access: 
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:csv
4. If 404: Sheet ID is wrong
5. If 403: Permission issue
```

---

### Filter Issues

#### Issue: Filters not applying

**Solution:**
1. Clear all filters using the ✕ badges
2. Refresh the page (Ctrl/Cmd + R)
3. Click "Refresh Data" button
4. Try applying filters one at a time

#### Issue: Date range showing no data

**Possible Causes:**
- Start date is after end date
- No data exists for that range
- Dates don't match sheet format

**Solutions:**
```
1. Verify start date comes before end date
2. Check that dates exist in your sheets
3. Ensure dates match DD-MM-YYYY format
4. Clear range and try again
```

#### Issue: Month filter empty or not working

**Solution:**
```
1. Verify sheets exist for that month
2. Check sheet naming: must be DD-MM-YYYY
3. Month is extracted from sheet names
4. Format must be exact (no variations)
```

---

### Chart Issues

#### Issue: Charts not displaying

**Possible Causes:**
1. No data in filtered view
2. Browser compatibility
3. JavaScript errors

**Solutions:**

**Solution 1: Check Data**
```
1. Look at the filter summary
2. Verify "Showing X members" has X > 0
3. Clear filters to see if charts appear
4. Check browser console for errors
```

**Solution 2: Browser Compatibility**
```
Supported browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Update your browser if using older version
```

**Solution 3: Clear Cache**
```
1. Ctrl/Cmd + Shift + Delete
2. Clear cached images and files
3. Reload page
4. Or use incognito/private mode
```

#### Issue: Daily Trends chart not showing

**This is expected behavior when:**
- Any date filter is active (specific date, month, or range)
- A specific member is selected
- The chart only shows when viewing ALL members with NO date filters

**To see the chart:**
1. Clear all date filters (click ✕ badges)
2. Set member filter to "All Members"
3. The chart will appear automatically

---

### Performance Issues

#### Issue: Dashboard loading slowly

**Solutions:**

**Solution 1: Reduce Date Range**
```
Edit src/config/dashboard.ts:
- Reduce the date range
- Fewer dates = faster loading
```

**Solution 2: Optimize Browser**
```
1. Close other tabs
2. Disable browser extensions
3. Clear browser cache
4. Restart browser
```

**Solution 3: Build Production Version**
```bash
npm run build
# Serve the dist/index.html file
# Production build is much faster than dev mode
```

#### Issue: Charts lagging when filtering

**Solution:**
```
This can happen with many team members and long date ranges.
- Use specific date/month filters to reduce data volume
- Filter by member to show less data
- Consider using date ranges instead of full dataset
```

---

### Data Display Issues

#### Issue: Numbers showing as 0

**Possible Causes:**
1. Empty cells in Google Sheet
2. Non-numeric values
3. Column mapping mismatch

**Solutions:**

**Solution 1: Check Sheet Data**
```
1. Open Google Sheet
2. Verify cells contain numbers (not text)
3. Remove any formatting that might cause issues
4. No empty cells in data rows (use 0 instead)
```

**Solution 2: Verify Column Order**
```
Columns must be in exact order:
1. BD Members
2. Connection Target
3. Total Connections
4. Message Target
5. Total No.of msg send
6. Target (Reverted message)
7. Leads (Revert msg)
8. Resume Target
9. Resume Target Achieved
10. How many leads has been updated in the dashboard

Extra columns after column 10 are ignored.
```

#### Issue: Member names duplicated or missing

**Possible Causes:**
- Inconsistent naming across sheets
- Extra spaces in names
- Different capitalization

**Solutions:**
```
1. Standardize names across all sheet tabs
2. Remove leading/trailing spaces
3. Use exact same spelling
4. Case matters: "John" ≠ "john"

Example:
❌ "Rajveer ", " Rajveer", "rajveer"
✅ "Rajveer" (consistent across all sheets)
```

---

### AI Suggestions Issues

#### Issue: No suggestions showing

**This is expected when:**
- All metrics are in the "good" range (60-80%)
- Default suggestion "Good performance" appears

**To trigger specific suggestions:**
- Adjust thresholds in `src/config/dashboard.ts`
- Check that metrics are calculated correctly

#### Issue: Wrong suggestions showing

**Solution:**
```
Edit src/config/dashboard.ts THRESHOLDS:
{
  lowConnectionRate: 50,      // Adjust as needed
  highConnectionRate: 150,    // Adjust as needed
  lowConversionRate: 20,      // Adjust as needed
  highConversionRate: 40,     // Adjust as needed
  // ... etc
}

Then rebuild: npm run build
```

---

### Build Issues

#### Issue: Build fails with TypeScript errors

**Solutions:**

**Solution 1: Install Dependencies**
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

**Solution 2: Check Node Version**
```bash
node --version
# Should be 16.x or higher
# Update if needed
```

**Solution 3: Clear Build Cache**
```bash
rm -rf dist
npm run build
```

#### Issue: "Module not found" errors

**Solution:**
```bash
# Reinstall specific packages
npm install recharts lucide-react date-fns
npm run build
```

---

### Configuration Issues

#### Issue: Date range not updating after config change

**Solution:**
```
After editing src/config/dashboard.ts:
1. Save the file
2. If dev server running: It auto-reloads
3. If production: Run npm run build
4. Clear browser cache
5. Refresh page
```

#### Issue: Sheet ID change not working

**Solution:**
```
1. Edit src/config/dashboard.ts
2. Update GOOGLE_SHEET_ID: 'new-id-here'
3. Save file
4. npm run build (if production)
5. Hard refresh browser (Ctrl/Cmd + Shift + R)
```

---

### Display Issues

#### Issue: Layout broken on mobile

**Solutions:**
```
1. Ensure you're using latest build
2. Clear mobile browser cache
3. Try landscape orientation for charts
4. Some charts scroll horizontally on mobile (intended)
```

#### Issue: Text overlapping on charts

**Possible Causes:**
- Too many data points
- Long member names
- Small screen

**Solutions:**
```
1. Use filters to reduce data shown
2. Rotate device to landscape
3. Zoom out on browser
4. Use desktop for detailed analysis
```

---

### Specific Error Messages

#### Error: "TypeError: Cannot read property 'map' of undefined"

**Cause:** Data structure mismatch

**Solution:**
```
1. Check browser console for full error
2. Verify sheet data structure
3. Clear filters
4. Refresh page
5. Check that at least one sheet has data
```

#### Error: "Network request failed"

**Cause:** Cannot reach Google Sheets

**Solution:**
```
1. Check internet connection
2. Verify sheet URL is accessible
3. Try accessing sheet directly in browser
4. Dashboard will use demo data as fallback
```

#### Error: "Invalid date format"

**Cause:** Sheet tab name not in DD-MM-YYYY format

**Solution:**
```
1. Rename sheet tabs to exact format
2. Examples: 01-04-2026, 15-03-2026
3. No other formats accepted
4. Leading zeros required
```

---

## 🆘 Getting Help

### Before Asking for Help

1. **Check this troubleshooting guide**
2. **Look at browser console** (F12 → Console tab)
3. **Verify your sheet structure** matches documentation
4. **Try with demo data** (should always work)
5. **Clear cache and try again**

### Information to Provide

When reporting issues, include:
```
1. Browser and version (Chrome 120, Firefox 115, etc.)
2. Operating system (Windows 11, macOS 14, etc.)
3. Error messages from console (screenshot)
4. What filters were active
5. What you were trying to do
6. Sheet structure (column order)
7. Whether demo data works
```

### Console Debugging

Open browser console (F12) and check:
```javascript
// See what data was loaded
console.log('Check network tab for sheet requests')

// See active filters
'Check Filter Summary panel on dashboard'

// See if demo data is being used
'Look for "using demo data" warning in console'
```

---

## ✅ Quick Diagnostic Checklist

Run through this checklist to diagnose issues:

- [ ] Google Sheet is publicly accessible
- [ ] Sheet tabs named as DD-MM-YYYY
- [ ] Columns in correct order
- [ ] No empty rows in sheet data
- [ ] Browser is supported version
- [ ] JavaScript is enabled
- [ ] No ad-blockers blocking Google Sheets
- [ ] Internet connection is stable
- [ ] Cleared browser cache recently
- [ ] Latest version of dashboard deployed
- [ ] Config file has correct sheet ID
- [ ] Date range in config matches available sheets

---

## 🔄 Reset to Default

If all else fails, reset everything:

```bash
# 1. Clear everything
rm -rf node_modules dist
rm package-lock.json

# 2. Fresh install
npm install

# 3. Verify config
# Check src/config/dashboard.ts has correct values

# 4. Build fresh
npm run build

# 5. Clear browser cache
# Ctrl/Cmd + Shift + Delete

# 6. Load page in incognito mode
# This tests without cache/extensions
```

If demo data works in incognito mode:
- Issue is with your Google Sheet or config
- Not a code issue

If demo data doesn't work in incognito:
- Browser compatibility issue
- Or JavaScript disabled

---

## 📞 Still Need Help?

The dashboard includes demo data that always works. If you can see demo data but not your sheet data, the issue is definitely with:
1. Sheet accessibility
2. Sheet structure/format
3. Sheet ID in config

Review those three areas carefully!
