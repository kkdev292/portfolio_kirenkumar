import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '../utils/api';
import './Certificates.css';

const Certificates = ({ certificates = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [direction, setDirection] = useState(1);

  // Auto-slide functionality
  useEffect(() => {
    if (certificates.length === 0) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex(prev => (prev + 1) % certificates.length);
    }, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(interval);
  }, [certificates.length]);

  const go = (dir) => {
    if (!certificates.length) return;
    setDirection(dir);
    setCurrentIndex(prev => (prev + dir + certificates.length) % certificates.length);
  };

  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80, transition: { duration: 0.35 } }),
  };

  return (
    <section id="certificates" className="certificates-section">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Certifications
        </motion.h2>

        {certificates.length === 0 ? (
          <p className="no-certs-text">No certificates added yet.</p>
        ) : (
          <>
            <div className="slider-wrapper">
              <button className="slider-btn prev" onClick={() => go(-1)}>&#8249;</button>

              <div className="slider-container">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentIndex}
                    className="certificate-slide"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <div className="cert-card glass-morphism">
                      {/* Image */}
                      <div
                        className="cert-image"
                        onClick={() => {
                          const url = certificates[currentIndex].imageUrl;
                          setSelectedImg(url.startsWith('http') ? url : getApiUrl(url));
                        }}
                      >
                        <img
                          src={
                            certificates[currentIndex].imageUrl.startsWith('http')
                              ? certificates[currentIndex].imageUrl
                              : getApiUrl(certificates[currentIndex].imageUrl)
                          }
                          alt={certificates[currentIndex].title}
                        />
                        <div className="zoom-overlay">
                          <span>🔍 View Full Size</span>
                        </div>
                        <div className="cert-badge">
                          <span>✦</span>
                          {new Date(certificates[currentIndex].issueDate).getFullYear()}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="cert-info">
                        <span className="cert-issuer">{certificates[currentIndex].issuer}</span>
                        <h3>{certificates[currentIndex].title}</h3>
                        {certificates[currentIndex].description && (
                          <p className="cert-description">{certificates[currentIndex].description}</p>
                        )}
                        {certificates[currentIndex].credentialUrl && (
                          <a
                            href={certificates[currentIndex].credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cert-link"
                          >
                            View Credential →
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button className="slider-btn next" onClick={() => go(1)}>&#8250;</button>
            </div>

            {/* Dots */}
            <div className="slider-dots">
              {certificates.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === currentIndex ? 'active' : ''}`}
                  onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
                />
              ))}
            </div>

            {/* Counter */}
            <p className="cert-counter">{currentIndex + 1} / {certificates.length}</p>
          </>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            className="cert-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              onClick={e => e.stopPropagation()}
            >
              <img src={selectedImg} alt="Certificate Full" />
              <button className="close-modal" onClick={() => setSelectedImg(null)}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
