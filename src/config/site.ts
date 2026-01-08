/**
 * Master Site Configuration
 * Single file to configure any scrollytelling terrain experience
 *
 * Use cases:
 * - Airbnb property showcase
 * - Golf course tour
 * - Resort/hotel virtual tour
 * - Real estate presentation
 * - Tourism destination
 */

import { NarrativeConfig, defaultNarrative, airbnbNarrative, golfNarrative } from './narrative'
import { presetLocations, TerrainSettings, terrainSettings as defaultTerrainSettings } from './terrain'
import { brand as sourceBrand } from './brand'

// Brand configuration
export interface BrandConfig {
  name: string
  tagline: string
  logo?: string
  colors: {
    primary: string
    accent: string
    dark: string
    light: string
  }
  contact?: {
    email?: string
    phone?: string
    address?: string
  }
}

// Location configuration
export interface LocationConfig {
  lat: number
  lng: number
  areaKm: number
  name: string
  description?: string
}

// Form field configuration
export interface FormFieldConfig {
  name: string
  label: string
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'checkbox'
  required?: boolean
  options?: string[]  // For select type
  placeholder?: string
}

// Inquiry form configuration
export interface InquiryFormConfig {
  title: string
  subtitle?: string
  fields: FormFieldConfig[]
  submitText: string
  privacyText?: string
}

// Complete site configuration
export interface SiteConfig {
  // Basic info
  id: string
  name: string
  description: string

  // Branding
  brand: BrandConfig

  // Location (for terrain)
  location: LocationConfig

  // Terrain settings
  terrain: {
    type: 'procedural' | 'realworld'
    resolution: number
    verticalExaggeration: number
  }

  // Scrollytelling narrative
  narrative: NarrativeConfig

  // Inquiry form
  inquiryForm: InquiryFormConfig

  // Feature flags
  features: {
    enableScrollytelling: boolean
    enableExploration: boolean
    showTerrainInfo: boolean
    enableAudio: boolean
  }
}

// ============================================
// PRESET SITE CONFIGURATIONS
// ============================================

/**
 * Mountain Resort Demo (Default)
 * Based on Chandigarh/Shivalik region
 */
// Default brand adapted from sourceBrand for SiteConfig compatibility
const defaultBrand: BrandConfig = {
  name: sourceBrand.name,
  tagline: sourceBrand.tagline,
  logo: sourceBrand.logo,
  colors: {
    primary: sourceBrand.colors.primary,
    accent: sourceBrand.colors.accent,
    dark: sourceBrand.colors.dark,
    light: sourceBrand.colors.light,
  },
}

export const mountainResortConfig: SiteConfig = {
  id: 'mountain-resort',
  name: 'Mountain Vista Resort',
  description: 'Luxury mountain resort experience',

  brand: defaultBrand,

  location: {
    lat: presetLocations.chandigarh.lat,
    lng: presetLocations.chandigarh.lng,
    areaKm: presetLocations.chandigarh.areaKm,
    name: presetLocations.chandigarh.name,
    description: presetLocations.chandigarh.description
  },

  terrain: {
    type: 'realworld',
    resolution: 64,
    verticalExaggeration: 2.0
  },

  narrative: defaultNarrative,

  inquiryForm: {
    title: 'Plan Your Visit',
    subtitle: 'Our team will contact you within 24 hours',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'phone', required: true },
      { name: 'interest', label: 'Interest', type: 'select', required: true,
        options: ['Lodging', 'Events', 'Activities', 'Membership', 'Other'] },
      { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Tell us about your plans...' },
      { name: 'newsletter', label: 'Subscribe to newsletter', type: 'checkbox' }
    ],
    submitText: 'Submit Inquiry',
    privacyText: 'By submitting, you agree to our privacy policy.'
  },

  features: {
    enableScrollytelling: true,
    enableExploration: true,
    showTerrainInfo: false,
    enableAudio: false
  }
}

/**
 * Airbnb Property Showcase
 * Perfect for vacation rentals
 */
