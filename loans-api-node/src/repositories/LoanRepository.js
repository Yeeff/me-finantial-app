const BaseRepository = require('./BaseRepository');
const { Loan } = require('../models');

class LoanRepository extends BaseRepository {
  constructor() {
    super(Loan);
  }

  async findWithPerson(options = {}) {
    const defaultOptions = {
      include: [{ model: require('../models').Person, as: 'person' }],
      ...options
    };
    return await this.findAll(defaultOptions);
  }

  async findByIdWithPerson(id) {
    return await this.findById(id, {
      include: [{ model: require('../models').Person, as: 'person' }]
    });
  }

  async findActive() {
    return await this.findAll({
      where: { status: 'ACTIVE' }
    });
  }

  async findByPersonId(personId) {
    return await this.findAll({
      where: { personId }
    });
  }

  async findByAccessCode(accessCode) {
    return await this.findOne({
      where: { accessCode }
    });
  }

  async updateStatus(id, status) {
    return await this.update(id, { status });
  }
}

module.exports = new LoanRepository();