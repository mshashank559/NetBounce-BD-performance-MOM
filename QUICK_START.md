# Quick Start Guide - BD Performance Dashboard

## 🚀 Getting Started in 3 Steps

### Step 1: Configure Your Google Sheet
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1Qh4VMze8D64Wqbzz2UQo2zxsKYfMCZf_gzXaZVfa5Fg/edit
2. Make sure it's set to **"Anyone with the link can view"**
3. Create sheet tabs for each date in format: `DD-MM-YYYY` (e.g., `24-03-2026`, `25-03-2026`, etc.)

### Step 2: Set Up Your Data Structure
Each sheet should have these columns (in order):

| Column # | Column Name | Description |
|----------|-------------|-------------|
| 1 | BD Members | Name of team member |
| 2 | Connection Target | Daily connection goal |
| 3 | Total Connections | Actual connections made |
| 4 | Message Target | Daily message goal |
| 5 | Total No.of msg send | Actual messages sent |
| 6 | Target (Reverted message) | Expected lead responses |
| 7 | Leads (Revert msg) | Actual leads generated |
| 8 | Resume Target | Resume collection goal |
| 9 | Resume Target Achieved | Actual resumes collected |
| 10 | How many leads has been updated in the dashboard | Dashboard compliance |

### Step 3: Run the Dashboard
```bash
npm install
npm run dev
```

Visit `http://localhost:5173` and click "Refresh Data"!

## 🎯 Understanding the Dashboard

### Top Section - KPIs
- **Total Connections**: Shows aggregate connections vs target
- **Messages Sent**: Total outreach volume
- **Leads Generated**: Total leads with conversion trend
- **Resumes Collected**: Total resumes obtained

### Middle Section - Performers
- **Top Performer**: Best overall score with AI suggestions
- **Low Performer**: Needs improvement with targeted advice

### Charts Section
1. **Performance Achievement (%)**: Compare all metrics across team
2. **Activity Overview**: Trend lines for all activities
3. **📈 Daily Performance Trends**: Date-wise trends showing daily progress (visible when no filters applied)
4. **Lead Distribution**: Who's generating the most leads
5. **Performance Radar**: Individual deep-dive (when member filtered)

### Bottom Section - Team Details
Individual cards for each member with:
- Overall performance score
- Breakdown by metric
- Personalized AI suggestions

## 🔧 Customization

### Change Date Range
Edit `src/config/dashboard.ts`:
```typescript
START_DATE: '24-03-2026',  // Your start date
END_DATE: '21-04-2026',     // Your end date
```

### Change Google Sheet
Edit `src/config/dashboard.ts`:
```typescript
GOOGLE_SHEET_ID: 'YOUR_SHEET_ID_HERE'
```

### Adjust Performance Weights
Edit `src/config/dashboard.ts`:
```typescript
SCORE_WEIGHTS: {
  connectionAchievement: 0.25,  // 25%
  messageAchievement: 0.20,     // 20%
  leadConversionRate: 0.25,     // 25%
  resumeAchievement: 0.15,      // 15%
  dashboardUpdateRate: 0.15     // 15%
}
```

### Adjust AI Suggestion Thresholds
Edit `src/config/dashboard.ts`:
```typescript
THRESHOLDS: {
  lowConnectionRate: 50,        // Below this triggers warning
  highConnectionRate: 150,      // Above this triggers quality check
  lowConversionRate: 20,        // Below this needs improvement
  highConversionRate: 40,       // Above this is excellent
  // ... etc
}
```

## 📊 Adding New Dates

### For Future Dates (e.g., April 22 onwards)
1. Create new sheet tab in Google Sheets named `22-04-2026`
2. Add your data following the same column structure
3. Update `END_DATE` in `src/config/dashboard.ts` to `22-04-2026`
4. Rebuild: `npm run build`
5. Refresh the dashboard

The dashboard will automatically fetch all dates between START_DATE and END_DATE!

## 🎨 Using Filters

### Date & Time Filters

#### Filter by Specific Date
1. Click "📅 Specific Date" dropdown
2. Select a date (e.g., 24-03-2026)
3. View performance for that single day
4. Click the ✕ badge to clear

#### Filter by Month
1. Click "📆 Month View" dropdown
2. Select a month (e.g., Mar 2026)
3. View aggregated monthly performance
4. Click the ✕ badge to clear

#### Filter by Date Range
1. Select "📍 From Date" (start date)
2. Select "📍 To Date" (end date)
3. View performance for that period
4. Click the ✕ badge to clear range

**Pro Tip**: Date filters apply before member filters, so you can:
- View all members for a specific date
- View one member for a specific month
- Compare performance across different time periods

### View Individual Performance
1. Click "Select BD Member" dropdown
2. Choose a team member
3. See their detailed metrics including radar chart

### Sort Team
1. Click "Sort By" dropdown
2. Choose sorting criteria:
   - Overall Score (default)
   - Total Connections
   - Total Leads
   - Conversion Rate

## 🔄 Refreshing Data

### Manual Refresh
Click the **"Refresh Data"** button in the top right

### Auto-Refresh (Optional)
Edit `src/config/dashboard.ts`:
```typescript
AUTO_REFRESH_INTERVAL: 300000, // 5 minutes in milliseconds
```

## 💡 Reading AI Suggestions

The dashboard provides personalized suggestions for each member:
- 🎯 **Connection-related**: Increase or maintain quality
- 💬 **Message-related**: Volume and timing improvements
- 📈 **Conversion-related**: Personalization tips
- 📄 **Resume-related**: Follow-up strategies
- 📊 **Dashboard-related**: Compliance reminders
- 🏆 **Performance-related**: Overall strategy

## 🚨 Troubleshooting

### "No data fetched from Google Sheets"
1. Check if sheet is publicly accessible
2. Verify sheet tabs are named correctly (`DD-MM-YYYY`)
3. Check browser console for CORS errors
4. Dashboard will use demo data as fallback

### Charts not showing
1. Refresh the page
2. Clear browser cache
3. Check if data is present in filtered view

### Build errors
```bash
npm install  # Reinstall dependencies
npm run build
```

## 📱 Mobile Usage

The dashboard is fully responsive:
- **Desktop**: Full view with all charts
- **Tablet**: Optimized grid layout
- **Mobile**: Stacked cards, scrollable charts

## 🎓 Best Practices

1. **Daily Updates**: Update your Google Sheet daily for accurate trends
2. **Consistent Format**: Keep column structure identical across all sheet tabs
3. **Regular Refresh**: Click refresh after updating data
4. **Review AI Suggestions**: Share personalized suggestions with team members
5. **Monitor Trends**: Use the line chart to spot performance patterns

## 📈 Understanding Scores

### Overall Score Ranges
- **80-100%**: 🏆 Excellent - Top performer tier
- **60-79%**: ✅ Good - Meeting expectations
- **40-59%**: ⚠️ Average - Room for improvement
- **Below 40%**: 📉 Needs attention - Urgent improvement needed

### Metric-Specific Scores
Each metric has its own achievement calculation:
- **Connection Achievement** = (Total Connections / Target) × 100%
- **Message Achievement** = (Messages Sent / Target) × 100%
- **Lead Conversion** = (Leads / Messages) × 100%
- **Resume Achievement** = (Resumes / Target) × 100%
- **Dashboard Update** = (Dashboard Updates / Leads) × 100%

---

Need help? Check the full README.md for detailed documentation!
