import PostModel from '../models/Post.js';

export const create = async (req, res) => {
    try {

        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,

            author: req.userId,
        });

        const post = await doc.save();

        res.json(post);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};

export const getAll = async (req, res) => {
    try {

        const sortParam = req.query.sortBy === 'popular' ? '-viewsCount' : '-createdAt';
        const findParam = req.query.sortBy === 'popular' ? {viewsCount: { $gte: 100 }} : null;

        const posts = await PostModel
            .find(findParam)
            .sort(sortParam)
            .populate({ path: "author", select: ["fullName", "avatarUrl"] })
            .exec();

        res.json(posts)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getPopular = async (req, res) => {
    try {

        const posts = await PostModel
            .find({ viewsCount: { $gte: 10 } }) //$gte выбирает документы, 
            //в которых значение field больше или равно (т.е. >=) указанному значению (например value, .)
            // .find()
            .sort({ viewsCount: -1 }) // сортируем по убыванию viewsCount
            .populate({ path: "author", select: ["fullName", "avatarUrl"] })
            .exec();

        res.json(posts)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить популярные статьи',
        });
    }
};

export const getOne = async (req, res) => {
    try {

        const postId = req.params.id;

        const doc = await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            }
            // ).populate('author', '-passwordHash');
        ).populate({ 
            path: "author", 
            select: ["fullName", "avatarUrl"] 
        }).populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'fullName avatarUrl'
            }
        });

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json(doc);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const remove = async (req, res) => {
    try {

        const postId = req.params.id;

        const doc = await PostModel.findOneAndDelete(
            {
                _id: postId,
            }
        );

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json({
            success: true,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const update = async (req, res) => {
    try {

        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                author: req.body.userId,
                tags: req.body.tags,
            },
        );

        res.json({
            success: true,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
}

export const getTags = async (req, res) => {
    try {

        const posts = await PostModel.find().exec();

        const tags = posts.map((obj) => obj.tags).flat();

        res.json(tags);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить тэги',
        });
    }
}