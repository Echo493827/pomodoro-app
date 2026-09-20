// cozy cafe background scenes. gradient scenes work with zero assets.
// to add a real photo: drop a .jpg in /public/backgrounds/ and add an
// entry with type 'image' and value '/backgrounds/your-file.jpg'.
// keep photos warm and cafe-toned to match the palette.

export const backgrounds = [
  {
    id: 'morning',
    name: 'Morning light',
    type: 'gradient',
    value:
      'radial-gradient(120% 90% at 78% 12%, rgba(232,201,160,0.55) 0%, rgba(232,201,160,0) 45%), ' +
      'radial-gradient(90% 70% at 15% 90%, rgba(90,58,46,0.6) 0%, rgba(90,58,46,0) 55%), ' +
      'linear-gradient(160deg, #6b4a34 0%, #3e2723 55%, #2a1a14 100%)'
  },
  {
    id: 'afternoon',
    name: 'Afternoon roast',
    type: 'gradient',
    value:
      'radial-gradient(100% 80% at 50% 0%, rgba(210,105,30,0.4) 0%, rgba(210,105,30,0) 50%), ' +
      'linear-gradient(155deg, #4a2f21 0%, #3a241b 60%, #241610 100%)'
  },
  {
    id: 'rain',
    name: 'Rainy window',
    type: 'gradient',
    value:
      'radial-gradient(120% 90% at 30% 20%, rgba(140,150,160,0.28) 0%, rgba(140,150,160,0) 50%), ' +
      'radial-gradient(80% 60% at 85% 95%, rgba(139,69,19,0.45) 0%, rgba(139,69,19,0) 55%), ' +
      'linear-gradient(165deg, #3b3630 0%, #2f2a25 55%, #211d19 100%)'
  },
  {
    id: 'evening',
    name: 'Evening amber',
    type: 'gradient',
    value:
      'radial-gradient(90% 70% at 82% 78%, rgba(210,105,30,0.5) 0%, rgba(210,105,30,0) 45%), ' +
      'radial-gradient(70% 60% at 10% 12%, rgba(232,201,160,0.18) 0%, rgba(232,201,160,0) 50%), ' +
      'linear-gradient(160deg, #2a1a14 0%, #1e1310 100%)'
  },
  {
    // this points at the photo carried over from your original repo.
    // it is copied to /public/backgrounds/cafe.jpg in this project.
    id: 'photo-cafe',
    name: 'Corner cafe (photo)',
    type: 'image',
    value: '/backgrounds/cafe.jpg'
  }
]

export const defaultBackgroundId = 'morning'
