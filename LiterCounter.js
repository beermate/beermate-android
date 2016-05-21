'use strict';

import {AsyncStorage} from 'react-native';

const FULL_LITERS = 0.33;

const CURRENT_LEVEL_KEY = 'LiterCounter.currentLevel';
const LITER_COUNT_KEY = 'LiterCounter.literCount';

export default class LiterCounter {
    constructor() {
        this.literCount = 0;
        this.currentLevel = 0;
        console.log('Initial liter count: ' + this.literCount);
        this._loadInitialState().done();
        console.log('Liter count after loading: ' + this.literCount);
    }

    getLiterCount() {
        return this.literCount;
    }

    async pushLevel(fillLevel) {
        if (fillLevel < this.currentLevel) {
            // Same glass
            this.literCount += (this.currentLevel - fillLevel) * FULL_LITERS;
        } else {
            // New glass
            this.literCount += this.currentLevel * FULL_LITERS;
        }

        console.log('New liter count: ' + this.literCount);

        this.currentLevel = fillLevel;

        let dataToSet = [
            [CURRENT_LEVEL_KEY, JSON.stringify(this.currentLevel)],
            [LITER_COUNT_KEY, JSON.stringify(this.literCount)]
        ];

        return AsyncStorage.multiSet(dataToSet);
    }

    async _loadInitialState() {
        this.currentLevel = parseFloat(await AsyncStorage.getItem(CURRENT_LEVEL_KEY));
        this.literCount = parseFloat(await AsyncStorage.getItem(LITER_COUNT_KEY));
    }
}
