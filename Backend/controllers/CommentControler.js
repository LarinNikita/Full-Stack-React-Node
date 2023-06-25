import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const getPostComments = async (req, res) => {
    try {

        const postId = req.params.id;
        const doc = await CommentModel.find({
            post: postId
        }).populate({
            path: 'author',
            select: 'fullName avatarUrl'
        });

        res.json(doc);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить комменатарии'
        })
    }
};

export const getLastComments = async (req, res) => {
    try {

        const comments = await CommentModel
            .find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({
                path: 'author',
                select: 'fullName avatarUrl'
            })
            .exec();

        res.json(comments);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить комментарии'
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new CommentModel({
            comment: req.body.comment,
            author: req.userId,
            post: req.params.id,
        });

        const comment = await doc.save();

        const postId = req.params.id;

        PostModel.updateOne(
            { _id: postId },
            { $push: { comments: comment._id } }
        ).exec();

        CommentModel.find(
            {
                post: postId,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Не удалось вернуть комментарии.",
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: "Статья не найдена.",
                    });
                }
                res.json(doc);
            }
        )
            .populate({
                path: 'author',
                select: 'fullName avatarUrl'
            })
            .populate("post");
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось добавить комментарий.",
        });
    }
};

export const remove = async (req, res) => {
    try {

        const commentId = req.params.id;

        const doc = await CommentModel.findOneAndDelete({ _id: commentId });

        if (!doc) {
            return res.status(404).json({
                message: 'Не удалось удалить комменатрий'
            });
        }

        const postId = doc.post;

        await PostModel.findByIdAndUpdate(
            { _id: postId },
            { $pullAll: { comments: [commentId] } },
            { new: true },
        );

        res.json({
            success: true
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить комментарии'
        });
    }
};