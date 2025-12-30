const { Sequelize } = require('sequelize');
const sequelize = require('./database');
const app = require('./app');

const PORT = process.env.PORT || 8093;

async function startServer() {
  try {
    // Sync database
    await sequelize.sync({ alter: true }); // Alter tables to match models
    console.log('Database synced successfully.');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();