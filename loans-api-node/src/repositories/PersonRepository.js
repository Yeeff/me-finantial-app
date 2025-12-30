const BaseRepository = require('./BaseRepository');
const { Person } = require('../models');

class PersonRepository extends BaseRepository {
  constructor() {
    super(Person);
  }

  async findWithLoans(options = {}) {
    const defaultOptions = {
      include: [{ model: require('../models').Loan, as: 'loans' }],
      ...options
    };
    return await this.findAll(defaultOptions);
  }

  async findByIdWithLoans(id) {
    return await this.findById(id, {
      include: [{ model: require('../models').Loan, as: 'loans' }]
    });
  }

  async searchByNameOrIdentification(searchTerm, limit = 5) {
    const { Op } = require('sequelize');
    return await this.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { identification: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      limit
    });
  }

  async findRecent(limit = 5) {
    return await this.findAll({
      order: [['createdAt', 'DESC']],
      limit
    });
  }
}

module.exports = new PersonRepository();