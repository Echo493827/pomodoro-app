// loads the youtube iframe player api a single time and resolves with
// the global YT object once it is ready. lets us drive a hidden player
// for audio-only playback with our own controls.
let apiPromise = null

export function loadYouTubeApi() {
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT)
      return
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'

    // youtube calls this global function when the api finishes loading
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') prev()
      resolve(window.YT)
    }

    document.head.appendChild(tag)
  })

  return apiPromise
}
