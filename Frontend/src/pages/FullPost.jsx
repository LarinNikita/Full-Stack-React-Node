import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { Post } from "../components/Post";
import { AddComment } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";

import { fetchPostsById, fetchPostComments } from "../redux/slices/posts";

export const FullPost = () => {

  const dispatch = useDispatch();

  const { data, status, comments } = useSelector((state) => state.posts.currentPost);
  const userData = useSelector((state) => state.auth.data);

  const isLoading = status === 'loading';
  const isCommentsLoading = comments.status === 'loading';

  const { id } = useParams();


  React.useEffect(() => {
    dispatch(fetchPostsById(id));
    dispatch(fetchPostComments(id));
  }, [dispatch, id]);

  if (isLoading || isCommentsLoading) {
    return <Post isLoading={true} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
        user={data.author}
        createdAt={new Date(data.createdAt).toLocaleDateString('en-GB')}
        viewsCount={data.viewsCount}
        commentsCount={comments.items.length}
        tags={data.tags}
        isFullPost
        isEditable={userData?._id === data.author._id}
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={comments.items}
        isLoading={isCommentsLoading}
      >
        {userData ? <AddComment /> : null}
      </CommentsBlock>
    </>
  );
};
