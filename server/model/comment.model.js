module.exports=(sequelize,DataTypes)=>{
    const Comment=sequelize.define('comment',{
        userID:{
            type:DataTypes.INTEGER
        },
        commentableID:{
            type:DataTypes.INTEGER,
        },
        commentableType:{
            type:DataTypes.STRING
        },
        body:{
            type:DataTypes.STRING
        }
    },{
        timestamps:false
    })
    return Comment
}