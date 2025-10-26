// Script to update postal codes database from CTT API
// Run this weekly: npm run update-postal-codes

const fs = require('fs')
const path = require('path')

async function updatePostalCodesDatabase() {
  console.log('Starting postal codes database update...')
  
  try {
    // Download data from CTT API
    const response = await fetch('https://api.cttcodigopostal.pt/api/v1/postalcodes/all')
    
    if (!response.ok) {
      throw new Error('Failed to fetch data from CTT API')
    }
    
    const data = await response.json()
    
    // Transform data to our format
    const postalCodes = data.map(item => ({
      postalCode: item.postalCode,
      postalCodeExt: item.postalCodeExt,
      freguesia: item.freguesia || '',
      council: item.county || item.council || '',
      district: item.district || '',
      region: item.region || ''
    }))
    
    // Save to JSON file
    const dataPath = path.join(__dirname, '../data/postal-codes.json')
    
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(dataPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    // Write data to file
    fs.writeFileSync(dataPath, JSON.stringify(postalCodes, null, 2))
    
    console.log(`✅ Successfully updated ${postalCodes.length} postal codes`)
    console.log(`📁 Data saved to: ${dataPath}`)
    
    // Also create index file for faster search
    const indexPath = path.join(__dirname, '../data/postal-codes-index.json')
    
    const index = {
      byPostalCode: {},
      byCouncil: {},
      byDistrict: {},
      lastUpdate: new Date().toISOString()
    }
    
    postalCodes.forEach(code => {
      // Index by postal code
      if (!index.byPostalCode[code.postalCode]) {
        index.byPostalCode[code.postalCode] = []
      }
      index.byPostalCode[code.postalCode].push(code)
      
      // Index by council
      if (code.council) {
        const councilKey = code.council.toLowerCase()
        if (!index.byCouncil[councilKey]) {
          index.byCouncil[councilKey] = []
        }
        index.byCouncil[councilKey].push(code)
      }
      
      // Index by district
      if (code.district) {
        const districtKey = code.district.toLowerCase()
        if (!index.byDistrict[districtKey]) {
          index.byDistrict[districtKey] = []
        }
        index.byDistrict[districtKey].push(code)
      }
    })
    
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2))
    console.log(`✅ Index file created: ${indexPath}`)
    
  } catch (error) {
    console.error('❌ Error updating postal codes:', error)
    process.exit(1)
  }
}

// Run the update
updatePostalCodesDatabase()

