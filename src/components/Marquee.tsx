import React from "react"
import Marquee from "react-fast-marquee"

type props = {
  color?: string
  width?: string
  text?: string
}
export default function MarqueeBox({ color, width, text }: props) {
  return (
    <Marquee style={{ color: color, width: width }} direction="left" speed={30}>
      &nbsp;{text}
    </Marquee>
  )
}
