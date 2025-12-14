import axios from 'axios';
import * as React from 'react';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

import { Iconify } from '../../components/iconify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  borderRadius: 3,
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export const UserModal = (props: any) => {
  const {open, handleClose, handleSuccess} = props;
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = React.useState('');

  const setUser = async () => {
    const data = {user: {username, email, password}}
    try {
      await axios.post('http://localhost:3000/users/create', data)
      handleSuccess();
    } catch (err: any) {
      if(err?.response?.data) {
        const _err = err?.response?.data
        setError(_err.statusCode + ' ' + _err.message);
      } else {
        setError("Can't create user");
      }
    }
  }

  const renderForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        name="username"
        label="Username"
        defaultValue=""
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <TextField
        fullWidth
        name="email"
        label="Email address"
        defaultValue=""
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      {/*<Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>*/}
      {/*  Forgot password?*/}
      {/*</Link>*/}

      <TextField
        fullWidth
        name="password"
        label="Password"
        defaultValue=""
        type={showPassword ? 'text' : 'password'}
        onChange={(e) => setPassword(e.target.value)}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        onClick={setUser}
      >
        Create user
      </Button>
      <Button
        fullWidth
        style={{marginTop: 15}}
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleClose}
      >
        Cancel
      </Button>
    </Box>
  );
  
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...style, padding: '30px' }}>
        <Typography variant="h5" sx={{ flexGrow: 1, marginBottom: 4 }}>
          Create user
        </Typography>
        {renderForm}
        {error && (
          <Alert severity="error" style={{ marginTop: 10 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
      </Box>
    </Modal>
  );
}
