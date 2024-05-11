const express=require('express')
const commentRouter=express.Router()
const {db}=require('../model/index')
const{auth}=require('../middleware/auth.middleware')
const Comment=db.comments
const Question=db.comments
const Answer=db.answers

commentRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const comment = await Comment.findByPk(id, {
            include: [
                {
                    model: Question,
                    as: 'question'
                },
                {
                    model: Answer,
                    as: 'answer'
                }
            ]
        });
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(200).json(comment);
    } catch (err) {
        console.error('Error occurred while fetching comment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


commentRouter.post('/:id', auth, async (req, res) => {
    const {id} = req.params;
    const {commentableType, body} = req.body;

    try {
        if (commentableType !== 'question' && commentableType !== 'answer') {
            return res.status(400).json({ error: 'Invalid commentable type' });
        }

        const commentable = commentableType === 'question' ?await Question.findByPk(id):await Answer.findByPk(id);

        if (!commentable) {
            return res.status(404).json({ error: 'Commentable not found' });
        }
        const comment = await Comment.create({
            userId: req.userID,
            commentableType,
            commentableID: id,
            body
        });
        res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (err) {
        console.error('Error occurred while creating comment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

commentRouter.delete('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const comment = await Comment.findOne({ where: { id: id } });
        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" });
        }
        if (req.userID === comment.userID) {
            await Comment.destroy({ where: { id: id } });
            return res.status(200).json({ msg: "Comment has been successfully deleted" });
        } else {
            return res.status(403).json({ msg: "You are not authorized to delete this comment" });
        }
    } catch (err) {
        console.error('Error occurred while deleting comment:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports={
    commentRouter
}