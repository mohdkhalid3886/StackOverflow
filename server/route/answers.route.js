const express=require('express')
const answerRouter=express.Router()
const {auth}=require('../middleware/auth.middleware')
const {db}=require('../model/index')
const Answer=db.answers
const Question=db.questions
answerRouter.get('/:questionID', async (req, res) => {
    try {
        const answers = await Answer.findAll({
            where: { questionID: req.params.questionID },
            include: [{
                model: Question,
                as: 'question'
            }]
        });
        res.status(200).json(answers);
    } catch (err) {
        console.error('Error occurred while fetching answers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


answerRouter.post('/:questionID',auth,async(req,res)=>{
const {body}=req.body
try{
const answer=await Answer.create({
    userID:req.userID,
    questionID:req.params.questionID,
    body
})
res.status(200).json({msg:"answer posted successfully",answer})
}
catch(err)
{
    console.error('Error occurred during posting answer:', err);
    res.status(500).json({ error: 'Internal server error' });
}
})

answerRouter.delete('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const answer = await Answer.findOne({ where: { id: id } });
        if (!answer) {
            return res.status(404).json({ msg: "Answer not found" });
        }
        if (req.userID === answer.userID) {
            await Answer.destroy({ where: { id: id } });
            return res.status(200).json({ msg: "Answer has been successfully deleted" });
        } else {
            return res.status(403).json({ msg: "You are not authorized to delete this asnwer" });
        }
    } catch (err) {
        console.error('Error occurred while deleting answer:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports={
    answerRouter
}