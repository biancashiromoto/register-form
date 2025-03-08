import { IoLogoGithub, IoOpenOutline } from 'react-icons/io5';

const Footer = () => {
  return (
    <footer
      style={{
        position: 'fixed',
        bottom: '0',
        borderTop: 'solid 1px gray',
        width: '100%',
        padding: '12px 6px',
      }}
      data-testid="footer"
    >
      <a
        target="_blank"
        rel="noopener"
        href="https://github.com/biancashiromoto/register-form"
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IoLogoGithub
          size={25}
          aria-label="GitHub repo"
          style={{ paddingRight: '6px' }}
        />
        GitHub repo <IoOpenOutline aria-label="Opens in a new tab" />
      </a>{' '}
    </footer>
  );
};

export default Footer;
