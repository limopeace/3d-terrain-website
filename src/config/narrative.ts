/**
 * Narrative Configuration for Scrollytelling
 * Defines camera keyframes and text sections for scroll-driven experience
 */

export interface CameraKeyframe {
  offset: number           // 0-1 scroll position
  position: [number, number, number]  // Camera position
  target: [number, number, number]    // Look-at target
  fov?: number            // Optional FOV change
}

export interface NarrativeSection {
  id: string
  scrollStart: number     // When section starts (0-1)
  scrollEnd: number       // When section ends (0-1)
  title: string
  subtitle?: string
  description: string
  align?: 'left' | 'center' | 'right'
  theme?: 'light' | 'dark'
  cta?: {
    text: string
    action: 'scroll' | 'modal' | 'link'
    target?: string
  }
}

export interface POIConfig {
  id: string
  name: string
  position: [number, number, number]
  highlightAtScroll?: [number, number]  // [start, end] scroll range
  icon?: string
  description?: string
}

export interface NarrativeConfig {
  title: string
  subtitle: string
  totalPages: number      // ScrollControls pages prop
  damping: number         // Scroll damping (0.1 = smooth)
  sections: NarrativeSection[]
  cameraKeyframes: CameraKeyframe[]
  pois: POIConfig[]
}

// Default narrative for Mountain Vista Resort demo
export const defaultNarrative: NarrativeConfig = {
  title: 'Mountain Vista Resort',
  subtitle: 'A Journey Through Nature',
  totalPages: 5,
  damping: 0.1,

  sections: [
    {
      id: 'intro',
      scrollStart: 0,
      scrollEnd: 0.18,
      title: 'IN THE HEART OF',
      subtitle: 'The Shivalik Mountains',
      description: 'Discover a sanctuary where ancient peaks meet modern luxury.',
      align: 'center',
      theme: 'dark',
      cta: {
        text: 'Begin Your Journey',
        action: 'scroll'
      }
    },
    {
      id: 'overview',
      scrollStart: 0.2,
      scrollEnd: 0.38,
      title: 'Breathtaking Terrain',
      description: 'Spanning 500 acres of pristine mountain landscape, with elevation changes that create a dramatic natural amphitheater.',
      align: 'left',
      theme: 'light'
    },
    {
      id: 'experience',
      scrollStart: 0.4,
      scrollEnd: 0.58,
      title: 'Immersive Experiences',
      description: 'From sunrise yoga on mountain peaks to stargazing in clear mountain air. Every moment is designed to reconnect you with nature.',
      align: 'right',
      theme: 'light'
    },
    {
      id: 'amenities',
      scrollStart: 0.6,
      scrollEnd: 0.78,
      title: 'World-Class Amenities',
      description: 'Luxurious accommodations, farm-to-table dining, spa retreats, and adventure sports - all nestled in the embrace of the mountains.',
      align: 'left',
      theme: 'light'
    },
    {
      id: 'cta',
      scrollStart: 0.8,
      scrollEnd: 1,
      title: 'Your Escape Awaits',
      description: 'Book your journey to the mountains and experience the extraordinary.',
      align: 'center',
      theme: 'dark',
      cta: {
        text: 'Inquire Now',
        action: 'modal'
      }
    }
  ],

  cameraKeyframes: [
    // Intro - high establishing shot
    { offset: 0, position: [0, 120, 180], target: [0, 0, 0], fov: 45 },
    // Descending toward terrain
    { offset: 0.15, position: [30, 80, 140], target: [0, 10, 0], fov: 50 },
    // Low angle dramatic view
    { offset: 0.3, position: [60, 40, 80], target: [0, 15, 0], fov: 55 },
    // Sweeping side view
    { offset: 0.45, position: [-40, 50, 60], target: [10, 10, 0], fov: 50 },
    // Orbiting overview
    { offset: 0.6, position: [-60, 70, 100], target: [0, 5, 0], fov: 48 },
    // Rising for panorama
    { offset: 0.75, position: [-20, 100, 120], target: [0, 0, 0], fov: 45 },
    // Final majestic view
    { offset: 0.9, position: [0, 90, 150], target: [0, 10, 0], fov: 42 },
    // End position
    { offset: 1, position: [0, 80, 140], target: [0, 5, 0], fov: 45 }
  ],

  pois: [
    {
      id: 'lodge',
      name: 'The Lodge',
      position: [0, 8, 0],
      highlightAtScroll: [0.35, 0.45],
      description: 'Main resort building with panoramic views'
    },
    {
      id: 'spa',
      name: 'Mountain Spa',
      position: [-25, 6, 15],
      highlightAtScroll: [0.55, 0.65],
      description: 'Wellness center and hot springs'
    },
    {
      id: 'peak',
      name: 'Summit Point',
      position: [30, 15, -20],
      highlightAtScroll: [0.25, 0.35],
      description: 'Highest viewpoint on the property'
    }
  ]
}

// Airbnb-style narrative for property showcases
export const airbnbNarrative: NarrativeConfig = {
  title: 'Mountain Retreat',
  subtitle: 'Your Private Escape',
  totalPages: 4,
  damping: 0.15,

  sections: [
    {
      id: 'welcome',
      scrollStart: 0,
      scrollEnd: 0.23,
      title: 'Welcome to Your',
      subtitle: 'Mountain Getaway',
      description: 'A secluded cabin surrounded by nature, perfect for your next adventure.',
      align: 'center',
      theme: 'dark'
    },
    {
      id: 'location',
      scrollStart: 0.25,
      scrollEnd: 0.48,
      title: 'Prime Location',
      description: 'Nestled in the foothills with easy access to hiking trails, local villages, and stunning viewpoints.',
      align: 'left',
      theme: 'light'
    },
    {
      id: 'surroundings',
      scrollStart: 0.5,
      scrollEnd: 0.73,
      title: 'Natural Beauty',
      description: 'Wake up to bird songs and mountain views. Fall asleep under a blanket of stars.',
      align: 'right',
      theme: 'light'
    },
    {
      id: 'book',
      scrollStart: 0.75,
      scrollEnd: 1,
      title: 'Book Your Stay',
      description: 'Available for short stays and extended retreats. Check availability now.',
      align: 'center',
      theme: 'dark',
      cta: {
        text: 'Check Availability',
        action: 'modal'
      }
    }
  ],

  cameraKeyframes: [
    { offset: 0, position: [0, 100, 150], target: [0, 0, 0] },
    { offset: 0.25, position: [40, 50, 80], target: [0, 10, 0] },
    { offset: 0.5, position: [-30, 40, 60], target: [0, 5, 0] },
    { offset: 0.75, position: [0, 60, 100], target: [0, 10, 0] },
    { offset: 1, position: [0, 70, 120], target: [0, 5, 0] }
  ],

  pois: [
    {
      id: 'cabin',
      name: 'The Cabin',
      position: [0, 8, 0],
      highlightAtScroll: [0.2, 0.4]
    }
  ]
}

// Golf course narrative
export const golfNarrative: NarrativeConfig = {
  title: 'Highland Links',
  subtitle: 'Championship Golf',
  totalPages: 5,
  damping: 0.12,

  sections: [
    {
      id: 'intro',
      scrollStart: 0,
      scrollEnd: 0.18,
      title: 'CHAMPIONSHIP GOLF',
      subtitle: 'In the Mountains',
      description: '18 holes of pure golfing excellence, carved into the natural landscape.',
      align: 'center',
      theme: 'dark'
    },
    {
      id: 'course',
      scrollStart: 0.2,
      scrollEnd: 0.38,
      title: 'The Course',
      description: 'A par 72 masterpiece that challenges players of all skill levels while showcasing stunning mountain vistas.',
      align: 'left',
      theme: 'light'
    },
    {
      id: 'signature',
      scrollStart: 0.4,
      scrollEnd: 0.58,
      title: 'Signature Holes',
      description: 'Our famous 7th hole offers a dramatic cliff-side tee shot with a 200-foot elevation drop.',
      align: 'right',
      theme: 'light'
    },
    {
      id: 'clubhouse',
      scrollStart: 0.6,
      scrollEnd: 0.78,
      title: 'The Clubhouse',
      description: 'Relax in our mountain-view clubhouse with fine dining, pro shop, and member lounges.',
      align: 'left',
      theme: 'light'
    },
    {
      id: 'membership',
      scrollStart: 0.8,
      scrollEnd: 1,
      title: 'Join Us',
      description: 'Membership and tee time reservations now available.',
      align: 'center',
      theme: 'dark',
      cta: {
        text: 'Book Tee Time',
        action: 'modal'
      }
    }
  ],

  cameraKeyframes: [
    { offset: 0, position: [0, 120, 180], target: [0, 0, 0] },
    { offset: 0.2, position: [50, 60, 100], target: [0, 5, 0] },
    { offset: 0.4, position: [80, 40, 60], target: [20, 10, 0] },
    { offset: 0.6, position: [-40, 50, 80], target: [0, 5, 0] },
    { offset: 0.8, position: [-20, 80, 120], target: [0, 0, 0] },
    { offset: 1, position: [0, 90, 140], target: [0, 5, 0] }
  ],

  pois: [
    { id: 'tee1', name: 'Hole 1', position: [20, 6, 30] },
    { id: 'tee7', name: 'Signature 7th', position: [40, 12, -20] },
    { id: 'clubhouse', name: 'Clubhouse', position: [-15, 8, 25] }
  ]
}

// Helper to get narrative by type
export type NarrativeType = 'default' | 'airbnb' | 'golf'

export function getNarrative(type: NarrativeType): NarrativeConfig {
  switch (type) {
    case 'airbnb':
      return airbnbNarrative
    case 'golf':
      return golfNarrative
    default:
      return defaultNarrative
  }
}
