import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import FiberNewIcon from '@mui/icons-material/FiberNew';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import PersonIcon from '@mui/icons-material/Person';

import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchPopularPosts, fetchTags } from '../redux/slices/posts';

import { selectIsAuth } from '../redux/slices/auth';

export const Home = () => {

  const isAuth = useSelector(selectIsAuth);

  const dispath = useDispatch();
  const userData = useSelector((state) => state.auth.data);

  const { posts, tags, popularPosts } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === 'loading';
  const isPopularPostsLoading = popularPosts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  React.useEffect(() => {
    dispath(fetchPosts());
    dispath(fetchTags());
    dispath(fetchPopularPosts());
  }, []);

  const [value, setValue] = React.useState(localStorage.getItem('tabValue') || '1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem('tabValue', newValue);
  }

  return (
    <TabContext value={value}>
      <TabList
        style={{ marginBottom: 15 }}
        onChange={handleChange}
        aria-label="lab API tabs example"
      >
        <Tab
          icon={<FiberNewIcon sx={{ fontSize: 30 }} />}
          iconPosition="start"
          value="1"
          label="Новые"
        />
        <Tab
          icon={<LocalFireDepartmentIcon sx={{ fontSize: 30 }} />}
          iconPosition="start"
          value="2"
          label="Популярные"
        />
        <Tab
          icon={<PersonIcon sx={{ fontSize: 30 }} />}
          iconPosition="start"
          value="3"
          label="Мои"
          disabled={!isAuth}
        />
      </TabList>
      <TabPanel value="1">
        <Grid container spacing={4}>
          <Grid xs={8} item>
            {(isPostsLoading ? [...Array(5)] : posts.items).map((object, index) =>
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
                  author: {
                    fullName: 'Вася Пупкин',
                    avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                  },
                  comment: 'Это тестовый комментарий',
                },
                {
                  author: {
                    fullName: 'Иван Иванов',
                    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                  },
                  comment: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                },
              ]}
              isLoading={false}
            />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value="2">
        <Grid container spacing={4}>
          <Grid xs={8} item>
            {(isPopularPostsLoading ? [...Array(5)] : popularPosts.items).map((object, index) =>
              isPopularPostsLoading ? (
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
                  author: {
                    fullName: 'Вася Пупкин',
                    avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                  },
                  comment: 'Это тестовый комментарий',
                },
                {
                  author: {
                    fullName: 'Иван Иванов',
                    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                  },
                  comment: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                },
              ]}
              isLoading={false}
            />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value="3">
        <Grid container spacing={4}>
          <Grid xs={8} item>
            {(isPostsLoading ? [...Array(5)] : posts.items.filter(post => userData?._id === post.author._id)).map((object, index) =>
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
                  author: {
                    fullName: 'Вася Пупкин',
                    avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                  },
                  comment: 'Это тестовый комментарий',
                },
                {
                  author: {
                    fullName: 'Иван Иванов',
                    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                  },
                  comment: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                },
              ]}
              isLoading={false}
            />
          </Grid>
        </Grid>
      </TabPanel>
    </TabContext>
  );
};
