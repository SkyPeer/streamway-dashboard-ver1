import axios from 'axios';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const login = async () => {
    // const user = {"user": {email, password}};

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const response: any = await axios.post("http://localhost:3000/users/login", {user: {email, password}})
      const user = response.data.user;
      console.log(user);
      localStorage.setItem("user", user.email);
      localStorage.setItem("token", user.token);
      handleSignIn();
    } catch (err) {
      alert('Authentication error');
    }
  }

  const handleSignIn = useCallback(() => {
    router.push('/');
  }, [router]);

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
        name="email"
        label="Email address"
        defaultValue="hello@gmail.com"
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
        color="inherit"
        variant="contained"
        onClick={login}
      >
        Sign in
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >

        <Typography variant="h5">Sign in</Typography>
        <SettingsInputAntennaIcon />
        {/*<Typography*/}
        {/*  variant="body2"*/}
        {/*  sx={{*/}
        {/*    color: 'text.secondary',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  Don’t have an account?*/}
        {/*  <Link variant="subtitle2" sx={{ ml: 0.5 }}>*/}
        {/*    Get started*/}
        {/*  </Link>*/}
        {/*</Typography>*/}
      </Box>
      {renderForm}
      {/*<Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>*/}
      {/*  <Typography*/}
      {/*    variant="overline"*/}
      {/*    sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}*/}
      {/*  >*/}
      {/*    OR*/}
      {/*  </Typography>*/}
      {/*</Divider>*/}
      {/*<Box*/}
      {/*  sx={{*/}
      {/*    gap: 1,*/}
      {/*    display: 'flex',*/}
      {/*    justifyContent: 'center',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <IconButton color="inherit">*/}
      {/*    <Iconify width={22} icon="socials:google" />*/}
      {/*  </IconButton>*/}
      {/*  <IconButton color="inherit">*/}
      {/*    <Iconify width={22} icon="socials:github" />*/}
      {/*  </IconButton>*/}
      {/*  <IconButton color="inherit">*/}
      {/*    <Iconify width={22} icon="socials:twitter" />*/}
      {/*  </IconButton>*/}
      {/*</Box>*/}
    </>
  );
}
