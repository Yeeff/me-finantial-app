const Person = require('./Person');
const Loan = require('./Loan');
const Movement = require('./Movement');

// Associations
Person.hasMany(Loan, { foreignKey: 'personId', as: 'loans' });
Loan.belongsTo(Person, { foreignKey: 'personId', as: 'person' });

Loan.hasMany(Movement, { foreignKey: 'loanId', as: 'movements' });
Movement.belongsTo(Loan, { foreignKey: 'loanId', as: 'loan' });

module.exports = {
  Person,
  Loan,
  Movement,
};