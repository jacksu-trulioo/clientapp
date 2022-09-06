import { Box } from "@chakra-ui/react"
import React, { useEffect, useRef } from "react"
import videojs from "video.js"

type onPlay = () => void
type onPause = () => void
type onEnd = () => void

type VideoPlayerPropsType = {
  url?: string
  type?: string
  poster?: string
  showPlayBtn?: boolean
  autoplay?: boolean
  onPlay?: onPlay
  onPause?: onPause
  onEnd?: onEnd
}

export default function VideoPlayer(props: VideoPlayerPropsType) {
  const { url, poster, autoplay, showPlayBtn, type, onPlay, onPause, onEnd } =
    props
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videojs(
        videoRef.current,
        {
          preload: "auto",
          autoplay: autoplay || false,
          nativeControlsForTouch: true,
          fluid: true,
          poster: poster,
          bigPlayButton: showPlayBtn || false,
          controlBar: {
            pictureInPictureToggle: false,
          },
          html5: {
            nativeVideoTracks: true,
          },
          sources: [
            {
              src: url || "",
              type: type || "video/mp4",
            },
          ],
        },
        function onPlayerReady() {
          this.on("ended", function () {
            if (onEnd) {
              onEnd()
            }
          })
        },
      )
    }
  })

  return (
    <Box dir="ltr" className={`video-player-container`}>
      <video
        controls
        ref={videoRef}
        className="video-js"
        onPlay={onPlay}
        onPause={onPause}
      />
    </Box>
  )
}
