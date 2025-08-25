import React from 'react'

const VideoPlayer = () => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md">
              <ReactPlayer
                url={video}
                controls
                width="100%"
                height="520px"
                style={{ backgroundColor: "black" }}
              />
            </div>
  )
}

export default VideoPlayer