import { IncomingMessage } from "http"
import { NextApiRequest } from "next"

const IP6_ADDRESS = new RegExp(/^\[{0,1}([0-9a-f:]+)\]{0,1}/)
const IP6_ADDRESS_WITH_PORT = new RegExp(/\[([0-9a-f:]+)\]:([0-9]{1,5})/)
const IP4_ADDRESS = new RegExp(
  /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/g,
)

/**
 * Determine client IP address.
 *
 * Naive solution. Consider `request-ip` for more complete implementation.
 * See https://github.com/pbojinov/request-ip.
 */
export default function getClientIp(req: NextApiRequest | IncomingMessage) {
  let ip = null
  // x-forwarded-for may return multiple IP addresses in the format:
  // "client IP, proxy 1 IP, proxy 2 IP"
  // Therefore, the right-most IP address is the IP address of the most recent proxy
  // and the left-most IP address is the IP address of the originating client.

  if (req.headers["x-forwarded-for"]) {
    let ipAddress = (req.headers["x-forwarded-for"] as string).split(/,/)[0]
    //Clean up port from IP
    if (ipAddress) {
      ip = parseIpAddress(ipAddress)
    }
  }
  if (!ip && req.socket.remoteAddress) {
    ip = req.socket.remoteAddress
  }
  return ip
}

function parseIpAddress(ipAddress: string) {
  try {
    let ipSegments = ipAddress.split(":")
    if (IP4_ADDRESS.test(ipAddress)) {
      return ipAddress
    } else if (IP4_ADDRESS.test(ipSegments[0])) {
      return ipSegments[0]
    } else if (IP6_ADDRESS_WITH_PORT.test(ipAddress)) {
      let group = IP6_ADDRESS_WITH_PORT.exec(ipAddress)
      if (group) {
        return group[1]
      }
    } else if (IP6_ADDRESS.test(ipAddress)) {
      return ipAddress
    }
  } catch {
    return null
  }
  return null
}
