import { InterpolatedValue } from "./interpolated-value";

export class EaseOutInterpolatedValue extends InterpolatedValue {
    
    applyTimingFunction(progress: number): number {
        return 1 - (progress - 1) * (progress - 1)
    }

}