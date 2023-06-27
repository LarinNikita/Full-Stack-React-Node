import React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

import { SideBlock } from "./SideBlock";
import { Link } from "react-router-dom";

import { Box, Chip, Divider, IconButton, Modal, Stack, Tooltip, Typography } from "@mui/material";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

export const TagsBlock = ({ items, isLoading = true }) => {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    minHeight: '50%',
    // maxHeight: 500,

    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    borderRadius: '6px',
    border: '1px solid #dedede',
    // overflowX: 'auto',
  };

  return (
    <>
      <SideBlock
        title="Тэги"
        button={
          <Tooltip title="Все тэги">
            <IconButton onClick={handleOpen}>
              <OpenInFullIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      >
        <List>
          {(isLoading ? [...Array(5)] : items.slice(-5)).map((name, i) => (
            <Link
              key={i}
              style={{ textDecoration: "none", color: "black" }}
              to={`/tags/${name}`}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <TagIcon />
                  </ListItemIcon>
                  {isLoading ? (
                    <Skeleton width={100} />
                  ) : (
                    <ListItemText primary={name} />
                  )}
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </SideBlock>
      <Modal open={open} >
        <Box sx={style}>
          <Typography variant="h6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            Список тэгов
            <IconButton onClick={handleClose}>
              <CloseFullscreenIcon fontSize="small" />
            </IconButton>
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            style={{maxHeight: 400, overflowX: 'auto'}}
          >
            {(items).map((name, index) => (
              <Link key={index} to={`/tags/${name}`} style={{marginBottom: '15px'}}>
                <Chip label={name} clickable onClick={handleClose} />
              </Link>
            ))}
          </Stack>
        </Box>
      </Modal>
    </>
  );
};
