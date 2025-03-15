import { IoLogoGithub, IoOpenOutline } from 'react-icons/io5';
import CustomButton from '../Button';
import { Box, Container } from '@mui/material';

const Footer = () => {
  return (
    <Container
      sx={{
        position: 'fixed',
        bottom: '0',
        borderTop: 'solid 1px gray',
      }}
      data-testid="footer"
    >
      <Box component="footer" width={'100%'}>
        <CustomButton
          variant="text"
          href="https://github.com/biancashiromoto/register-form"
        >
          <IoLogoGithub
            size={25}
            aria-label="GitHub repo"
            style={{ paddingRight: '6px' }}
          />
          GitHub repo <IoOpenOutline aria-label="Opens in a new tab" />
        </CustomButton>{' '}
      </Box>
    </Container>
  );
};

export default Footer;
