import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { getApiUrl } from '../utils/api';
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiExternalLink, FiAward, FiGrid, FiSliders } from 'react-icons/fi';
import './Certificates.css';

/* ── 3D Tilt Certificate Card Component ── */
const Cert3DCard = ({ cert, onZoom }) => {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });

  const glareX = useTransform(mouseX, [0, 1], ['0%', '100%']);
  const glareY = useTransform(mouseY, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsHovered(false);
  };

  const imageUrl = cert.imageUrl.startsWith('http')
    ? cert.imageUrl
    : getApiUrl(cert.imageUrl);

  const issueYear = cert.issueDate ? new Date(cert.issueDate).getFullYear() : null;

  return (
    <motion.div
      ref={cardRef}
      className="cert-3d-wrapper"
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`cert-3d-card ${isHovered ? 'hovered' : ''}`}>
        {/* Top Specular Accent */}
        <div className="cert-card-border-glow" aria-hidden="true" />

        {/* Specular Glare Layer */}
        <motion.div
          className="cert-card-glare"
          style={{
            background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255, 255, 255, 0.16) 0%, transparent 65%)`,
            opacity: isHovered ? 1 : 0,
          }}
          aria-hidden="true"
        />

        {/* Certificate Image Frame */}
        <div className="cert-img-wrap" onClick={() => onZoom(imageUrl)}>
          <img src={imageUrl} alt={cert.title} className="cert-img" loading="lazy" />
          <div className="cert-img-overlay" />

          {/* Hover Zoom Prompt */}
          <div className="cert-zoom-btn">
            <FiMaximize2 />
            <span>Expand</span>
          </div>

          {/* Year Badge */}
          {issueYear && (
            <div className="cert-year-badge">
              <FiAward className="cert-badge-icon" />
              <span>{issueYear}</span>
            </div>
          )}
        </div>

        {/* Certificate Details */}
        <div className="cert-content">
          <span className="cert-issuer-tag">{cert.issuer}</span>
          <h3 className="cert-title">{cert.title}</h3>
          {cert.description && <p className="cert-desc">{cert.description}</p>}

          {/* Action Link */}
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-action-btn"
            >
              <span>Verify Credential</span>
              <FiExternalLink />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Certificates = ({ certificates = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [direction, setDirection] = useState(1);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' | 'grid'
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide functionality for slider mode
  useEffect(() => {
    if (certificates.length === 0 || !isAutoPlaying || viewMode !== 'slider') return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % certificates.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [certificates.length, isAutoPlaying, viewMode]);

  const go = (dir) => {
    if (!certificates.length) return;
    setIsAutoPlaying(false);
    setDirection(dir);
    setCurrentIndex((prev) => (prev + dir + certificates.length) % certificates.length);
  };

  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 90 : -90, scale: 0.92, rotateY: dir > 0 ? 12 : -12 }),
    center: { opacity: 1, x: 0, scale: 1, rotateY: 0, transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] } },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -90 : 90, scale: 0.92, rotateY: dir > 0 ? -12 : 12, transition: { duration: 0.35 } }),
  };

  return (
    <section id="certificates" className="certificates-section">
      {/* Tech Background Mesh & Floating Orbs */}
      <div className="cert-bg-mesh" aria-hidden="true" />
      <div className="cert-bg-orb cert-bg-orb--1" aria-hidden="true" />
      <div className="cert-bg-orb cert-bg-orb--2" aria-hidden="true" />

      <div className="container">
        {/* Top Header & Layout Switcher */}
        <div className="cert-top-bar">
          <motion.div
            className="cert-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Certifications</h2>
            <p className="section-subtitle">
              Verified achievements and professional credentials from leading tech platforms.
            </p>
          </motion.div>

          {/* View Mode Switcher */}
          {certificates.length > 0 && (
            <motion.div
              className="cert-view-toggle glass-morphism"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <button
                className={`cert-toggle-btn ${viewMode === 'slider' ? 'active' : ''}`}
                onClick={() => setViewMode('slider')}
                title="3D Slider View"
                aria-label="Switch to 3D Slider View"
              >
                <FiSliders />
                <span>Slider</span>
              </button>
              <button
                className={`cert-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
                aria-label="Switch to Grid View"
              >
                <FiGrid />
                <span>Grid</span>
              </button>
            </motion.div>
          )}
        </div>

        {certificates.length === 0 ? (
          <p className="no-certs-text">No certificates added yet.</p>
        ) : viewMode === 'slider' ? (
          /* ── SLIDER MODE ── */
          <div className="cert-slider-wrapper">
            <button
              className="cert-nav-btn cert-nav-prev"
              onClick={() => go(-1)}
              aria-label="Previous Certificate"
            >
              <FiChevronLeft />
            </button>

            <div className="cert-slider-stage">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  className="cert-slide-item"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <Cert3DCard
                    cert={certificates[currentIndex]}
                    onZoom={(url) => setSelectedImg(url)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              className="cert-nav-btn cert-nav-next"
              onClick={() => go(1)}
              aria-label="Next Certificate"
            >
              <FiChevronRight />
            </button>

            {/* Pagination & Indicators */}
            <div className="cert-controls-bottom">
              <div className="cert-dots">
                {certificates.map((_, i) => (
                  <button
                    key={i}
                    className={`cert-dot ${i === currentIndex ? 'active' : ''}`}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setDirection(i > currentIndex ? 1 : -1);
                      setCurrentIndex(i);
                    }}
                    aria-label={`Go to certificate slide ${i + 1}`}
                  />
                ))}
              </div>
              <span className="cert-counter-badge">
                {String(currentIndex + 1).padStart(2, '0')} / {String(certificates.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        ) : (
          /* ── GRID MODE ── */
          <motion.div
            className="cert-grid-layout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {certificates.map((cert, idx) => (
              <Cert3DCard
                key={cert._id || idx}
                cert={cert}
                onZoom={(url) => setSelectedImg(url)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
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
              className="cert-modal-content"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImg} alt="Certificate Preview" />
              <button
                className="cert-close-modal"
                onClick={() => setSelectedImg(null)}
                aria-label="Close image modal"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
