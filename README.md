# BD Performance Dashboard

A comprehensive, interactive dashboard for monitoring Business Development (BD) team member performance from March 24 to April 21, 2026.

## ⭐ NEW Features - Date & Time Filtering

- **📅 Specific Date Filter**: View performance for any single day
- **📆 Month Filter**: Analyze monthly aggregated performance  
- **📍 Date Range Selector**: Custom from-to date analysis
- **📈 Daily Trends Chart**: Visualize day-by-day team performance
- **🎯 Smart Filter Badges**: Visual indicators with one-click removal
- **💡 Filter Summary Panel**: Always know what data you're viewing

## 🎯 Core Features

### Key Performance Indicators (KPIs)
- **Total Connections**: Tracks connections made vs targets
- **Messages Sent**: Monitors outreach message volume
- **Leads Generated**: Measures lead conversion from messages
- **Resumes Collected**: Tracks resume collection progress
- **Average Conversion Rate**: Overall lead conversion percentage
- **Dashboard Updates**: Monitors lead tracking compliance
- **Active BD Members**: Total team size

### Visualizations

1. **Performance Achievement Chart**: Bar chart showing achievement percentages across all metrics
2. **Activity Overview**: Line chart displaying connections, messages, leads, and resumes trends
3. **📈 Daily Performance Trends**: Date-wise trend chart showing daily team performance (visible when viewing all members)
4. **Lead Distribution**: Pie chart showing lead distribution among team members
5. **Performance Radar**: Individual team member performance across all metrics (when filtered)

### Smart Features

- **🏆 Top Performer**: Automatically identifies the highest-performing team member
- **📉 Low Performer**: Highlights team members needing improvement
- **💡 AI-Powered Suggestions**: Personalized recommendations for each team member based on:
  - Connection achievement rates
  - Message volume and effectiveness
  - Lead conversion rates
  - Resume collection performance
  - Dashboard update compliance

### Filters & Controls

#### Date & Time Filters
- **📅 Specific Date**: View data for a single date
- **📆 Month View**: Filter by month (e.g., March 2026, April 2026)
- **📍 Date Range**: Select custom date range (From Date → To Date)
- **Active Filter Display**: Visual badges showing active filters with one-click removal

#### Member & Performance Filters
- **Member Filter**: View all members or focus on individual performance
- **Sort Options**: 
  - Overall Score
  - Total Connections
  - Total Leads
  - Conversion Rate
- **Refresh Button**: Manually refresh data from Google Sheets

## 📊 Data Structure

The dashboard expects the following columns from your Google Sheet:

1. **BD Members**: Name of the BD team member
2. **Connection Target**: Daily/periodic connection goal
3. **Total Connections**: Actual connections made
4. **Message Target**: Daily/periodic message goal
5. **Total No.of msg send**: Actual messages sent
6. **Target (Reverted message)**: Expected lead responses
7. **Leads (Revert msg)**: Actual leads generated
8. **Resume Target**: Resume collection goal
9. **Resume Target Achieved**: Actual resumes collected
10. **How many leads has been updated in the dashboard**: Dashboard compliance tracking

## 🔄 Auto-Update Feature

The dashboard is designed to automatically fetch data from your Google Sheet. When you:
1. Add new data to existing sheets (March 24 - April 21)
2. Create new sheets for future dates (e.g., April 22 onwards)

Simply click the **Refresh Data** button to see the latest information.

### Google Sheets Configuration

Your Google Sheet ID: `1Qh4VMze8D64Wqbzz2UQo2zxsKYfMCZf_gzXaZVfa5Fg`

Make sure your sheet is:
- **Publicly accessible** (Anyone with the link can view)
- Each date has its own sheet tab named in format: `DD-MM-YYYY` (e.g., `24-03-2026`)

## 🎨 Color Coding

- **Blue**: Connections and general metrics
- **Purple**: Messages and communication
- **Green**: Leads and success metrics
- **Orange**: Resumes and document collection
- **Red**: Areas needing improvement
- **Indigo**: Dashboard compliance

## 📈 Performance Scoring

The Overall Score is calculated as a weighted average:
- **Connection Achievement**: 25%
- **Message Achievement**: 20%
- **Lead Conversion Rate**: 25%
- **Resume Achievement**: 15%
- **Dashboard Update Rate**: 15%

## 💻 Technical Stack

- **React**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Recharts**: Data visualization
- **Lucide React**: Icons
- **Date-fns**: Date utilities

## 🚀 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🔐 Data Privacy

All data is fetched directly from your Google Sheet. No data is stored on external servers (except what's cached in your browser).

## 📝 Notes

- The dashboard includes demo data as fallback if Google Sheets cannot be accessed (due to CORS or network issues)
- For production deployment, ensure your Google Sheet has proper sharing settings
- The dashboard automatically updates when you click refresh or reload the page
- All calculations are performed in real-time based on the latest data

## 🎯 Future Enhancements

To add new date ranges:
1. Create new sheet tabs in your Google Sheet with dates in format `DD-MM-YYYY`
2. The dashboard will automatically attempt to fetch them
3. Update the `SHEET_DATES` array in `src/utils/googleSheets.ts` if needed

---

**Dashboard Period**: March 24, 2026 - April 21, 2026
**Last Updated**: Auto-updates on refresh
