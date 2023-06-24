import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

// export const getPostComments = async (req, res) => {
//     try {

//         const postId = req.params.id;
//         const doc = await CommentModel.find({
//             post: postId
//         }).populate({
//             path: 'author',
//             select: 'fullName avatarUrl'
//         });

//         res.json(doc);

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: 'Не удалось получить комменатарии'
//         })
//     }
// };

export const getPostComments = (req, res) => {
    try {
        const postId = req.params.id;
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
        ).populate({
            path: 'author',
            select: 'fullName avatarUrl'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить комментарии.",
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

// export const create = async (req, res) => {
//     try {

//         const doc = new CommentModel({
//             comment: req.body.comment,
//             author: req.userId,
//             post: req.params.id,
//         });

//         const comment = await doc.save();

//         const postId = req.params.id;

//         PostModel.updateOne(
//             { _id: postId },
//             { $push: { comments: comment._id } },
//         ).exec();

//         CommentModel.find(
//             { post: postId },
//         ).populate({
//             path: 'author',
//             select: 'fullName avatarUrl'
//         }).populate("post");

//         if (!doc) {
//             return res.status(404).json({
//                 message: 'Статья не найдена'
//             });
//         }

//         res.json(doc);

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: 'Не удалось создать комментарий'
//         });
//     }
// };