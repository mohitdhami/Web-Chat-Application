import React, {useState} from 'react';
import Box from '@mui/material/Box';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

export default function ComposedTextField() {
  const [input, updateInput] = useState("");

  const handleChange = (e) =>{
    e.preventDefault();
    updateInput(e.target.value);
  }

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1 },
      }}
      noValidate
      autoComplete="off"
    >

      <FormControl variant="filled">
        <InputLabel htmlFor="component-filled">Name</InputLabel>
        <FilledInput id="component-filled" value={input} onChange={handleChange}/>
      </FormControl>
    </Box>
  );
}
