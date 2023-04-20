import { DotColor } from ".."

export function compareColors(c1?: DotColor, c2?: DotColor): boolean {
    if (c1 != undefined && c2 != undefined) {
        return c1.color === c2.color && c1.name === c2.name && c1.shadowColor === c2.shadowColor
    } else {
        return c1 === c2
    }
}