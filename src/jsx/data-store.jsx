import _ from 'lodash';

class StoreItem {
    constructor(key) {
        this.key = key;
    }

    setValue(value) {
        localStorage.setItem(this.key, '' + value);
    }

    getValue(defValue = '') {
        var value = localStorage.getItem(this.key);
        if(!value)
            value = '' + defValue;
        return value;
    }

    getValueAsInt(defValue = 0) {
        return parseInt(this.getValue(defValue));
    }
}

class DataStore {
    createItem(key) {
        return new StoreItem(key);
    }
}

export default new DataStore();
