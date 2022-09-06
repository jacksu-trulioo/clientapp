import { IncomingMessage } from "http"
import { Socket } from "node:net"

import getClientIp from "./getClientIp"

test("Should Return Valid Ip4 Without Port", async () => {
  const request = new IncomingMessage(new Socket())
  request.headers["x-forwarded-for"] = "172.12.12.6:8080"
  const ip = getClientIp(request)
  expect(ip).toBe("172.12.12.6")
})

test("Should Return Valid Ip4", async () => {
  const request = new IncomingMessage(new Socket())
  request.headers["x-forwarded-for"] = "172.12.12.6, 172.12.12.7"
  const ip = getClientIp(request)
  expect(ip).toBe("172.12.12.6")
})

test("Should Return Valid Ip6", async () => {
  const request = new IncomingMessage(new Socket())
  request.headers["x-forwarded-for"] =
    "2001:db8:3333:4444:5555:6666:7777:8888, 172.12.12.6"
  const ip = getClientIp(request)
  expect(ip).toBe("2001:db8:3333:4444:5555:6666:7777:8888")
})

test("Should Return Valid Ip6  Without Port", async () => {
  const request = new IncomingMessage(new Socket())
  request.headers["x-forwarded-for"] =
    "[2001:db8:3333:4444:5555:6666:7777:8888]:8080, 172.12.12.6"
  const ip = getClientIp(request)
  expect(ip).toBe("2001:db8:3333:4444:5555:6666:7777:8888")
})

test("Should Return Valid Ip6 Without Port When IP6 Contain Port Number", async () => {
  const request = new IncomingMessage(new Socket())
  request.headers["x-forwarded-for"] = "[2a00:1397:4:2a02::a1]:8888"
  const ip = getClientIp(request)
  expect(ip).toBe("2a00:1397:4:2a02::a1")
})

test("Should Return Valid Ip6 With local IPV6", async () => {
  const request = new IncomingMessage(new Socket())
  request.headers["x-forwarded-for"] = "::1"
  const ip = getClientIp(request)
  expect(ip).toBe("::1")
})

test("Should Return Empty Remote address", async () => {
  const request = new IncomingMessage(new Socket())
  request.headers["x-forwarded-for"] = ""
  const ip = getClientIp(request)
  expect(ip).toBe(null)
})
