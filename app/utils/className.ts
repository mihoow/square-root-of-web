type PrimitiveClassArg = string | null | undefined | false;

type ClassModifiers = Record<string, string>

export type ClassArg = PrimitiveClassArg | ClassModifiers;

export function mod(modifier: string, classes: string): string {
    return classes
        .split(/\s+/)
        .map((subClass) => `${modifier}:${subClass}`)
        .join(' ')
}

function reduceClassModifiers(modifiers: ClassModifiers): string {
    return Object.entries(modifiers).reduce((className, [modifier, subClass]) => {
        if (!subClass.trim()) {
            return className
        }

        return `${className} ${mod(modifier, subClass)}`
    }, '')
}

export function className(...classes: ClassArg[]): string {
    return classes.reduce<string>((className, subClass) => {
        const nextClass = typeof subClass === 'string'
            ? subClass
            : (subClass && reduceClassModifiers(subClass))

        if (!nextClass) {
            return className
        }

        return `${className} ${nextClass.trim()}`
    }, '').trim()
}
