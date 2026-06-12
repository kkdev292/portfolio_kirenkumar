import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const NAV = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#certificates', label: 'Certificates' },
  { href: '#contact', label: 'Contact' },
];

const SOCIALS = [
  { href: 'mailto:kirenkumar.dev424@gmail.com', src: 'https://cdn.simpleicons.org/gmail', alt: 'Gmail' },
  { href: 'https://linkedin.com/in/kirenkumar-dev424/', src: 'https://www.svgrepo.com/show/157006/linkedin.svg', alt: 'LinkedIn' },
  { href: 'https://wa.me/917845928388', src: 'https://cdn.simpleicons.org/whatsapp', alt: 'WhatsApp' },
  { href: 'https://github.com/kk-projects292/', src: 'https://cdn.simpleicons.org/github/white', alt: 'GitHub' },
  { href: 'https://www.instagram.com/kk_dev424/', src: 'https://cdn.simpleicons.org/instagram', alt: 'Instagram' },
];

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="footer">
    <div className="footer-top-line" />
    <div className="container footer-inner">
      {/* Brand */}
      <div className="footer-brand">
        <Link to="/" className="footer-logo">
          <span className="logo-bracket">&lt;</span>
          <span className="logo-text">KK</span>
          <span className="logo-bracket">/&gt;</span>
        </Link>
        <p className="footer-tagline">
          MERN Stack Developer crafting scalable, beautiful web experiences.
        </p>
        <div className="footer-socials">
          {SOCIALS.map(s => (
            <a key={s.alt} href={s.href} target="_blank" rel="noreferrer" title={s.alt}>
              <img src={s.src} alt={s.alt} />
            </a>
          ))}
        </div>
      </div>

      {/* Nav links */}
      <div className="footer-nav">
        <h4>Navigation</h4>
        <ul>
          {NAV.map(n => (
            <li key={n.href}>
              <a href={n.href}>{n.label}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact snapshot */}
      <div className="footer-contact">
        <h4>Contact</h4>
        <ul>
          <li><span>✉️</span> kirenkumar.dev424@gmail.com</li>
          <li><span>📱</span> +91 7845928388</li>
          <li><span>📍</span> Sivaganga, TamilNadu</li>
        </ul>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="footer-bottom">
      <div className="container footer-bottom-inner">
        <p>© {new Date().getFullYear()} KirenKumar. All rights reserved.</p>
        <p className="footer-credit">Built with ⚛ React + 🍃 MongoDB</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
