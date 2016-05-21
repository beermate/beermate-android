'use strict';

import BloodAlcoholCounter from './BloodAlcoholCounter';

const FULL_LITERS = 0.33;

export default class LiterCounter {
    constructor(bloodAlcoholCounter: BloodAlcoholCounter) {
        this.bloodAlcoholCounter = bloodAlcoholCounter;
        this.literCount = 0;
        this.currentLevel = 0;
    }

    getLiterCount() {
        return this.literCount;
    }

    pushLevel(fillLevel) {
        let diff = fillLevel < this.currentLevel
            // Same glass
            ? (this.currentLevel - fillLevel) * FULL_LITERS
            // New glass
            : this.currentLevel * FULL_LITERS;

        this.literCount += diff;
        this.bloodAlcoholCounter.addConsumedAlcohol(diff);

        console.log('New liter count: ' + this.literCount);

        this.currentLevel = fillLevel;
    }
}