export const airbnbPropertyConfig: SiteConfig = {
  id: 'airbnb-property',
  name: 'Mountain Retreat',
  description: 'Your private mountain getaway',

  brand: {
    name: 'Mountain Retreat',
    tagline: 'Your Private Escape',
    colors: {
      primary: '#FF5A5F',  // Airbnb red
      accent: '#00A699',   // Airbnb teal
      dark: '#484848',
      light: '#FFFFFF'
    }
  },

  location: {
    lat: presetLocations.shimla.lat,
    lng: presetLocations.shimla.lng,
    areaKm: 10,
    name: 'Shimla Hills',
    description: 'Nestled in the Himachal hills'
  },

  terrain: {
    type: 'realworld',
    resolution: 64,
    verticalExaggeration: 2.5
  },

  narrative: airbnbNarrative,

  inquiryForm: {
    title: 'Check Availability',
    fields: [
      { name: 'name', label: 'Your Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'checkIn', label: 'Check-in Date', type: 'text', placeholder: 'DD/MM/YYYY' },
      { name: 'checkOut', label: 'Check-out Date', type: 'text', placeholder: 'DD/MM/YYYY' },
      { name: 'guests', label: 'Number of Guests', type: 'select',
        options: ['1', '2', '3', '4', '5', '6+'] },
      { name: 'message', label: 'Special Requests', type: 'textarea' }
    ],
    submitText: 'Check Availability',
    privacyText: 'We respect your privacy.'
  },

  features: {
    enableScrollytelling: true,
    enableExploration: false,
    showTerrainInfo: false,
    enableAudio: false
  }
}

/**
 * Golf Course Showcase
 */
export const golfCourseConfig: SiteConfig = {
  id: 'golf-course',
  name: 'Highland Links',
  description: 'Championship golf in the mountains',

  brand: {
    name: 'Highland Links',
    tagline: 'Championship Golf',
    colors: {
      primary: '#1a472a',  // Golf green
      accent: '#c9a227',   // Gold
      dark: '#1a1a1a',
      light: '#f5f5f0'
    }
  },

  location: {
    lat: presetLocations.blueRidge.lat,
    lng: presetLocations.blueRidge.lng,
    areaKm: 8,
    name: 'Blue Ridge Highlands',
    description: 'Virginia mountain golf'
  },

  terrain: {
    type: 'realworld',
    resolution: 64,
    verticalExaggeration: 1.5
  },

  narrative: golfNarrative,

  inquiryForm: {
    title: 'Book Your Tee Time',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'phone', required: true },
      { name: 'date', label: 'Preferred Date', type: 'text', placeholder: 'DD/MM/YYYY' },
      { name: 'time', label: 'Preferred Time', type: 'select',
        options: ['Morning (6-9am)', 'Mid-Morning (9-12pm)', 'Afternoon (12-3pm)', 'Late (3-6pm)'] },
      { name: 'players', label: 'Number of Players', type: 'select',
        options: ['1', '2', '3', '4'] },
      { name: 'membership', label: 'Interested in membership', type: 'checkbox' }
    ],
    submitText: 'Request Tee Time',
    privacyText: 'Member rates available.'
  },

  features: {
    enableScrollytelling: true,
    enableExploration: true,
    showTerrainInfo: false,
    enableAudio: false
  }
}

/**
 * Real Estate Showcase
 */
export const realEstateConfig: SiteConfig = {
  id: 'real-estate',
  name: 'Sunset Valley Estates',
  description: 'Premium mountain homesites',

  brand: {
    name: 'Sunset Valley Estates',
    tagline: 'Live Elevated',
    colors: {
      primary: '#2c3e50',
      accent: '#e67e22',
      dark: '#1a1a1a',
      light: '#ecf0f1'
    }
  },

  location: {
    lat: presetLocations.tuscanyHills.lat,
    lng: presetLocations.tuscanyHills.lng,
    areaKm: 12,
    name: 'Tuscan Hills',
    description: 'Rolling countryside'
  },

  terrain: {
    type: 'realworld',
    resolution: 64,
    verticalExaggeration: 1.8
  },

  narrative: {
    ...defaultNarrative,
    title: 'Sunset Valley Estates',
    subtitle: 'Premium Homesites',
    sections: [
      {
        id: 'intro',
        scrollStart: 0,
        scrollEnd: 0.2,
        title: 'LIVE ELEVATED',
        subtitle: 'Premium Mountain Homesites',
        description: 'Discover your perfect piece of paradise in our exclusive mountain community.',
        align: 'center',
        theme: 'dark'
      },
      {
        id: 'lots',
        scrollStart: 0.25,
        scrollEnd: 0.45,
        title: 'Select Homesites',
        description: 'Choose from 50+ premium lots ranging from 2 to 10 acres, each with stunning views and privacy.',
        align: 'left',
        theme: 'light'
      },
      {
        id: 'amenities',
        scrollStart: 0.5,
        scrollEnd: 0.7,
        title: 'Community Amenities',
        description: 'Private clubhouse, hiking trails, equestrian center, and 24-hour security.',
        align: 'right',
        theme: 'light'
      },
      {
        id: 'cta',
        scrollStart: 0.75,
        scrollEnd: 1,
        title: 'Schedule a Tour',
        description: 'Experience the beauty firsthand. Private tours available by appointment.',
        align: 'center',
        theme: 'dark',
        cta: { text: 'Schedule Tour', action: 'modal' }
      }
    ]
  },

  inquiryForm: {
    title: 'Schedule a Tour',
    subtitle: 'Experience the community firsthand',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'phone', required: true },
      { name: 'budget', label: 'Budget Range', type: 'select',
        options: ['$500K - $750K', '$750K - $1M', '$1M - $2M', '$2M+'] },
      { name: 'timeline', label: 'Purchase Timeline', type: 'select',
        options: ['Immediately', '3-6 months', '6-12 months', 'Just exploring'] },
      { name: 'broker', label: 'I am a real estate broker', type: 'checkbox' }
    ],
    submitText: 'Request Tour',
    privacyText: 'Broker inquiries welcome.'
  },

  features: {
    enableScrollytelling: true,
    enableExploration: true,
    showTerrainInfo: false,
    enableAudio: false
  }
}

// ============================================
// ACTIVE SITE CONFIGURATION
// ============================================

/**
 * Current active site config
 * Change this to switch between different site presets
 */
export const activeSiteConfig: SiteConfig = airbnbPropertyConfig

// Available presets for demo/testing
export const sitePresets = {
  mountainResort: mountainResortConfig,
  airbnb: airbnbPropertyConfig,
  golf: golfCourseConfig,
  realEstate: realEstateConfig
}

// Helper to create custom config
export function createSiteConfig(
  partial: Partial<SiteConfig> & { id: string; location: LocationConfig }
): SiteConfig {
  return {
    ...mountainResortConfig,
    ...partial,
    brand: { ...mountainResortConfig.brand, ...partial.brand },
    terrain: { ...mountainResortConfig.terrain, ...partial.terrain },
    features: { ...mountainResortConfig.features, ...partial.features }
  }
}
