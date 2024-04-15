import { className } from "../className"

describe('className function testing', () => {
    const a = 'hello'
    const b = 'world'
    const expectedResult = `${a} ${b}`

    it('merges a few strings together', () => {
        expect(className(a, b)).toBe(expectedResult)
    })

    it('correctly omits falsy values', () => {
        expect(className(a, null, false, b, undefined, ' ')).toBe(expectedResult)
    })

    it('handles empty modifiers object correctly', () => {
        expect(className(a, {}, b)).toBe(expectedResult)
    })

    it('applies modifiers correctly', () => {
        const modA = 'lg'
        const modB = '2xl:focus:required'

        expect(className({
            [modA]: a,
            [modB]: b
        })).toBe(`${modA}:${a} ${modB}:${b}`)
    })
})

