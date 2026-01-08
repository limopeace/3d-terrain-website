export const brand = {
  name: 'Mountain Vista Resort',
  tagline: 'IN THE HEART',
  taglineSuffix: 'of',
  headline: 'The Blue Ridge mountains',
  description: 'Journey to the ultimate adventure paradise.',
  logo: '/logo.svg',
  colors: {
    primary: '#456a4b',     // Sage green
    primaryDark: '#3a5a40', // Darker sage
    accent: '#d4a574',      // Gold
    accentLight: '#e5c9a8', // Light gold
    dark: '#2c2c2c',        // Charcoal
    light: '#f5f3ef',       // Cream
    white: '#ffffff',
  },
  contact: {
    propertyTypes: [
      { value: 'residences', label: 'Luxury Residences (fully furnished)' },
      { value: 'estates', label: 'The Estates (2 to 5 acre homesites)' },
      { value: 'both', label: 'Both' },
    ],
    startingPrice: '$5.8 million',
    availability: 'Summer 2026',
    residenceCount: 25,
    estateCount: 26,
  },
}

export type Brand = typeof brand
