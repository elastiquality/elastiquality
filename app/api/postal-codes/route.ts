import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Type definitions for postal code data
interface PostalCode {
  postalCode: string
  postalCodeExt?: string
  freguesia: string
  council: string
  district: string
}

// Load postal codes from JSON file
function loadPostalCodes(): PostalCode[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'postal-codes.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Error loading postal codes:', error)
    return []
  }
}

const postalCodesData = loadPostalCodes()

// Helper function to search postal codes
function searchPostalCodes(query: string): PostalCode[] {
  const normalizedQuery = query.toLowerCase().trim()
  
  if (!normalizedQuery) {
    return []
  }

  // Search by postal code (4 digits)
  if (/^\d{4}$/.test(normalizedQuery)) {
    return postalCodesData.filter(
      item => item.postalCode.startsWith(normalizedQuery)
    )
  }

  // Search by name (freguesia, council, or district)
  return postalCodesData.filter(item => 
    item.freguesia.toLowerCase().includes(normalizedQuery) ||
    item.council.toLowerCase().includes(normalizedQuery) ||
    item.district.toLowerCase().includes(normalizedQuery)
  )
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const postalCode = searchParams.get('postalCode')
  
  try {
    // Search by postal code
    if (postalCode) {
      const results = postalCodesData.filter(
        item => item.postalCode === postalCode
      )
      
      return NextResponse.json(results)
    }

    // Search by query
    if (query) {
      const results = searchPostalCodes(query)
      return NextResponse.json(results)
    }

    // No query provided
    return NextResponse.json([])

  } catch (error) {
    console.error('Postal codes API error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

