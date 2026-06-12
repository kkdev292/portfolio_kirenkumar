import { motion } from 'framer-motion';
import { getApiUrl } from '../utils/api';
import './Skills.css';

const Skills = ({ skills = [] }) => {
  const progressCategories = [
    { key: 'frontend', title: 'Frontend Development', icon: '🎨' },
    { key: 'backend', title: 'Backend & Database', icon: '⚙️' },
  ];

  const toolsSkills = skills.filter((s) => s.category === 'tools');

  const getLogoSrc = (skill) => {
    if (skill.logoUrl)
      return skill.logoUrl.startsWith('http') ? skill.logoUrl : getApiUrl(skill.logoUrl);
    if (skill.icon && (skill.icon.startsWith('http') || skill.icon.startsWith('/')))
      return skill.icon.startsWith('http') ? skill.icon : getApiUrl(skill.icon);
    return null;
  };

  const renderIcon = (skill) => {
    const src = getLogoSrc(skill);
    if (src) return <img src={src} alt={skill.name} className="skill-logo-mini" />;
    if (skill.icon?.startsWith('<svg'))
      return <div className="skill-logo-mini skill-svg-icon" dangerouslySetInnerHTML={{ __html: skill.icon }} />;
    return <div className="skill-logo-mini skill-icon-fallback">{skill.icon || '⚡'}</div>;
  };

  const mid = Math.ceil(toolsSkills.length / 2);
  const row1 = toolsSkills.slice(0, mid);
  const row2 = toolsSkills.slice(mid);

  const buildMarqueeItems = (items, prefix) =>
    [...items, ...items, ...items].map((skill, i) => ({
      skill,
      key: `${prefix}-${skill._id || skill.name}-${i}`,
    }));

  return (
    <section id="skills" className="skills-section">
      <div className="skills-bg-orb skills-bg-orb--1" aria-hidden="true" />
      <div className="skills-bg-orb skills-bg-orb--2" aria-hidden="true" />

      <div className="container">
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

        <div className="skills-main-row">
          {progressCategories.map((cat, ci) => {
            const catSkills = skills.filter((s) => s.category === cat.key);
            if (!catSkills.length) return null;
            return (
              <motion.div
                key={cat.key}
                className="skill-category-box glass-morphism"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ci * 0.15 }}
              >
                <h3>
                  <span className="skill-cat-icon">{cat.icon}</span>
                  {cat.title}
                </h3>
                <div className="skills-mini-grid">
                  {catSkills.map((skill, i) => (
                    <div
                      key={skill._id || `${cat.key}-${skill.name}`}
                      className="skill-item-mini"
                      style={{ '--skill-color': skill.color || '#6366f1' }}
                    >
                      <div className="skill-header-mini">
                        <div className="skill-icon-wrap">{renderIcon(skill)}</div>
                        <div className="skill-info-mini">
                          <span>{skill.name}</span>
                          <span className="skill-pct">{skill.proficiency}%</span>
                        </div>
                      </div>
                      <div className="progress-bar-mini">
                        <motion.div
                          className="progress"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.06 }}
                          style={{ '--skill-color': skill.color || '#6366f1' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {toolsSkills.length > 0 && (
          <motion.div
            className="tools-marquee-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="tools-marquee-title">Tools & Technologies</h3>

            <div className="marquee-track">
              <div className="marquee-content scroll-left">
                {buildMarqueeItems(row1, 'r1').map(({ skill, key }) => (
                  <div
                    key={key}
                    className="tool-chip glass-morphism"
                    style={{ '--chip-color': skill.color || '#6366f1' }}
                  >
                    {renderIcon(skill)}
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {row2.length > 0 && (
              <div className="marquee-track">
                <div className="marquee-content scroll-right">
                  {buildMarqueeItems(row2, 'r2').map(({ skill, key }) => (
                    <div
                      key={key}
                      className="tool-chip glass-morphism"
                      style={{ '--chip-color': skill.color || '#6366f1' }}
                    >
                      {renderIcon(skill)}
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Skills;
