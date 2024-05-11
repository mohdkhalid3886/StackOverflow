const express=require('express')
const app=express()
const {connection} = require('./model/index');
const {userRouter} =require('./route/user.route')
const {questionRouter}=require('./route/questions.route')
const {answerRouter}=require('./route/answers.route')
const {commentRouter}=require('./route/comment.route')

app.use(express.json())
app.use('/users',userRouter)
app.use('/questions',questionRouter)
app.use('/answers',answerRouter)
app.use('/comments',commentRouter)

app.get('/',(req,res)=>{
    res.send('home page')
})

connection()

app.listen(8080,()=>{
    console.log('connected to server')
})