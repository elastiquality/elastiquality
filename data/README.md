# Postal Codes Database

This directory contains the postal codes database for Portugal.

## Files

- `postal-codes.json` - Complete database of all postal codes
- `postal-codes-index.json` - Indexed version for faster searches

## Updating the Database

Run the update script weekly to keep the data fresh:

```bash
npm run update-postal-codes
```

This script will:
1. Download the latest postal codes data from the CTT API
2. Transform the data to our format
3. Create an indexed version for faster searches
4. Save both files in this directory

## Usage

The postal codes data is used by the Hero component for location autocomplete.

### Benefits of Local Database

- ✅ Faster response times (no external API calls)
- ✅ Offline functionality
- ✅ No rate limits
- ✅ Full control over data
- ✅ Better user experience

## Data Format

```json
{
  "postalCode": "1000",
  "postalCodeExt": "001",
  "freguesia": "Areeiro",
  "council": "Lisboa",
  "district": "Lisboa",
  "region": "Área Metropolitana de Lisboa"
}
```

