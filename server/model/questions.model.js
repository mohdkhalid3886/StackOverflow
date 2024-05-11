module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('question', {
        userID: {
            type: DataTypes.INTEGER
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false
    });

    return Question;
};
