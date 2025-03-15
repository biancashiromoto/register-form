import { IoLogoGithub, IoOpenOutline } from 'react-icons/io5';
import CustomButton from '../Button';
import { Box, Container } from '@mui/material';

const Footer = () => {
  return (
    <Container>
      <Box component="footer" width={'100%'}>
        <CustomButton
          variant="text"
          href="https://github.com/biancashiromoto/register-form"
          fullWidth={false}
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
