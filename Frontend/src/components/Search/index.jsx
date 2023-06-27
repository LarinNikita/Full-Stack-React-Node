import React from 'react';

import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { useDispatch } from 'react-redux';
import { setSearchValue } from '../../redux/slices/search';

export const Search = () => {

    const dispatch = useDispatch();

    const handleSearchChange = (event) => {
        dispatch(setSearchValue(event.target.value));
    };


    return (
        <TextField
            size='small'
            placeholder="Поиск..."
            fullWidth
            InputProps={{
                endAdornment: (
                    <SearchIcon style={{ color: '#6c6c6c' }} />
                )
            }}
            onChange={handleSearchChange}
        />
    );
};