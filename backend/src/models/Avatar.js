// models/Avatar.js

class Avatar {
    constructor(obj = {}) {
        // support both snake_case (from DB) and camelCase (from code)
        this.id = obj.id || obj.ID || null;
        this.userId = obj.user_id || obj.userId || null;
        this.name = obj.name || null;
        this.gender = obj.gender || null;
        this.age = obj.age || null;
        this.educationLevel = obj.education_level || obj.educationLevel || obj.education || null;
        this.educationField = obj.education_field || obj.educationField || null;
        this.occupation = obj.occupation || null;
        this.savings = obj.savings != null ? obj.savings : 0;
        this.income = obj.income != null ? obj.income : 0; // monthly income
        this.debt = obj.debt != null ? obj.debt : 0; // total debt amount
        this.createdAt = obj.created_at || obj.createdAt || null;
    }

    addSavings(amount) {
        this.savings = (this.savings || 0) + amount;
    }

    changeOccupation(newOccupation, newIncome) {
        this.occupation = newOccupation;
        this.income = newIncome;
    }

    getAnnualIncome() {
        return (this.income || 0) * 12;
    }
}

export default Avatar;
