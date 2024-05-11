module.exports=(sequelize,DataTypes)=>{
    const Answer=sequelize.define('answer',{
        userID:{
            type:DataTypes.INTEGER
        },
        questionID:{
            type:DataTypes.INTEGER,
        },
        body:{
            type:DataTypes.STRING
        }
    },{
        timestamps:false
    })
    return Answer
}