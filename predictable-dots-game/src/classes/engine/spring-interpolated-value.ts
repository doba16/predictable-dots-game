import { InterpolatedValue } from "./interpolated-value";

export class SpringInterpolatedValue extends InterpolatedValue {
    
    applyTimingFunction(progress: number): number {
        return 1 - (progress - 1) * (progress - 1) * (progress - 0.5) * (-2)
    }

}