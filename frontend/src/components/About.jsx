import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FiCode, FiTerminal, FiAward, FiBookOpen, FiZap } from 'react-icons/fi';
import './About.css';

/* ── 3D Tilt Wrapper ── */
const TiltContainer = ({ children, className = '', style = {}, ...rest }) => {
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

  return (
    <motion.div
      ref={cardRef}
      className={`about-3d-wrapper ${className}`}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000, ...style }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      <div className={`about-3d-card ${isHovered ? 'hovered' : ''}`}>
        <div className="about-card-border-glow" aria-hidden="true" />
        <motion.div
          className="about-card-glare"
          style={{
            background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255, 255, 255, 0.16) 0%, transparent 65%)`,
            opacity: isHovered ? 1 : 0,
          }}
          aria-hidden="true"
        />
        {children}
      </div>
    </motion.div>
  );
};

/* ── Animated Counter ── */
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref} className="stat-number">{count}{suffix}</span>;
};

const STATS = [
  { icon: <FiTerminal />, label: 'Projects Completed', value: 10, suffix: '+' },
  { icon: <FiZap />, label: 'Technologies Mastered', value: 15, suffix: '+' },
  { icon: <FiAward />, label: 'Certifications Earned', value: 8, suffix: '+' },
];

const EDUCATION = [
  {
    year: '2023 – 2026',
    title: 'Bachelor of Science in Computer Science',
    desc: 'Specializing in Algorithms, Data Structures, Database Architecture, and Modern Web Engineering.',
    highlight: true,
    icon: <FiBookOpen />,
  },
  {
    year: '2020 – 2021',
    title: 'Higher Secondary Education',
    desc: 'Core emphasis on Mathematics, Physics, and Computer Science fundamentals.',
    highlight: false,
    icon: <FiCode />,
  },
];

const About = () => {
  return (
    <section id="about" className="about-section">
      {/* Background Animated Orbs & Grid Mesh */}
      <div className="about-bg-mesh" aria-hidden="true" />
      <div className="about-orb about-orb--1" aria-hidden="true" />
      <div className="about-orb about-orb--2" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <motion.div
          className="about-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">
            A glimpse into my background, engineering focus, and academic journey.
          </p>
        </motion.div>

        {/* 3D Bio & Profile Overview */}
        <div className="about-main-row">
          <TiltContainer
            className="about-bio-card-container"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="about-bio-content">
              <div className="bio-badge">
                <span className="bio-badge-dot" />
                <span>Full-Stack Web Engineer</span>
              </div>
              <h3 className="bio-heading">
                Building high-performance web applications with precision & modern architecture.
              </h3>
              <p className="bio-paragraph">
                I am a dedicated MERN Stack Developer focused on architecting fast, scalable, and intuitive digital experiences. My approach pairs clean frontend code with optimized database schemas and resilient APIs.
              </p>
              <p className="bio-paragraph">
                Whether designing responsive web apps or scaling backend microservices, I continuously integrate industry best practices, modern frameworks, and clean UI engineering principles into every project.
              </p>
            </div>
          </TiltContainer>

          {/* Quick Metrics Bar */}
          <div className="about-stats-column">
            {STATS.map((stat, i) => (
              <TiltContainer
                key={i}
                className="about-stat-tilt-wrapper"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="about-stat-inner">
                  <div className="stat-icon-badge">{stat.icon}</div>
                  <div className="stat-info">
                    <Counter target={stat.value} suffix={stat.suffix} />
                    <span className="stat-label">{stat.label}</span>
                  </div>
                </div>
              </TiltContainer>
            ))}
          </div>
        </div>

        {/* Professional Education Journey */}
        <div className="about-education-section">
          <motion.h3
            className="education-heading"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Education & Academic Credentials
          </motion.h3>

          <div className="education-grid">
            {EDUCATION.map((item, i) => (
              <TiltContainer
                key={i}
                className="education-card-wrapper"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className="education-card-inner">
                  <div className="edu-card-top">
                    <span className={`edu-year-badge ${item.highlight ? 'highlight' : ''}`}>
                      {item.year}
                    </span>
                    <div className="edu-icon-wrap">{item.icon}</div>
                  </div>
                  <h4 className="edu-title">{item.title}</h4>
                  <p className="edu-desc">{item.desc}</p>
                </div>
              </TiltContainer>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
