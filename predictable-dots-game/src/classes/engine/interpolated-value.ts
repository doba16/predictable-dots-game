export abstract class InterpolatedValue {

    private _lastValue: number
    private _lastTimestamp: number
    private _currentValue: number
    private _duration: number = 300

    constructor(initialValue: number) {
        this._lastValue = initialValue
        this._currentValue = initialValue
        this._lastTimestamp = performance.now()
    }

    abstract applyTimingFunction(progress: number): number

    public interpolate(): number {
        const currentTimestamp = performance.now()

        const progress = Math.min(this._duration, currentTimestamp - this._lastTimestamp) / this._duration
        const interpolation = this.applyTimingFunction(progress)

        return interpolation * (this._currentValue - this._lastValue) + this._lastValue
    }

    public get value(): number {
        return this._currentValue
    }

    public set value(value: number) {
        this._lastValue = this._currentValue
        this._currentValue = value
        this._lastTimestamp = performance.now()
    }

}