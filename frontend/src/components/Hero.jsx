import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getApiUrl } from '../utils/api';
import './Hero.css';

/* ── Particle Canvas ── */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`;
        ctx.fill();
      }
    }

    const COUNT = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 90);
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });

      // draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" />;
};

/* ── Typewriter ── */
const ROLES = ['MERN Stack Developer', 'Full Stack Engineer', 'React Specialist', 'Node.js Developer'];

const Typewriter = () => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[idx % ROLES.length];
    const speed = deleting ? 45 : 90;

    const timer = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1800);
        }
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) {
          setDeleting(false);
          setIdx(i => i + 1);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, deleting, idx]);

  return (
    <span className="typewriter-text">
      {text}
      <span className="typewriter-cursor">|</span>
    </span>
  );
};

/* ── Hero ── */
const Hero = ({ profile, resume }) => {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } }
  };

  return (
    <section id="hero" className="hero-section">
      <ParticleCanvas />

      {/* Background orbs */}
      <div className="hero-orb hero-orb--1" />
      <div className="hero-orb hero-orb--2" />
      <div className="hero-orb hero-orb--3" />

      <div className="container hero-inner">
        {/* LEFT — Text Content */}
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div className="hero-badge" variants={itemVariants}>
            <span className="badge-dot" />
            Available for Work
          </motion.div>

          <motion.h1 className="hero-title" variants={itemVariants}>
            Hi, I'm{' '}
            <span className="hero-name gradient-text">
              {profile?.username || 'KIRENKUMAR'}
            </span>
          </motion.h1>

          <motion.h2 className="hero-subtitle" variants={itemVariants}>
            <Typewriter />
          </motion.h2>

          <motion.p className="hero-description" variants={itemVariants}>
            Building scalable, high-performance web applications with modern
            technologies. Passionate about clean code and great UX.
          </motion.p>

          <motion.div className="hero-btns" variants={itemVariants}>
            <a href="#projects" className="btn btn-primary">
              View Projects
            </a>
            {resume ? (
              <a
                href={getApiUrl(resume.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glow"
              >
                Download Resume
              </a>
            ) : (
              <a href="#contact" className="btn btn-glow">
                Contact Me
              </a>
            )}
          </motion.div>

          <motion.div className="hero-socials" variants={itemVariants}>
            <a href="mailto:kirenkumar.dev424@gmail.com" title="Gmail" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.simpleicons.org/gmail" alt="Gmail" />
            </a>
            <a href="https://linkedin.com/in/kirenkumar-dev424/" target="_blank" rel="noreferrer" title="LinkedIn">
              <img src="https://www.svgrepo.com/show/157006/linkedin.svg" alt="LinkedIn" />
            </a>
            <a href="https://wa.me/917845928388" target="_blank" rel="noreferrer" title="WhatsApp">
              <img src="https://cdn.simpleicons.org/whatsapp" alt="WhatsApp" />
            </a>
            <a href="https://github.com/kk-projects292/" target="_blank" rel="noreferrer" title="GitHub">
              <img src="https://cdn.simpleicons.org/github/white" alt="GitHub" />
            </a>
            <a href="https://www.instagram.com/kk_dev424/" target="_blank" rel="noreferrer" title="Instagram">
              <img src="https://cdn.simpleicons.org/instagram" alt="Instagram" />
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT — Profile Visual */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        >
          <div className="profile-ring-wrapper">
            {/* Spinning gradient ring */}
            <div className="profile-ring" />
            <div className="profile-ring profile-ring--2" />

            {/* Profile image */}
            <div className="profile-img-container">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage.startsWith('http')
                    ? profile.profileImage
                    : getApiUrl(profile.profileImage)}
                  alt="Profile"
                  className="profile-img"
                />
              ) : (
                <div className="profile-placeholder">
                  <span>KK</span>
                </div>
              )}
            </div>

            {/* Floating tech badges */}
            <div className="tech-badge tech-badge--react">⚛ React</div>
            <div className="tech-badge tech-badge--node">⬡ Node.js</div>
            <div className="tech-badge tech-badge--mongo">🍃 MongoDB</div>
            <div className="tech-badge tech-badge--express">⚡ Express</div>
          </div>

          {/* Glow blob */}
          <div className="profile-glow" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>Scroll down</span>
      </motion.div>
    </section>
  );
};

export default Hero;
