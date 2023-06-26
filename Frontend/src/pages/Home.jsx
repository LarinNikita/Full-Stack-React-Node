import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import FiberNewIcon from '@mui/icons-material/FiberNew';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import PersonIcon from '@mui/icons-material/Person';

import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags, fetchLastComments } from '../redux/slices/posts';

import { selectIsAuth } from '../redux/slices/auth';

export const Home = () => {

  const isAuth = useSelector(selectIsAuth);

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);

  const defaultTab = 'new';
  const selectedTab = localStorage.getItem('selectedTab') || defaultTab;
  const [sortedBy, setSortedBy] = React.useState(selectedTab);

  const handleTabClick = (tabName) => {
    setSortedBy(tabName);
    localStorage.setItem('selectedTab', tabName);
  };

  function getFilteredPosts() {
    const filteredPosts = sortedBy === 'my'
      ? posts.items.filter(post => userData?._id === post.author._id)
      : posts.items;
    return filteredPosts;
  };

  const tabs = [
    {
      label: 'Новые',
      icon: <FiberNewIcon sx={{ fontSize: 30 }} />,
      onClick: () => handleTabClick('new'),
      value: 'new',
    },
    {
      label: 'Популярные',
      icon: <LocalFireDepartmentIcon sx={{ fontSize: 30 }} />,
      onClick: () => handleTabClick('popular'),
      value: 'popular',
    },
    {
      label: 'Мои',
      icon: <PersonIcon sx={{ fontSize: 30 }} />,
      onClick: () => handleTabClick('my'),
      value: 'my',
      isDisabled: !isAuth,
    },
  ];

  const { posts, tags, comments } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentsLoading = comments.status === 'loading';

  React.useEffect(() => {
    dispatch(fetchPosts(sortedBy));
    dispatch(fetchTags());
    dispatch(fetchLastComments());
  }, [dispatch, sortedBy]);

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={tabs.findIndex((tab) => tab.value === sortedBy)}>
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            icon={tab.icon}
            iconPosition="start"
            label={tab.label}
            onClick={tab.onClick}
            disabled={tab.isDisabled}
          />
        ))}
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : getFilteredPosts()).map((object, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={index}
                id={object._id}
                title={object.title}
                imageUrl={object.imageUrl ? `http://localhost:4444${object.imageUrl}` : ''}
                user={object.author}
                createdAt={new Date(object.createdAt).toLocaleDateString('en-GB')}
                viewsCount={object.viewsCount}
                commentsCount={object.comments.length}
                tags={object.tags}
                isEditable={userData?._id === object.author._id}
              />
            ),
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={comments.items}
            isLoading={isCommentsLoading}
          />
        </Grid>
      </Grid>
    </>
  );
};
