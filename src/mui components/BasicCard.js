import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import '../App.css';

export default function BasicCard({admin, username, media}) {
  //Checks Whether Message is of Current Session Admin or not
  const isUserAdmin = admin === username;

  const adminCard = {
    maxWidth: '400px',
    maxHeight: '150px',
    backgroundColor: '#377D71',
    color: 'rgb(244, 239, 239)',
    marginLeft: '20vh',
    marginRight: '1%',
  };
  const userCard = {
    maxWidth: '400px',
    maxHeight: '150px',
    backgroundColor: 'rgb(244, 239, 239)',
    color: 'black',
    marginRight: '20vh',
    marginLeft: '1%',
  };

  return (
    <Card sx={isUserAdmin? adminCard : userCard} >
      <CardContent>
        <Typography sx={{ fontSize: 14 , color: isUserAdmin? 'yellow': 'blueviolet'}} gutterBottom>
          {username}
        </Typography>
        <Typography variant="body2">
          {media}
        </Typography>
      </CardContent>
    </Card>
  );
}
