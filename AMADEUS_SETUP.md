# Amadeus API Setup Guide

This guide will help you set up the Amadeus API for real flight data integration.

## Step 1: Create Amadeus Developer Account

1. Go to [Amadeus for Developers](https://developers.amadeus.com/)
2. Click "Register" and create a free account
3. Verify your email address

## Step 2: Create a New Application

1. Log in to your Amadeus developer dashboard
2. Click "Create New App"
3. Fill in the application details:
   - **Application Name**: Flight Booking System
   - **Application Type**: Web Application
   - **Description**: Flight booking system for Indian domestic flights
4. Click "Create"

## Step 3: Get API Credentials

1. After creating the app, you'll see your credentials:
   - **API Key** (Client ID)
   - **API Secret** (Client Secret)
2. Copy these credentials

## Step 4: Configure Environment Variables

1. Open your `backend/.env` file
2. Add your Amadeus credentials:

\`\`\`env
# Amadeus API Configuration
AMADEUS_CLIENT_ID=your_api_key_here
AMADEUS_CLIENT_SECRET=your_api_secret_here
\`\`\`

## Step 5: Test the Integration

1. Start your backend server: `npm run dev`
2. The system will automatically try to use Amadeus API for flight searches
3. If the API is unavailable, it will fall back to local data

## API Limits

### Test Environment (Free)
- **Flight Offers Search**: 2,000 calls/month
- **Flight Offers Price**: 2,000 calls/month
- **Flight Create Orders**: 10 calls/month

### Production Environment
- Requires approval and payment
- Higher rate limits available

## Supported Features

✅ **Currently Implemented:**
- Flight search with real-time pricing
- Indian domestic routes
- Multiple travel classes
- Price comparison

🚧 **Future Enhancements:**
- Real flight booking (requires production API)
- Seat maps
- Flight status updates
- Baggage information

## Troubleshooting

### Common Issues:

1. **Authentication Failed**
   - Check your API credentials
   - Ensure no extra spaces in environment variables

2. **No Flights Found**
   - Amadeus may not have data for all Indian routes
   - System will fall back to local data automatically

3. **Rate Limit Exceeded**
   - You've exceeded the monthly quota
   - System will use local data until next month

4. **API Timeout**
   - Network issues or API downtime
   - System automatically falls back to local data

## Testing Routes

Good test routes for Indian domestic flights:
- Delhi (DEL) → Mumbai (BOM)
- Mumbai (BOM) → Bangalore (BLR)
- Delhi (DEL) → Bangalore (BLR)
- Chennai (MAA) → Delhi (DEL)

## Production Deployment

For production use:
1. Apply for production access on Amadeus portal
2. Update environment variables with production credentials
3. Implement proper error handling and monitoring
4. Set up caching to reduce API calls

## Support

- [Amadeus API Documentation](https://developers.amadeus.com/self-service)
- [Community Forum](https://developers.amadeus.com/support)
- [API Reference](https://developers.amadeus.com/self-service/category/air/api-doc)
\`\`\`

Update the package.json to include the new setup script:
