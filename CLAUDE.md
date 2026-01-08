# 3D Terrain Scrollytelling Platform

A reusable 3D scrollytelling platform for showcasing locations like Airbnb properties, golf courses, resorts, and real estate.

## Quick Start

```bash
npm install
npm run dev     # Development server
npm run build   # Production build
```

## Architecture Overview

### Terrain System

The platform supports two terrain modes:

1. **Procedural Terrain** (default) - Generated using simplex noise, works offline
2. **Real-World Terrain** - Uses FREE elevation APIs (no credit card required)

**Configuration:** `src/config/terrain.ts`

```typescript
export const terrainSettings: TerrainSettings = {
  type: 'procedural',  // or 'realworld'
  apiProvider: 'openmeteo',  // 'auto' | 'opentopodata' | 'openmeteo' | 'openelevation'
  useCache: true,  // Cache in localStorage (24h TTL)
}
```

### Free Elevation APIs

| API | Resolution | Rate Limit | Best For |
|-----|-----------|------------|----------|
| Open Topo Data | 30m | 1000/day | High detail |
| Open-Meteo | 90m | Unlimited | Reliability |
| Open-Elevation | 30-90m | ~1000/month | Fallback |

**API Client:** `src/lib/terrain-api.ts`

### Scrollytelling System

Uses `@react-three/drei` ScrollControls for scroll-driven camera movement:

```
User scrolls → useScroll().offset (0-1) → Camera interpolates between keyframes
                                        → Narrative text fades in/out
```

**Key Components:**

- `ScrollytellingScene.tsx` - Wraps scene in ScrollControls
- `ScrollDrivenCamera.tsx` - Interpolates camera position based on scroll
- `NarrativeOverlay.tsx` - HTML text that appears/fades based on scroll

### Site Configuration

**Master Config:** `src/config/site.ts`

```typescript
export interface SiteConfig {
  id: string
  name: string
  brand: BrandConfig         // Colors, logo, contact
  location: LocationConfig   // lat/lng/area
  narrative: NarrativeConfig // Camera keyframes, text sections
  inquiryForm: InquiryFormConfig
  features: {
    enableScrollytelling: boolean
    enableExploration: boolean
  }
}
```

**Preset Configurations:**
- `mountainResortConfig` - Default demo
- `airbnbPropertyConfig` - Vacation rentals
- `golfCourseConfig` - Golf course showcase
- `realEstateConfig` - Property listings

## Adding a New Location

1. **Update `src/config/site.ts`:**

```typescript
export const myLocationConfig: SiteConfig = {
  id: 'my-location',
  name: 'My Location Name',
  brand: {
    name: 'Brand Name',
    tagline: 'Tagline',
    colors: { primary: '#...', accent: '#...', dark: '#...', light: '#...' }
  },
  location: {
    lat: YOUR_LATITUDE,
    lng: YOUR_LONGITUDE,
    areaKm: 10,  // 5-30km recommended
    name: 'Location Name'
  },
  narrative: {
    title: 'Your Title',
    totalPages: 5,
    cameraKeyframes: [
      { offset: 0, position: [0, 120, 180], target: [0, 0, 0], fov: 45 },
      { offset: 0.3, position: [60, 40, 80], target: [0, 15, 0], fov: 55 },
      // ... more keyframes
    ],
    sections: [
      { id: 'intro', scrollStart: 0, scrollEnd: 0.2, title: '...', description: '...' },
      // ... more sections
    ],
    pois: []
  },
  // ... rest of config
}
```

2. **Set as active:**

```typescript
export const activeSiteConfig: SiteConfig = myLocationConfig
```

3. **For real-world terrain, enable in `src/config/terrain.ts`:**

```typescript
type: 'realworld',
realworld: {
  lat: YOUR_LATITUDE,
  lng: YOUR_LONGITUDE,
  areaKm: 10,
  resolution: 64,
  verticalExaggeration: 2.0
}
```

## Experience Modes

1. **Loading** - Initial load screen
2. **Intro** - Hero overlay with "Explore" button
3. **Scrollytelling** - Scroll-driven camera and narrative
4. **Exploration** - Free camera exploration (OrbitControls)

Mode switcher at bottom allows switching between Story and Explore modes.

## File Structure

```
src/
├── app/
│   └── page.tsx              # Main page with mode management
├── components/
│   ├── scene/
│   │   ├── TerrainScene.tsx      # Exploration mode scene
│   │   ├── ScrollytellingScene.tsx # Scrollytelling scene
│   │   ├── ScrollDrivenCamera.tsx  # Scroll-driven camera
│   │   ├── Terrain.tsx           # Procedural terrain
│   │   ├── RealWorldTerrain.tsx  # API-based terrain
│   │   ├── Vegetation.tsx        # Trees
│   │   ├── Clouds.tsx            # Animated clouds
│   │   └── Birds.tsx             # Flying birds
│   └── ui/
│       ├── NarrativeOverlay.tsx  # Scroll text overlay
│       ├── Header.tsx            # Navigation header
│       ├── HeroOverlay.tsx       # Intro screen
│       ├── InquireModal.tsx      # Contact form modal
│       └── LoadingScreen.tsx     # Loading progress
├── config/
│   ├── site.ts                # Master site configuration
│   ├── narrative.ts           # Narrative and camera config
│   ├── terrain.ts             # Terrain settings
│   ├── brand.ts               # Brand defaults
│   └── locations.ts           # POI locations
└── lib/
    ├── terrain-api.ts         # Free elevation API client
    └── noise.ts               # Simplex noise utility
```

## Camera Keyframe Reference

```typescript
interface CameraKeyframe {
  offset: number    // 0-1 scroll position
  position: [x, y, z]  // Camera position
  target: [x, y, z]    // Look-at point
  fov?: number         // Optional field of view
}
```

**Tips:**
- Start with high altitude (y: 100-150) for establishing shot
- Mid-scroll: lower altitude, closer to terrain
- Use target to control what camera looks at
- FOV 45-60 for most scenes

## Narrative Section Reference

```typescript
interface NarrativeSection {
  id: string
  scrollStart: number  // 0-1 when section starts
  scrollEnd: number    // 0-1 when section ends
  title: string
  subtitle?: string
  description: string
  align?: 'left' | 'center' | 'right'
  theme?: 'light' | 'dark'
  cta?: { text: string, action: 'modal' | 'scroll' | 'link' | 'explore' }
}
```

## Dependencies

- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers (ScrollControls, Environment, etc.)
- `three` - 3D library
- `framer-motion` - Animations
- `simplex-noise` - Procedural terrain generation

## Troubleshooting

### API Errors
- Switch to `apiProvider: 'openmeteo'` (most reliable for CORS)
- Enable `useCache: true` to avoid rate limits
- Use `type: 'procedural'` for offline development

### Scroll Not Working
- Ensure ScrollControls wraps the scene
- Check that pages prop is set correctly
- ScrollDrivenCamera must be inside ScrollControls

### Performance
- Reduce terrain resolution (64 instead of 128)
- Lower tree/cloud counts in Vegetation/Clouds components
- Use `dpr={[1, 1.5]}` instead of `[1, 2]` on Canvas

## License

Private - Internal use only
