export default function nFormatter(num: number, digits: number) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "m" },
    { value: 1e9, symbol: "b+" },
  ]
  const rx = /\.0+$|(\.\d*[1-9])0+$/
  const item = lookup
    .slice()
    .reverse()
    .find((obj) => num >= obj.value)
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0"
}
