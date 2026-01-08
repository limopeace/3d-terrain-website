export interface Location {
  id: string
  name: string
  position: [number, number, number]
  cameraPosition: [number, number, number]
  description: string
}

export const locations: Location[] = [
  {
    id: 'lodge',
    name: 'The Lodge',
    position: [0, 8, 0],
    cameraPosition: [15, 20, 25],
    description: 'The heart of the resort experience',
  },
  {
    id: 'pool',
    name: 'Infinity Pool',
    position: [-20, 6, 15],
    cameraPosition: [-5, 18, 30],
    description: 'Breathtaking mountain views',
  },
  {
    id: 'golf',
    name: 'Golf Course',
    position: [-25, 4, 35],
    cameraPosition: [-10, 15, 50],
    description: 'Championship 18-hole course',
  },
  {
    id: 'treehouses',
    name: 'Tree Houses',
    position: [30, 10, 20],
    cameraPosition: [45, 22, 35],
    description: 'Luxury elevated living',
  },
  {
    id: 'spa',
    name: 'Spa & Wellness',
    position: [15, 5, -15],
    cameraPosition: [30, 18, -5],
    description: 'Rejuvenation in nature',
  },
  {
    id: 'observatory',
    name: 'Observatory',
    position: [5, 15, -30],
    cameraPosition: [20, 28, -20],
    description: 'Stargazing at 3,000 feet',
  },
]
