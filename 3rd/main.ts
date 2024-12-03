const file = Deno.readTextFileSync("./assets/puzzle-input.txt")

let text_case = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`
text_case = file

type MulSolution = number
type SwitchValue = boolean

const getMul = (startCursor: number, text: string): MulSolution | undefined => {
  const max = "mul(123,123)".length
  const subStr = text.substring(startCursor, startCursor + max)

  // first four characters must be 'mul('
  if (subStr.indexOf("mul(") !== 0) return undefined

  // now crawl onwards until we hit a ')'
  const allowedCharacters = "0123456789,)".split("") // fuck regex

  let searchOffset = 4, foundComma = false
  main: do {
    const char = subStr.charAt(searchOffset)

    if (!allowedCharacters.includes(char)) return undefined

    if (char === ",") foundComma = true

    if (foundComma && char === ")") {
      searchOffset++
      break main
    }

    searchOffset++

    if (searchOffset > max) break main
  } while (true)

  return text.substring(startCursor, startCursor + searchOffset)
    .substring(4).slice(0, -1).split(",").map((s) => parseInt(s))
    .reduce((acc, current) => acc * current, 1)
}

const getSwitch = (cursor: number, text: string): SwitchValue | undefined => {
  const doStr = "do()", dontStr = "don't()"
  const substr = text.substring(cursor, cursor + dontStr.length)

  if (substr.indexOf(doStr) === 0) return true
  if (substr.indexOf(dontStr) === 0) return false

  return undefined
}

const collectMulsAndSwitches = (text: string) => {
  const muls = new Map<number, MulSolution>()
  const switches = new Map<number, SwitchValue>()

  for (let cursor = 0, l = text.length; cursor < l; cursor++) {
    const thisChar = text.charAt(cursor)

    if (thisChar === "m") {
      const mul = getMul(cursor, text)
      if (mul !== undefined) muls.set(cursor, mul)
    } else if (thisChar === "d") {
      const swi = getSwitch(cursor, text)
      if (swi !== undefined) switches.set(cursor, swi)
    }
  }

  return { muls, switches }
}

const getMulSum = (text: string): number => {
  let active = true, solutionAcc = 0
  const { muls, switches } = collectMulsAndSwitches(text)
  for (let cursor = 0, l = text.length; cursor < l; cursor++) {
    active = switches.get(cursor) ?? active
    if (active) solutionAcc += muls.get(cursor) ?? 0
  }

  return solutionAcc
}

console.log("the total of all the mul(x,y) processing with switch is", getMulSum(text_case))
