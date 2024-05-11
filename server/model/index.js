const dbConfig = require('../config/dbConfig');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect
    }
);

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./user.model')(sequelize, DataTypes);
db.questions=require('./questions.model')(sequelize, DataTypes);
db.answers=require('./answers.model')(sequelize, DataTypes);
db.comments=require('./comment.model')(sequelize, DataTypes);

db.users.hasMany(db.questions,{foreignKey:"userID", as:'questionsINFO'})
db.questions.belongsTo(db.users,{foreignKey:"userID", as:'userdetail'})

db.users.hasMany(db.answers,{foreignKey:"userID", as:'answersINFO'})
db.answers.belongsTo(db.users,{foreignKey:"userID", as:'userdetail'})

db.questions.hasMany(db.answers,{foreignKey:"questionID", as:'answers',onDelete: 'CASCADE'})
db.answers.belongsTo(db.questions,{foreignKey:"questionID", as:'question'})

db.users.hasMany(db.comments,{foreignKey:"userID", as:'comments'})
db.comments.belongsTo(db.users,{foreignKey:"userID", as:'userINFO'})

db.questions.hasMany(db.comments,{foreignKey:"commentableID",  constraints: false,scope: {commentableType: 'question'}})
db.comments.belongsTo(db.questions, { foreignKey: 'commentableID', constraints: false });

db.answers.hasMany(db.comments,{foreignKey:"commentableID",  constraints: false,scope: {commentableType: 'answer'}})
db.comments.belongsTo(db.answers, { foreignKey: 'commentableID', constraints: false });

db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synchronization complete');
    })
    .catch(error => {
        console.error('Error synchronizing database:', error);
    });

module.exports = {
    db,
    connection
};
