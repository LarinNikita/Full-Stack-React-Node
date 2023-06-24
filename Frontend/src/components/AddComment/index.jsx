import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import { LoadingButton } from '@mui/lab';

import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { createComment, setCommentTextInput } from "../../redux/slices/posts";

export const AddComment = () => {

  const dispatch = useDispatch();

  const { avatarUrl } = useSelector(state => state.auth.data);

  const { text, status } = useSelector(state => state.posts.currentPost.comment);
  // const { setCommentTextInput } = postsSlice.actions;
  const commentIsLoading = status === 'loading';

  const { id } = useParams();

  // dispatch(setCommentTextInput());

  const handleSubmit = () => {
    dispatch(createComment({ id, comment: text }))
  }

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={avatarUrl}
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={text}
            onChange={e => dispatch(setCommentTextInput(e.target.value))}
          />
          <LoadingButton
            loading={commentIsLoading}
            onClick={handleSubmit}
            variant="contained"
            disabled={text.length <= 3}
          >
            Отправить
          </LoadingButton>
        </div>
      </div>
    </>
  );
};
