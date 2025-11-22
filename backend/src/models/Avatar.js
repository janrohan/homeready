// models/Avatar.js

class Avatar {
    constructor({ id, userId, name, gender, age, occupation, savings, income }) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.occupation = occupation;
        this.savings = savings;
        this.income = income; // monthly income
    }

    addSavings(amount) {
        this.savings += amount;
    }

    changeOccupation(newOccupation, newIncome) {
        this.occupation = newOccupation;
        this.income = newIncome;
    }

    getAnnualIncome() {
        return this.income * 12;
    }
}

module.exports = Avatar;
