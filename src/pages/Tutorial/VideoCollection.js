import React, { useEffect, useRef } from 'react'

const VideoCollection = ({ videoList, onWatch }) => {
  const containerRef = useRef(null)
  const watchRef = useRef({})

  // Embed videos.
  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const elVideoItems = containerRef.current.getElementsByClassName('video-item')
    for (let index = 0; index < elVideoItems.length; index += 1) {
      const elVideoWrappers = elVideoItems[index].getElementsByClassName('video-wrapper')
      if (!elVideoWrappers.length) {
        continue
      }

      const script = document.createElement('script')
      script.src = videoList[index].url
      script.async = true

      elVideoWrappers[0].appendChild(script)
    }

    const script = document.createElement('script')
    script.src = '//fast.wistia.com/assets/external/E-v1.js'
    script.async = true
    containerRef.current.appendChild(script)

    window._wq = window._wq || []
    const configList = {}
    videoList.forEach((video) => {
      configList[video.videoId] = {
        id: video.videoId,
        onEmbedded: handleEmbedded,
      }
      window._wq.push(configList[video.videoId])
    })

    return () => {
      // Revoke onEmbedded event listener when unmounting a component.
      videoList.forEach((video) => {
        window._wq.push({ revoke: configList[video.videoId] })
      })
    }
  }, []) // eslint-disable-line

  const handleEmbedded = (video) => {
    video.bind('end', () => {
      // Keep a list of watched videos.
      watchRef.current[video.hashedId()] = true

      const watchedVideoIds = Object.keys(watchRef.current)
      const unwatchedVideo = videoList.find(item => watchedVideoIds.indexOf(item.videoId) === -1)
      if (!unwatchedVideo) {
        // All videos are watched.
        onWatch()
        watchRef.current = {}
      }
    })
  }

  return (
    <div className="video-list" ref={containerRef}>
      {
        videoList.map(video => (
          <div key={video.name} className="video-item">
            <div className="video-name">
              { video.name }
            </div>
            <div className="video-wrapper">
              <div className="wistia_responsive_padding">
                <div className="wistia_responsive_wrapper">
                  <div className={`wistia_embed wistia_async_${video.videoId} popover=true popoverAnimateThumbnail=true`}>
                    &nbsp;
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default VideoCollection
