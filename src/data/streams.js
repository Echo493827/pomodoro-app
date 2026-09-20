// embedded lofi stations. each is a youtube live stream id — the audio
// and licensing live on youtube's side, which is the approach we chose.
//
// IMPORTANT: youtube live streams occasionally go offline or change IDs.
// These are seeded defaults — before you launch, open each one and swap
// any that are down for a stream you like. The videoId is the part after
// "watch?v=" in a youtube url.

export const streams = [
  {
    id: 'lofi-beats',
    name: 'Lofi beats',
    note: 'mellow hip-hop, good for reading',
    videoId: 'jfKfPfyJRdk'
  },
  {
    id: 'coffee-jazz',
    name: 'Coffee shop jazz',
    note: 'warm background jazz',
    videoId: 'Dx5qFachd3A'
  },
  {
    id: 'rain-lofi',
    name: 'Rainy lofi',
    note: 'beats with rain',
    videoId: 'yQg7_Vg0k9c'
  },
  {
    id: 'deep-focus',
    name: 'Deep focus',
    note: 'minimal, ambient',
    videoId: '4xDzrJKXOOY'
  }
]
