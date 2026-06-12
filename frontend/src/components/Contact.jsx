import { useState } from 'react';
import { motion } from 'framer-motion';
import { getApiUrl } from '../utils/api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');  // '', 'sending', 'success', 'error'
  const [focused, setFocused] = useState({});

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFocus = name => setFocused(f => ({ ...f, [name]: true }));
  const handleBlur  = name => setFocused(f => ({ ...f, [name]: false }));

  const isActive = (name) => focused[name] || formData[name];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(getApiUrl('/api/messages'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="contact-section">
      {/* bg orb */}
      <div className="contact-orb" />

      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </motion.h2>

        <div className="contact-grid">
          {/* Left info */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>Let's build something great together!</h3>
            <p>
              I'm always open to discussing new projects, creative ideas, or opportunities.
              Whether you have a brief or just a spark of an idea — let's talk!
            </p>

            <div className="contact-details">
              {[
                { icon: '✉️', label: 'Email', value: 'kirenkumar.dev424@gmail.com', href: 'mailto:kirenkumar.dev424@gmail.com' },
                { icon: '📱', label: 'Phone', value: '+91 7845928388', href: 'tel:+917845928388' },
                { icon: '📍', label: 'Location', value: 'Sivaganga, TamilNadu', href: null },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className="detail-item">
                  <div className="detail-icon">{icon}</div>
                  <div>
                    <span className="detail-label">{label}</span>
                    {href ? (
                      <a href={href} className="detail-value">{value}</a>
                    ) : (
                      <span className="detail-value">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-socials">
              <a href="mailto:kirenkumar.dev424@gmail.com" title="Gmail" target="_blank" rel="noopener noreferrer"><img src="https://cdn.simpleicons.org/gmail" alt="Gmail" /></a>
              <a href="https://linkedin.com/in/kirenkumar-dev424/" target="_blank" rel="noreferrer" title="LinkedIn"><img src="https://www.svgrepo.com/show/157006/linkedin.svg" alt="LinkedIn" /></a>
              <a href="https://wa.me/917845928388" target="_blank" rel="noreferrer" title="WhatsApp"><img src="https://cdn.simpleicons.org/whatsapp" alt="WhatsApp" /></a>
              <a href="https://github.com/kk-projects292/" target="_blank" rel="noreferrer" title="GitHub"><img src="https://cdn.simpleicons.org/github/white" alt="GitHub" /></a>
              <a href="https://www.instagram.com/kk_dev424/" target="_blank" rel="noreferrer" title="Instagram"><img src="https://cdn.simpleicons.org/instagram" alt="Instagram" /></a>
            </div>
          </motion.div>

          {/* Right form */}
          <motion.form
            className="contact-form glass-morphism"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Floating label fields */}
            {[
              { name: 'name',    type: 'text',  label: 'Your Name',    tag: 'input' },
              { name: 'email',   type: 'email', label: 'Email Address', tag: 'input' },
              { name: 'subject', type: 'text',  label: 'Subject',      tag: 'input' },
            ].map(({ name, type, label }) => (
              <div key={name} className={`float-group ${isActive(name) ? 'active' : ''}`}>
                <input
                  type={type}
                  name={name}
                  id={`contact-${name}`}
                  value={formData[name]}
                  onChange={handleChange}
                  onFocus={() => handleFocus(name)}
                  onBlur={() => handleBlur(name)}
                  autoComplete="off"
                  required={name !== 'subject'}
                />
                <label htmlFor={`contact-${name}`}>{label}</label>
                <div className="float-border" />
              </div>
            ))}

            <div className={`float-group float-group--textarea ${isActive('message') ? 'active' : ''}`}>
              <textarea
                name="message"
                id="contact-message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => handleFocus('message')}
                onBlur={() => handleBlur('message')}
                required
              />
              <label htmlFor="contact-message">Your Message</label>
              <div className="float-border" />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={status === 'sending'}>
              {status === 'sending' ? (
                <><span className="btn-spinner" /> Sending...</>
              ) : 'Send Message'}
            </button>

            {/* Status feedback */}
            {status === 'success' && (
              <motion.div className="contact-status success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                ✅ Message sent successfully! I'll get back to you soon.
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div className="contact-status error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                ❌ Something went wrong. Please try again.
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
