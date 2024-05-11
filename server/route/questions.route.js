const express=require('express')
const questionRouter=express.Router()
const {auth}=require('../middleware/auth.middleware')
const {db}=require('../model/index')
const Question=db.questions
const User=db.users
const Answer=db.answers

questionRouter.get('/',async(req,res)=>{
    try{
        const questions=await Question.findAll({})
        res.status(200).json(questions)
    }
    catch(err)
    {
        res.status(500).json({ error: 'Internal server error' });
    }
})
questionRouter.get('/:id', async (req, res) => {
    try {
        const question = await Question.findOne({
            where: { id: req.params.id },
            include: [{
                model: User,
               as:'userdetail'
            },
            {
                model: Answer,
                as: 'answers'
            }]
        });

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.status(200).json(question);
    } catch (err) {
        console.error('Error occurred while fetching question details:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

questionRouter.post('/',auth,async(req,res)=>{
const {title,description}=req.body
try{
const question=await Question.create({
    userID:req.userID,
    title,
    description
})
res.status(200).json({msg:"question posted successfully",question})
}
catch(err)
{
    console.error('Error occurred during posting question:', err);
    res.status(500).json({ error: 'Internal server error' });
}
})

questionRouter.delete('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const question = await Question.findOne({ where: { id: id } });
        if (!question) {
            return res.status(404).json({ msg: "Question not found" });
        }
        if (req.userID === question.userID) {
            await Question.destroy({ where: { id: id } });
            return res.status(200).json({ msg: "Question has been successfully deleted" });
        } else {
            return res.status(403).json({ msg: "You are not authorized to delete this question" });
        }
    } catch (err) {
        console.error('Error occurred while deleting question:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports={
    questionRouter
}