import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import './About.css';

/* ── Animated counter ── */
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
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref} className="stat-number">{count}{suffix}</span>;
};

const STATS = [
  { icon: '🚀', label: 'Projects Built', value: 10, suffix: '+', color: 'primary' },
  { icon: '⚡', label: 'Technologies', value: 15, suffix: '+', color: 'accent' },
  { icon: '🎓', label: 'Certifications', value: 8, suffix: '+', color: 'primary' },
];

const SKILLS_HIGHLIGHT = [
  { name: 'MERN Stack', icon: '⚙️', expertise: 'Advanced' },
  { name: 'Full-Stack Dev', icon: '🛠️', expertise: 'Advanced' },
  { name: 'Database Design', icon: '🗄️', expertise: 'Intermediate' },
  { name: 'UI/UX Design', icon: '🎨', expertise: 'Intermediate' },
];

const EDUCATION = [
  {
    year: '2020 – 2021',
    title: 'Higher Secondary Education',
    desc: 'Specialized in Mathematics & Computer Science. Built a strong foundation in logic and programming basics.',
    highlight: false,
    icon: '📚',
  },
  {
    year: '2023 – 2026',
    title: 'Bachelor of Science in Computer Science',
    desc: 'Deep-dived into Data Structures, Algorithms, Database Management, and Web Technologies.',
    highlight: false,
    icon: '🎓',
  },
  {
    year: 'Current',
    title: 'MERN Stack Specialization',
    desc: 'Focusing on building scalable full-stack applications using MongoDB, Express, React, and Node.js.',
    highlight: true,
    icon: '✨',
  },
];

const About = () => {
  const sectionRef = useRef(null);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      {/* bg orbs */}
      <div className="about-orb about-orb--1" />
      <div className="about-orb about-orb--2" />

      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">About Me</h2>
        </motion.div>

        {/* Main content grid */}
        <div className="about-grid">
          {/* Left: Text content */}
          <motion.div
            className="about-text-wrapper"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="intro-highlight" variants={itemVariants}>
              <span className="highlight-icon">💡</span>
              <p className="intro-text">
                I'm a passionate MERN Stack Developer dedicated to building robust, scalable web applications that solve real-world problems.
              </p>
            </motion.div>

            <motion.div
              className="about-text"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                'My journey started with curiosity about how things work on the internet, evolving into mastery of full-stack development. I combine technical expertise with creative problem-solving.',
                'I focus on creating clean, efficient, and user-centric solutions that make an impact. Whether optimizing backend queries or crafting smooth frontend experiences, I pursue excellence in every line of code.',
                'Beyond coding, I stay updated with AI innovations and emerging web trends. I believe in continuous learning and leveraging cutting-edge technology to build solutions that matter.',
              ].map((para, i) => (
                <motion.p key={i} className="about-paragraph" variants={itemVariants}>
                  {para}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Skills highlight */}
          <motion.div
            className="skills-highlight-section"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="skills-title">Key Expertise</h3>
            <div className="skills-grid">
              {SKILLS_HIGHLIGHT.map((skill, i) => (
                <motion.div
                  key={i}
                  className="skill-card glass-morphism"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <div className="skill-icon">{skill.icon}</div>
                  <h4>{skill.name}</h4>
                  <span className="skill-badge">{skill.expertise}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stat cards */}
        <motion.div
          className="stats-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              className={`stat-card glass-morphism stat-card--${stat.color}`}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
            >
              <div className="stat-icon-wrapper">{stat.icon}</div>
              <Counter target={stat.value} suffix={stat.suffix} />
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Education roadmap */}
        <div className="education-roadmap">
          <motion.h3
            className="roadmap-heading"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            My Education Journey
          </motion.h3>

          <div className="roadmap-container">
            <div className="roadmap-line" />

            {EDUCATION.map((item, i) => (
              <motion.div
                key={i}
                className="roadmap-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className={`roadmap-dot ${item.highlight ? 'highlight' : ''}`}>
                  {item.highlight && <div className="dot-ping" />}
                </div>
                <motion.div 
                  className="roadmap-content glass-morphism"
                  whileHover={{ x: 8, boxShadow: '0 12px 35px rgba(99, 102, 241, 0.2)' }}
                >
                  <div className="corner-accent corner-accent--tl" />
                  <div className="corner-accent corner-accent--br" />
                  <div className="roadmap-icon">{item.icon}</div>
                  <span className="roadmap-year">{item.year}</span>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
