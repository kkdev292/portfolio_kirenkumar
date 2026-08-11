import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { getApiUrl } from '../utils/api';
import { FiGithub, FiExternalLink, FiChevronLeft, FiChevronRight, FiGrid, FiSliders } from 'react-icons/fi';
import './Projects.css';

const normalizeTechStack = (stack) => {
  if (!stack) return [];
  if (Array.isArray(stack)) return stack.map((t) => String(t).trim()).filter(Boolean);
  if (typeof stack === 'string') return stack.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
};

/* ── 3D Tilt Project Card ── */
const Project3DCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [10, -10]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), { stiffness: 200, damping: 20 });

  // Glare position calculation
  const glareX = useTransform(mouseX, [0, 1], ['0%', '100%']);
  const glareY = useTransform(mouseY, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsHovered(false);
  };

  const imageUrl = project.imageUrl?.startsWith('http')
    ? project.imageUrl
    : getApiUrl(project.imageUrl);

  const techTags = normalizeTechStack(project.techStack);

  return (
    <motion.div
      ref={cardRef}
      className="prj-3d-card-wrapper"
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div className={`prj-3d-card ${isHovered ? 'hovered' : ''}`}>
        {/* Animated Gradient Border Overlay */}
        <div className="prj-card-border-glow" aria-hidden="true" />

        {/* Specular Glare Layer */}
        <motion.div
          className="prj-card-glare"
          style={{
            background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255, 255, 255, 0.18) 0%, transparent 65%)`,
            opacity: isHovered ? 1 : 0,
          }}
          aria-hidden="true"
        />

        {/* Media / Image Box */}
        <div className="prj-media-wrap">
          <img
            src={imageUrl}
            alt={project.title}
            className="prj-img"
            loading="lazy"
          />
          <div className="prj-img-overlay" />

          {/* Quick Action Badges */}
          <div className="prj-floating-actions">
            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noreferrer"
                className="prj-icon-btn"
                title="Live Demo"
                aria-label={`Live Demo of ${project.title}`}
              >
                <FiExternalLink />
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="prj-icon-btn prj-icon-btn--github"
                title="GitHub Code"
                aria-label={`GitHub Repository for ${project.title}`}
              >
                <FiGithub />
              </a>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="prj-content">
          <h3 className="prj-title">{project.title}</h3>
          <p className="prj-desc">{project.description}</p>

          {/* Tech Stack Pills */}
          <div className="prj-tech-list">
            {techTags.map((tech) => (
              <span key={tech} className="prj-tech-pill">
                {tech}
              </span>
            ))}
          </div>

          {/* Bottom Action Footer */}
          <div className="prj-footer">
            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noreferrer"
                className="prj-btn prj-btn-primary"
              >
                <span>Live Preview</span>
                <FiExternalLink className="prj-btn-icon" />
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="prj-btn prj-btn-outline"
              >
                <FiGithub className="prj-btn-icon" />
                <span>Code</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = ({ projects = [] }) => {
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'slider'
  const [currentIndex, setCurrentIndex] = useState(0);

  const filterBarRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const allTechs = useMemo(() => {
    const tags = projects.flatMap((p) => normalizeTechStack(p.techStack));
    return ['All', ...new Set(tags)];
  }, [projects]);

  const filtered = useMemo(() => {
    if (filter === 'All') return projects;
    const needle = filter.toLowerCase();
    return projects.filter((p) =>
      normalizeTechStack(p.techStack).some((t) => t.toLowerCase() === needle)
    );
  }, [projects, filter]);

  // Update filter pill indicator position
  useEffect(() => {
    if (!filterBarRef.current) return;
    const activeBtn = filterBarRef.current.querySelector(`[data-tech="${filter}"]`);
    if (activeBtn) {
      setIndicatorStyle({
        width: activeBtn.offsetWidth,
        left: activeBtn.offsetLeft,
      });
    }
  }, [filter, allTechs]);

  // Reset slide index on filter change
  useEffect(() => {
    setCurrentIndex(0);
  }, [filter]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % filtered.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  return (
    <section id="projects" className="projects-section">
      {/* Background Animated Tech Effects */}
      <div className="prj-bg-mesh" aria-hidden="true" />
      <div className="prj-bg-orb prj-bg-orb--1" aria-hidden="true" />
      <div className="prj-bg-orb prj-bg-orb--2" aria-hidden="true" />
      <div className="prj-bg-orb prj-bg-orb--3" aria-hidden="true" />

      <div className="container">
        {/* Header & Controls Bar */}
        <div className="projects-top-bar">
          <motion.div
            className="projects-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Featured Work</h2>
            <p className="section-subtitle">
              Interactive showcase of full-stack web apps, scalable microservices, and client projects.
            </p>
          </motion.div>

          {/* View Mode Toggle Switch */}
          <motion.div
            className="prj-view-toggle glass-morphism"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <button
              className={`prj-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
              aria-label="Switch to Grid View"
            >
              <FiGrid />
              <span>Grid</span>
            </button>
            <button
              className={`prj-toggle-btn ${viewMode === 'slider' ? 'active' : ''}`}
              onClick={() => setViewMode('slider')}
              title="3D Slider View"
              aria-label="Switch to 3D Slider View"
            >
              <FiSliders />
              <span>Slider</span>
            </button>
          </motion.div>
        </div>

        {/* Tech Stack Filter Pills */}
        {allTechs.length > 1 && (
          <motion.div
            className="prj-filter-bar glass-morphism"
            ref={filterBarRef}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="prj-filter-pill-indicator" style={indicatorStyle} />
            {allTechs.map((tech) => (
              <button
                key={tech}
                data-tech={tech}
                type="button"
                className={`prj-filter-btn ${filter === tech ? 'active' : ''}`}
                onClick={() => setFilter(tech)}
                aria-pressed={filter === tech}
              >
                {tech}
              </button>
            ))}
          </motion.div>
        )}

        {/* Content Display: Grid or 3D Carousel Slider */}
        {filtered.length > 0 ? (
          viewMode === 'grid' ? (
            /* ── GRID VIEW ── */
            <motion.div
              className="projects-grid"
              layout
              key={`grid-${filter}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {filtered.map((project, idx) => (
                <Project3DCard key={project._id || idx} project={project} index={idx} />
              ))}
            </motion.div>
          ) : (
            /* ── SLIDER VIEW ── */
            <div className="projects-slider-wrapper">
              <button
                className="prj-nav-arrow prj-nav-prev"
                onClick={prevSlide}
                aria-label="Previous Project"
              >
                <FiChevronLeft />
              </button>

              <div className="prj-slider-track-container">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={filtered[currentIndex]?._id || currentIndex}
                    className="prj-slider-card-stage"
                    initial={{ opacity: 0, x: 80, scale: 0.9, rotateY: 15 }}
                    animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, x: -80, scale: 0.9, rotateY: -15 }}
                    transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <Project3DCard
                      project={filtered[currentIndex]}
                      index={0}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                className="prj-nav-arrow prj-nav-next"
                onClick={nextSlide}
                aria-label="Next Project"
              >
                <FiChevronRight />
              </button>

              {/* Slider Pagination Dots */}
              <div className="prj-slider-pagination">
                {filtered.map((_, idx) => (
                  <button
                    key={idx}
                    className={`prj-dot ${idx === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )
        ) : (
          <motion.div
            className="no-projects-box glass-morphism"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>No projects matched the selected tech stack filter.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
