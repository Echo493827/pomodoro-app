import { useEffect, useRef } from 'react'
import { useAmbiance } from '../context/AmbianceContext'
import { streams } from '../data/streams'
import { loadYouTubeApi } from '../lib/youtube'

// this component renders nothing visible. it keeps a single hidden
// youtube player alive at the app root so audio continues even when the
// music panel is closed or the user changes pages.
export default function MusicController() {
  const { activeStreamId, isPlaying, volume, setIsPlaying } = useAmbiance()
  const holderRef = useRef(null)
  const playerRef = useRef(null)
  const readyRef = useRef(false)

  // build the player once
  useEffect(() => {
    let cancelled = false
    loadYouTubeApi().then((YT) => {
      if (cancelled || !holderRef.current || playerRef.current) return
      playerRef.current = new YT.Player(holderRef.current, {
        height: '0',
        width: '0',
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, playsinline: 1 },
        events: {
          onReady: () => {
            readyRef.current = true
            playerRef.current.setVolume(volume)
          },
          onStateChange: (e) => {
            // keep our toggle in sync if the stream ends or buffers out
            if (e.data === YT.PlayerState.ENDED) setIsPlaying(false)
          }
        }
      })
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // load / switch the selected station
  useEffect(() => {
    const player = playerRef.current
    if (!player || !readyRef.current || !activeStreamId) return
    const station = streams.find((s) => s.id === activeStreamId)
    if (!station) return

    if (isPlaying) {
      player.loadVideoById(station.videoId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStreamId])

  // respond to play / pause
  useEffect(() => {
    const player = playerRef.current
    if (!player || !readyRef.current) return
    if (isPlaying && activeStreamId) {
      const station = streams.find((s) => s.id === activeStreamId)
      // if nothing is loaded yet, load; otherwise just resume
      if (station && player.getPlayerState && player.getPlayerState() === -1) {
        player.loadVideoById(station.videoId)
      } else {
        player.playVideo()
      }
    } else {
      if (player.pauseVideo) player.pauseVideo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying])

  // reflect volume changes
  useEffect(() => {
    const player = playerRef.current
    if (player && readyRef.current && player.setVolume) player.setVolume(volume)
  }, [volume])

  return <div aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
    <div ref={holderRef} />
  </div>
}
