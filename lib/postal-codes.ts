// Postal codes utility functions
// This file will be used to load and manage postal codes data

export interface PostalCode {
  postalCode: string
  postalCodeExt?: string
  freguesia: string
  council: string
  district: string
  region?: string
}

// Function to load postal codes from JSON file or database
export async function loadPostalCodes(): Promise<PostalCode[]> {
  try {
    // In production, load from a JSON file or database
    // const response = await fetch('/api/postal-codes/all')
    // return await response.json()
    
    // For now, return empty array
    // You'll need to populate this with actual data
    return []
  } catch (error) {
    console.error('Error loading postal codes:', error)
    return []
  }
}

// Function to search postal codes locally
export function searchPostalCodes(query: string, data: PostalCode[]): PostalCode[] {
  const normalizedQuery = query.toLowerCase().trim()
  
  if (!normalizedQuery) {
    return []
  }

  // Search by postal code (4 digits)
  if (/^\d{4}$/.test(normalizedQuery)) {
    return data.filter(item => item.postalCode.startsWith(normalizedQuery))
  }

  // Search by name
  return data.filter(item => 
    item.freguesia.toLowerCase().includes(normalizedQuery) ||
    item.council.toLowerCase().includes(normalizedQuery) ||
    item.district.toLowerCase().includes(normalizedQuery)
  )
}

