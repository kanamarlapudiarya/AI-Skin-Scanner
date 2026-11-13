export interface BodyRegion {
  id: string
  name: string
  sensitive?: boolean
}

export const BODY_REGIONS: BodyRegion[] = [
  { id: 'head_face', name: 'Head / Face' },
  { id: 'neck', name: 'Neck' },
  { id: 'chest', name: 'Chest' },
  { id: 'abdomen', name: 'Abdomen' },
  { id: 'upper_back', name: 'Upper Back' },
  { id: 'lower_back', name: 'Lower Back' },
  { id: 'upper_arms', name: 'Upper Arms' },
  { id: 'forearms', name: 'Forearms' },
  { id: 'hands', name: 'Hands' },
  { id: 'groin', name: 'Groin & Genitals', sensitive: true },
  { id: 'thighs', name: 'Thighs' },
  { id: 'lower_legs', name: 'Lower Legs' },
  { id: 'feet', name: 'Feet' },
]
