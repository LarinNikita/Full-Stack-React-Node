import React from "react";

import { SideBlock } from "../SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import styles from "./CommentsBlock.module.scss";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


import { useDispatch, useSelector } from 'react-redux';
import { fetchRemoveComments } from "../../redux/slices/posts";

export const CommentsBlock = ({ items, children, isLoading = true }) => {

  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.data);

  const deleteComment = (commentId) => {
    if (window.confirm('Вы действительно хотите удалить комментарий?')) {
      dispatch(fetchRemoveComments(commentId));
    }
  };

  return (
    <SideBlock title="Комментарии">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={obj.author.fullName} src={obj.author.avatarUrl} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={120} />
                </div>
              ) : (
                <div className={styles.comment}>
                  <ListItemText
                    primary={[
                      <strong key="author">{obj.author.fullName} </strong>,
                      <span key="date" className={styles.created}>{new Date(obj.createdAt).toLocaleDateString('en-GB')}</span>
                    ]}
                    secondary={obj.comment}
                    className={styles.linebreak}
                  />
                  {
                    userData?._id === obj.author._id
                      ? (<IconButton onClick={() => deleteComment(obj._id)}>
                        <DeleteIcon />
                      </IconButton>)
                      : null
                  }
                </div>
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
