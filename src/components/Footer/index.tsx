import { Container, Paper } from '@mui/material';
import { IoLogoGithub, IoOpenOutline } from 'react-icons/io5';
import CustomButton from '../Button';

const Footer = () => {
  return (
    <Container>
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }}
        elevation={3}
        component="footer"
      >
        <CustomButton
          variant="text"
          href="https://github.com/biancashiromoto/register-form"
          fullWidth={false}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IoLogoGithub
              size={25}
              aria-label="GitHub repo"
              style={{ marginRight: '6px' }}
            />
            GitHub repo{' '}
            <IoOpenOutline
              aria-label="Opens in a new tab"
              style={{ marginLeft: '6px', transform: 'translateY(-2px)' }}
            />
          </span>
        </CustomButton>
      </Paper>
    </Container>
  );
};

export default Footer;
