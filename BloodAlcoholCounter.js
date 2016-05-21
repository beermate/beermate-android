'use strict';

const FULL_LITERS = 0.33;

export default class BloodAlcoholCounter {

    constructor(bodyWeight, gender, drinkAlcohol) {
        // body weight in kg
        this.bodyWeight = bodyWeight;
        this.genderCoef = this.MALE === gender ? 0.68 : 0.55;
        // drink alcohol in percent (0..1)
        this.drinkAlcohol = drinkAlcohol;
        // blood alcohol in permille (0..1)
        this.bloodAlcohol = 0;
        this.currentTime = new Date();
    }

    getBloodAlcohol() {
        return this.bloodAlcohol;
    }

    deductProcessedAlcohol() {
        // TODO deduct processed alcohol
        
        this.currentTime = new Date();
    }

    addConsumedAlcohol(liters) {
        this.deductProcessedAlcohol();

        // Widmark formula
        let milliLiters = 1000 * liters;
        let grams = milliLiters * this.drinkAlcohol * 0.8;
        let consumedAlcohol = (3 * grams) / (this.bodyWeight * this.genderCoef);

        this.bloodAlcohol += consumedAlcohol/1000;
    }
}

BloodAlcoholCounter.MALE = 'male';
BloodAlcoholCounter.FEMALE = 'female';
