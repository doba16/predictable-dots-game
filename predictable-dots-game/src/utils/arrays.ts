export function randomElement<T>(arr: T[]): T {
    return arr[Math.floor(arr.length * Math.random())]
}