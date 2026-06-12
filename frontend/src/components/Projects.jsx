import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '../utils/api';
import './Projects.css';

const normalizeTechStack = (stack) => {
  if (!stack) return [];
  if (Array.isArray(stack)) return stack.map((t) => String(t).trim()).filter(Boolean);
  if (typeof stack === 'string') return stack.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
};

const Projects = ({ projects = [] }) => {
  const [filter, setFilter] = useState('All');

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

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, y: -12, scale: 0.97, transition: { duration: 0.25 } },
  };

  return (
    <section id="projects" className="projects-section">
      <div className="projects-bg-orb projects-bg-orb--1" aria-hidden="true" />
      <div className="projects-bg-orb projects-bg-orb--2" aria-hidden="true" />

      <div className="container">
        <motion.div
          className="projects-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">
            A selection of work spanning full-stack apps, APIs, and interactive experiences.
          </p>
        </motion.div>

        {allTechs.length > 1 && (
          <motion.div
            className="project-filters"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {allTechs.map((tech) => (
              <button
                key={tech}
                type="button"
                className={`project-filter-btn ${filter === tech ? 'active' : ''}`}
                onClick={() => setFilter(tech)}
                aria-pressed={filter === tech}
              >
                {tech}
              </button>
            ))}
          </motion.div>
        )}

        <motion.div
          className="projects-grid"
          layout
          key={filter}
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((project) => (
                <motion.article
                  key={project._id}
                  className="project-card glass-morphism"
                  variants={cardVariants}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ y: -8, transition: { duration: 0.25 } }}
                >
                  <div className="project-img-wrap">
                    <img
                      src={
                        project.imageUrl?.startsWith('http')
                          ? project.imageUrl
                          : getApiUrl(project.imageUrl)
                      }
                      alt={project.title}
                      className="project-img"
                      loading="lazy"
                    />
                    <div className="project-overlay">
                      <div className="overlay-links">
                        {project.demoLink && (
                          <a
                            href={project.demoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="overlay-btn"
                          >
                            Live Demo
                          </a>
                        )}
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            className="overlay-btn overlay-btn--outline"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="project-body">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-desc">{project.description}</p>
                    <div className="project-tech">
                      {normalizeTechStack(project.techStack).map((tech) => (
                        <span key={tech} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <motion.p
                key="empty"
                className="no-projects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No projects found for this filter.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
