import { Link, useLocation } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiMessageSquare, FiInstagram, FiPhone, FiMapPin, FiArrowUp } from 'react-icons/fi';
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
  { href: 'mailto:kirenkumar.dev424@gmail.com', icon: <FiMail />, title: 'Email' },
  { href: 'https://linkedin.com/in/kirenkumar-dev424/', icon: <FiLinkedin />, title: 'LinkedIn' },
  { href: 'https://github.com/kk-projects292/', icon: <FiGithub />, title: 'GitHub' },
  { href: 'https://wa.me/917845928388', icon: <FiMessageSquare />, title: 'WhatsApp' },
  { href: 'https://www.instagram.com/kk_dev424/', icon: <FiInstagram />, title: 'Instagram' },
];

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      {/* Top Accent Gradient Border */}
      <div className="footer-top-line" aria-hidden="true" />
      <div className="footer-bg-mesh" aria-hidden="true" />

      <div className="container">
        {/* Main Footer Layout */}
        <div className="footer-inner">
          {/* Column 1: Brand Info */}
          <div className="footer-col footer-brand-col">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-emblem">KK</div>
              <div className="footer-logo-title">
                <span className="logo-name">KirenKumar</span>
                <span className="logo-role">Full-Stack Engineer</span>
              </div>
            </Link>
            <p className="footer-tagline">
              Architecting scalable MERN stack web applications, APIs, and modern digital interfaces.
            </p>
            <div className="footer-status-pill">
              <span className="status-dot" />
              <span>Open for Projects & Opportunities</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="footer-col footer-nav-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="footer-link">
                    <span className="link-arrow">→</span>
                    <span>{n.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Direct Contact */}
          <div className="footer-col footer-contact-col">
            <h4 className="footer-col-title">Get in Touch</h4>
            <ul className="footer-contact-list">
              <li>
                <span className="contact-icon"><FiMail /></span>
                <a href="mailto:kirenkumar.dev424@gmail.com">kirenkumar.dev424@gmail.com</a>
              </li>
              <li>
                <span className="contact-icon"><FiPhone /></span>
                <a href="tel:+917845928388">+91 7845928388</a>
              </li>
              <li>
                <span className="contact-icon"><FiMapPin /></span>
                <span>Sivaganga, Tamil Nadu, India</span>
              </li>
            </ul>

            {/* Social Icons Pill Row */}
            <div className="footer-social-row">
              {SOCIALS.map((s) => (
                <a
                  key={s.title}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-btn"
                  title={s.title}
                  aria-label={s.title}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} KirenKumar. Built with precision.
          </p>
          <button
            onClick={scrollToTop}
            className="footer-back-to-top"
            title="Back to top"
            aria-label="Scroll back to top"
          >
            <FiArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
