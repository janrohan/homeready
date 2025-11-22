// models/PropertyGoal.js

class PropertyGoal {
    constructor({ type, region, rooms, size, city, basePrice }) {
        this.type = type;  // 'house' or 'apartment'
        this.region = region;
        this.rooms = rooms;
        this.size = size; // m²
        this.city = city;
        this.basePrice = basePrice;
    }

    estimateFinalPrice() {
        let price = this.basePrice;

        if (this.city) price *= 1.3;
        if (this.rooms >= 3) price += 50000;

        return price;
    }
}

module.exports = PropertyGoal;
