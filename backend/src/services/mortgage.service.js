// services/mortgage.service.js
const Avatar = require("../models/Avatar");
const PropertyGoal = require("../models/PropertyGoal");

class MortgageService {
    canTakeMortgage(avatar, goal) {
        const salary = avatar.getAnnualIncome();
        const estimatedPrice = goal.estimateFinalPrice();

        const maxLoan = salary * 5; // simple rule

        return {
            eligible: maxLoan >= estimatedPrice,
            maxLoan,
            estimatedPrice
        };
    }
}

module.exports = new MortgageService();
