import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { getApiUrl } from '../utils/api';
import './Skills.css';

/* ── 3D Tilt Card Wrapper ── */
const TiltCard = ({ children, className, style, ...rest }) => {
  const ref = useRef(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouse = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

/* ── Animated Counter ── */
const AnimatedPct = ({ value, delay = 0 }) => {
  const [display, setDisplay] = useState(0);
  const triggered = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const start = performance.now();
          const duration = 1200;
          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          setTimeout(() => requestAnimationFrame(animate), delay * 1000);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, delay]);

  return <span ref={ref} className="skill-pct-counter">{display}%</span>;
};

const Skills = ({ skills = [] }) => {
  const categories = [
    { key: 'frontend', title: 'Frontend Development', icon: '🎨', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { key: 'backend', title: 'Backend & Database', icon: '⚙️', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
    { key: 'tools', title: 'Tools & Technologies', icon: '🛠️', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  ];

  const getLogoSrc = (skill) => {
    if (skill.logoUrl)
      return skill.logoUrl.startsWith('http') ? skill.logoUrl : getApiUrl(skill.logoUrl);
    if (skill.icon && (skill.icon.startsWith('http') || skill.icon.startsWith('/')))
      return skill.icon.startsWith('http') ? skill.icon : getApiUrl(skill.icon);
    return null;
  };

  const renderIcon = (skill, size = 'md') => {
    const cls = size === 'lg' ? 'skill-logo-lg' : 'skill-logo-md';
    const src = getLogoSrc(skill);
    if (src) return <img src={src} alt={skill.name} className={cls} />;
    if (skill.icon?.startsWith('<svg'))
      return <div className={`${cls} skill-svg-icon`} dangerouslySetInnerHTML={{ __html: skill.icon }} />;
    return <div className={`${cls} skill-icon-fallback`}>{skill.icon || '⚡'}</div>;
  };

  const getLevel = (pct) => {
    if (pct >= 90) return { label: 'Expert', tier: 5 };
    if (pct >= 75) return { label: 'Advanced', tier: 4 };
    if (pct >= 60) return { label: 'Proficient', tier: 3 };
    if (pct >= 40) return { label: 'Intermediate', tier: 2 };
    return { label: 'Beginner', tier: 1 };
  };

  return (
    <section id="skills" className="skills-section">
      {/* Background decoration */}
      <div className="sk-grid-bg" aria-hidden="true" />
      <div className="sk-orb sk-orb--1" aria-hidden="true" />
      <div className="sk-orb sk-orb--2" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <motion.div
          className="skills-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Technical Skills</h2>
          <p className="section-subtitle">
            Languages, frameworks, and tools I use to build reliable, user-focused products.
          </p>
        </motion.div>

        {/* ── Category Groups ── */}
        {categories.map((cat, ci) => {
          const catSkills = skills.filter((s) => s.category === cat.key);
          if (!catSkills.length) return null;

          return (
            <motion.div
              key={cat.key}
              className="sk-category-group"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: ci * 0.12 }}
            >
              {/* Category header */}
              <div className="sk-cat-header">
                <div className="sk-cat-title-row">
                  <span className="sk-cat-icon" style={{ background: cat.gradient }}>
                    {cat.icon}
                  </span>
                  <h3 className="sk-cat-title">{cat.title}</h3>
                </div>
                <span className="sk-cat-count">{catSkills.length} skills</span>
                <div className="sk-cat-line" style={{ background: cat.gradient }} />
              </div>

              {/* Skills grid */}
              <div className="sk-cards-grid">
                {catSkills.map((skill, i) => {
                  const level = getLevel(skill.proficiency);
                  return (
                    <TiltCard
                      key={skill._id || `${cat.key}-${skill.name}`}
                      className="sk-card"
                      style={{ '--sk-color': skill.color || '#6366f1', perspective: 800 }}
                      initial={{ opacity: 0, y: 24, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      {/* Animated gradient border */}
                      <div className="sk-card-border" aria-hidden="true" />
                      <div className="sk-card-inner">
                        {/* Color accent strip */}
                        <div className="sk-accent-strip" />

                        {/* Icon */}
                        <div className="sk-icon-area">
                          <div className="sk-icon-ring">{renderIcon(skill, 'lg')}</div>
                        </div>

                        {/* Info */}
                        <h4 className="sk-name">{skill.name}</h4>

                        {/* Level meter — 5 segments */}
                        <div className="sk-level-meter">
                          {[1, 2, 3, 4, 5].map((seg) => (
                            <motion.span
                              key={seg}
                              className={`sk-seg${seg <= level.tier ? ' filled' : ''}`}
                              initial={{ scaleX: 0 }}
                              whileInView={{ scaleX: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: 0.3 + seg * 0.08 + i * 0.03 }}
                            />
                          ))}
                        </div>

                        {/* Label + pct */}
                        <div className="sk-bottom-row">
                          <span className="sk-level-label">{level.label}</span>
                          <AnimatedPct value={skill.proficiency} delay={0.2 + i * 0.04} />
                        </div>
                      </div>
                    </TiltCard>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;
