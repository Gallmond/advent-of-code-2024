const file = Deno.readTextFileSync("./assets/puzzle-input.txt")

let text_case = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`
text_case = file

type MulSolution = number
type SwitchValue = boolean

const getMul = (startCursor: number, text: string): MulSolution | undefined => {
  const max = "mul(123,123)".length
  const subStr = text.substring(startCursor, startCursor + max)

  // first four characters must be 'mul('
  if (subStr.indexOf("mul(") !== 0) {
    return undefined
  }

  // now crawl onwards until we hit a ')'
  const allowedCharacters = "0123456789,)".split("") // fuck regex
  let foundComma = false
  let searchOffset = 4 // skip over 'mul('
  main: do {
    const char = subStr.charAt(searchOffset)

    if (!allowedCharacters.includes(char)) {
      return undefined
    }

    if (char === ",") foundComma = true

    if (foundComma && char === ")") {
      searchOffset++
      break main
    }

    searchOffset++

    if (searchOffset > max) {
      break main
    }
  } while (true)

  return processMulString(text.substring(startCursor, startCursor + searchOffset))
}

const getSwitch = (cursor: number, text: string): SwitchValue | undefined => {
  const doStr = "do()", dontStr = "don't()"
  const substr = text.substring(cursor, cursor + dontStr.length)

  if (substr.indexOf(doStr) === 0) return true
  if (substr.indexOf(dontStr) === 0) return false

  return undefined
}

const collectMulsAndSwitches = (
  text: string,
): { muls: Map<number, MulSolution>; switches: Map<number, SwitchValue> } => {
  const allMuls = new Map<number, MulSolution>()
  const allSwitches = new Map<number, SwitchValue>()

  for (let cursor = 0, l = text.length; cursor < l; cursor++) {
    const thisChar = text.charAt(cursor)

    if (thisChar === "m") {
      const mul = getMul(cursor, text)
      if (mul !== undefined) allMuls.set(cursor, mul)
      continue
    }

    if (thisChar === "d") {
      const swi = getSwitch(cursor, text)
      if (swi !== undefined) allSwitches.set(cursor, swi)
      continue
    }
  }

  return {
    muls: allMuls,
    switches: allSwitches,
  }
}

const processMulString = (mulString: string): number => {
  const withoutHead = mulString.substring(4) // 'mul('
  const withoutTail = withoutHead.substring(0, withoutHead.length - 1) // ')'
  const numbers = withoutTail.split(",").map((n) => parseInt(n))

  if (numbers.length !== 2) {
    console.error({ mulString })
    throw new Error("Invalid mulString")
  }

  return numbers[0] * numbers[1]
}

const getMulSum = (text: string): number => {
  let active = true, solutionAcc = 0
  const { muls, switches } = collectMulsAndSwitches(text)
  for (let i = 0, l = text.length; i < l; i++) {
    const swi = switches.get(i)
    if (swi !== undefined) active = swi

    const mulSolution = muls.get(i)
    if (active && mulSolution !== undefined) {
      solutionAcc += mulSolution
    }
  }

  return solutionAcc
}

const solution = getMulSum(text_case)

console.log("the total of all the mul(x,y) processing with switch is", { solution })
