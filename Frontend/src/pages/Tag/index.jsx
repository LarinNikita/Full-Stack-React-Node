import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { Post } from '../../components';
import { TagsBlock } from '../../components/TagsBlock';
import { CommentsBlock } from '../../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../../redux/slices/posts';

export const TagPage = () => {

    const { name } = useParams();

    const dispath = useDispatch();
    const userData = useSelector((state) => state.auth.data);

    const { posts, tags } = useSelector((state) => state.posts);

    const isPostsLoading = posts.status === 'loading';
    const isTagsLoading = tags.status === 'loading';

    React.useEffect(() => {
        dispath(fetchPosts());
        dispath(fetchTags());
    }, []);

    // Фильтруем посты по имени тега из URL
    const filteredPosts = posts.items.filter(post => post.tags.includes(name));

    return (
        <>
            <Typography variant="h4" fontWeight="bold" color="#626262" marginBottom="20px">
                #{name}
            </Typography>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {(isPostsLoading ? [...Array(5)] : filteredPosts).map((object, index) =>
                        isPostsLoading ? (
                            <Post key={index} isLoading={true} />
                        ) : (
                            <Post
                                id={object._id}
                                title={object.title}
                                imageUrl={object.imageUrl ? `http://localhost:4444${object.imageUrl}` : ''}
                                user={object.author}
                                createdAt={new Date(object.createdAt).toLocaleDateString('en-GB')}
                                viewsCount={object.viewsCount}
                                commentsCount={3}
                                tags={object.tags}
                                isEditable={userData?._id === object.author._id}
                            />
                        ),
                    )}
                </Grid>
                <Grid xs={4} item>
                    <TagsBlock items={tags.items} isLoading={isTagsLoading} />
                    <CommentsBlock
                        items={[
                            {
                                user: {
                                    fullName: 'Вася Пупкин',
                                    avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                                },
                                text: 'Это тестовый комментарий',
                            },
                            {
                                user: {
                                    fullName: 'Иван Иванов',
                                    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                                },
                                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                            },
                        ]}
                        isLoading={false}
                    />
                </Grid>
            </Grid>
        </>
    );
};