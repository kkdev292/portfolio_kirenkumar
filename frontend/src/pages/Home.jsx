import { useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '../utils/api';
import LoadingScreen from '../components/LoadingScreen';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Certificates from '../components/Certificates';
import Contact from '../components/Contact';

const Home = () => {
  // Centralized data state
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Loading tracking: one flag per API call
  const [loaded, setLoaded] = useState({
    profile: false,
    resume: false,
    skills: false,
    projects: false,
    certificates: false,
  });

  const totalSteps = Object.keys(loaded).length;
  const completedSteps = Object.values(loaded).filter(Boolean).length;
  const progress = Math.round((completedSteps / totalSteps) * 100);
  const isComplete = completedSteps === totalSteps;

  const markLoaded = useCallback((key) => {
    setLoaded((prev) => ({ ...prev, [key]: true }));
  }, []);

  useEffect(() => {
    // Fetch profile
    fetch(getApiUrl('/api/auth/profile'))
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        markLoaded('profile');
      })
      .catch((err) => {
        console.error('Error fetching profile:', err);
        markLoaded('profile');
      });

    // Fetch resume
    fetch(getApiUrl('/api/resume'))
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data) setResume(data);
        markLoaded('resume');
      })
      .catch((err) => {
        console.error('Error fetching resume:', err);
        markLoaded('resume');
      });

    // Fetch skills
    fetch(getApiUrl('/api/skills'))
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
        markLoaded('skills');
      })
      .catch((err) => {
        console.error('Error fetching skills:', err);
        markLoaded('skills');
      });

    // Fetch projects
    fetch(getApiUrl('/api/projects'))
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        markLoaded('projects');
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
        markLoaded('projects');
      });

    // Fetch certificates
    fetch(getApiUrl('/api/certificates'))
      .then((res) => res.json())
      .then((data) => {
        setCertificates(data);
        markLoaded('certificates');
      })
      .catch((err) => {
        console.error('Error fetching certificates:', err);
        markLoaded('certificates');
      });
  }, [markLoaded]);

  return (
    <div className="home-page">
      <LoadingScreen progress={progress} isComplete={isComplete} />
      <Hero profile={profile} resume={resume} />
      <About />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Certificates certificates={certificates} />
      <Contact />
    </div>
  );
};

export default Home;
