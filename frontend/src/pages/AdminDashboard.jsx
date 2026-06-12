import { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { getApiUrl } from '../utils/api';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from '../components/Toast';
import './AdminDashboard.css';

const SkeletonLoader = ({ type }) => {
  if (type === 'projects' || type === 'certificates') {
    return (
      <div className="skeleton-grid">
        {[1, 2, 3].map((n) => (
          <div key={n} className="skeleton-card glass-morphism pulse">
            <div className="skeleton-thumb"></div>
            <div className="skeleton-details">
              <div className="skeleton-title-line"></div>
              <div className="skeleton-text-line"></div>
            </div>
            <div className="skeleton-actions"></div>
          </div>
        ))}
      </div>
    );
  }
  if (type === 'skills') {
    return (
      <div className="skeleton-skills">
        {[1, 2].map((cat) => (
          <div key={cat} className="skeleton-category-admin">
            <div className="skeleton-category-header pulse"></div>
            <div className="skeleton-skills-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="skeleton-skill-card glass-morphism pulse">
                  <div className="skeleton-skill-top">
                    <div className="skeleton-skill-icon"></div>
                    <div className="skeleton-skill-meta"></div>
                  </div>
                  <div className="skeleton-skill-progress"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (type === 'messages') {
    return (
      <div className="skeleton-messages">
        {[1, 2, 3].map((n) => (
          <div key={n} className="skeleton-message-card glass-morphism pulse">
            <div className="skeleton-message-title"></div>
            <div className="skeleton-message-text"></div>
            <div className="skeleton-message-body"></div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="skeleton-form-container glass-morphism pulse">
      <div className="skeleton-form-header"></div>
      <div className="skeleton-form-group"></div>
      <div className="skeleton-form-group"></div>
      <div className="skeleton-form-btn"></div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [resume, setResume] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    profileImage: ''
  });
  const [uploading, setUploading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropType, setCropType] = useState(null); // 'profile' or 'project'
  const [editingId, setEditingId] = useState(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '',
    imageUrl: '',
    demoLink: '',
    githubLink: ''
  });
  const [newCertificate, setNewCertificate] = useState({
    title: '',
    issuer: '',
    filename: '',
    imageUrl: '',
    issueDate: '',
    credentialUrl: '',
    description: ''
  });
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'frontend',
    proficiency: 80,
    icon: '',
    logoUrl: '',
    color: '#6366f1',
    order: 0
  });
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [skillFilter, setSkillFilter] = useState('all');

  useEffect(() => {
    const loadAllData = async () => {
      setLoadingData(true);
      try {
        await Promise.all([
          fetchProjects().catch(err => console.error("Error fetching projects:", err)),
          fetchMessages().catch(err => console.error("Error fetching messages:", err)),
          fetchProfile().catch(err => console.error("Error fetching profile:", err)),
          fetchResume().catch(err => console.error("Error fetching resume:", err)),
          fetchCertificates().catch(err => console.error("Error fetching certificates:", err)),
          fetchSkills().catch(err => console.error("Error fetching skills:", err))
        ]);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    loadAllData();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch(getApiUrl('/api/auth/profile'));
    const data = await res.json();
    setProfile({
      username: data.username,
      profileImage: data.profileImage || ''
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const res = await fetch(getApiUrl('/api/auth/profile'), {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    });
    
    if (res.ok) {
      toast.success('Profile updated!');
      setProfile({ ...profile, password: '' });
    } else {
      const error = await res.json();
      console.error('Update Profile Error:', error);
      toast.error('Error updating profile: ' + (error.message || 'Unknown error'));
    }
  };

  const onCropComplete = useCallback((reachedArea, reachedAreaPixels) => {
    setCroppedAreaPixels(reachedAreaPixels);
  }, []);

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    setCropType(type);
    const reader = new FileReader();
    reader.addEventListener('load', () => setImageToCrop(reader.result));
    reader.readAsDataURL(file);
  };

  const handleCropDone = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const formData = new FormData();
      formData.append('image', croppedImageBlob, 'upload.jpg');
      
      setUploading(true);
      setImageToCrop(null);

      const token = localStorage.getItem('adminToken');
      const res = await fetch(getApiUrl(`/api/upload?type=${cropType}`), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await res.json();

      if (cropType === 'profile') {
        const updatedProfile = { ...profile, profileImage: data.url };
        setProfile(updatedProfile);

        // Auto-save profile
        await fetch(getApiUrl('/api/auth/profile'), {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedProfile)
        });
        toast.success('Profile photo updated!');
      } else if (cropType === 'project') {
        setNewProject(prev => ({ ...prev, imageUrl: data.url }));
        console.log('Project Image Uploaded:', data.url);
        toast.success('Project image uploaded!');
      } else if (cropType === 'skill') {
        setNewSkill(prev => ({ ...prev, logoUrl: data.url }));
        console.log('Skill Logo Uploaded:', data.url);
        toast.success('Skill logo uploaded!');
      } else if (cropType === 'skill-icon') {
        setNewSkill(prev => ({ ...prev, icon: data.url }));
        console.log('Skill Icon Uploaded:', data.url);
        toast.success('Skill icon uploaded!');
      }

      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  const fetchProjects = async () => {
    const res = await fetch(getApiUrl('/api/projects'));
    const data = await res.json();
    setProjects(data);
  };

  const fetchMessages = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(getApiUrl('/api/messages'), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setMessages(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.reload();
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = editingId ? getApiUrl(`/api/projects/${editingId}`) : getApiUrl('/api/projects');
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...newProject,
        techStack: typeof newProject.techStack === 'string' ? newProject.techStack.split(',').map(s => s.trim()) : newProject.techStack
      })
    });
    if (res.ok) {
      setShowAddForm(false);
      setEditingId(null);
      fetchProjects();
      setNewProject({ title: '', description: '', techStack: '', imageUrl: '', demoLink: '', githubLink: '' });
      toast.success(editingId ? 'Project updated!' : 'Project added!');
    } else {
      const error = await res.json();
      console.error('Project Save Error:', error);
      toast.error('Error saving project: ' + (error.message || 'Unknown error'));
    }
  };

  const handleEditClick = (p) => {
    setNewProject({
      title: p.title,
      description: p.description,
      techStack: p.techStack.join(', '),
      imageUrl: p.imageUrl,
      demoLink: p.demoLink || '',
      githubLink: p.githubLink || ''
    });
    setEditingId(p._id);
    setShowAddForm(true);
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(getApiUrl(`/api/projects/${id}`), {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchProjects();
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(getApiUrl(`/api/messages/${id}`), {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchMessages();
  };

  const fetchResume = async () => {
    try {
      const res = await fetch(getApiUrl('/api/resume'));
      if (res.ok) {
        const data = await res.json();
        setResume(data);
      }
    } catch (err) {
      console.error('Error fetching resume:', err);
    }
  };

  const fetchCertificates = async () => {
    try {
      const res = await fetch(getApiUrl('/api/certificates'));
      const data = await res.json();
      setCertificates(data);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(getApiUrl('/api/upload?type=resume'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();

      // Save resume to database
      const token2 = localStorage.getItem('adminToken');
      const saveRes = await fetch(getApiUrl('/api/resume'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token2}`
        },
        body: JSON.stringify({
          filename: file.name,
          url: data.url
        })
      });

      if (saveRes.ok) {
        toast.success('Resume uploaded successfully!');
        fetchResume();
      }
      setUploading(false);
    } catch (err) {
      console.error(err);
      toast.error('Error uploading resume');
      setUploading(false);
    }
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const url = editingId ? getApiUrl(`/api/certificates/${editingId}`) : getApiUrl('/api/certificates');
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newCertificate,
          filename: newCertificate.filename || newCertificate.imageUrl.split('/').pop() || '',
          issueDate: new Date(newCertificate.issueDate).toISOString()
        })
      });

      if (res.ok) {
        setShowAddForm(false);
        setEditingId(null);
        setNewCertificate({
          title: '',
          issuer: '',
          filename: '',
          imageUrl: '',
          issueDate: '',
          credentialUrl: '',
          description: ''
        });
        fetchCertificates();
        toast.success(editingId ? 'Certificate updated!' : 'Certificate added!');
      } else {
        const error = await res.json();
        toast.error('Error: ' + (error.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      toast.error('Error adding certificate');
    }
  };

  const handleCertificateImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(getApiUrl('/api/upload?type=certificate'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setNewCertificate({ ...newCertificate, imageUrl: data.url, filename: file.name });
      toast.success('Certificate image uploaded!');
      setUploading(false);
    } catch (err) {
      console.error(err);
      toast.error('Error uploading certificate image');
      setUploading(false);
    }
  };

  const deleteCertificate = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(getApiUrl(`/api/certificates/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCertificates();
      toast.success('Certificate deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Error deleting certificate');
    }
  };

  const handleEditCertificate = (cert) => {
    setNewCertificate({
      title: cert.title,
      issuer: cert.issuer,
      filename: cert.filename || cert.imageUrl.split('/').pop() || '',
      imageUrl: cert.imageUrl,
      issueDate: cert.issueDate.split('T')[0],
      credentialUrl: cert.credentialUrl || '',
      description: cert.description || ''
    });
    setEditingId(cert._id);
    setShowAddForm(true);
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch(getApiUrl('/api/skills'));
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const url = editingId ? getApiUrl(`/api/skills/${editingId}`) : getApiUrl('/api/skills');
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSkill)
      });

      if (res.ok) {
        setShowAddForm(false);
        setEditingId(null);
        setNewSkill({
          name: '',
          category: 'frontend',
          proficiency: 80,
          icon: '',
          logoUrl: '',
          color: '#6366f1',
          order: 0
        });
        fetchSkills();
        toast.success(editingId ? 'Skill updated!' : 'Skill added!');
      } else {
        const error = await res.json();
        toast.error('Error: ' + (error.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      toast.error('Error adding skill');
    }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(getApiUrl(`/api/skills/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchSkills();
      toast.success('Skill deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Error deleting skill');
    }
  };

  const handleEditSkill = (skill) => {
    setNewSkill({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || '',
      logoUrl: skill.logoUrl || '',
      color: skill.color || '#6366f1',
      order: skill.order || 0
    });
    setEditingId(skill._id);
    setShowAddForm(true);
  };

  return (
    <div className={`admin-layout ${isSidebarMinimized ? 'sidebar-minimized' : ''}`}>
      <ToastContainer />
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Link to="/">KK</Link>
          </div>
          <button className="sidebar-toggle-btn" onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}>
            {isSidebarMinimized ? '▶' : '◀'}
          </button>
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>
            <span className="sidebar-icon">🚀</span> <span className="sidebar-text">Projects</span>
          </button>
          <button className={activeTab === 'certificates' ? 'active' : ''} onClick={() => setActiveTab('certificates')}>
            <span className="sidebar-icon">🏆</span> <span className="sidebar-text">Certificates</span>
          </button>
          <button className={activeTab === 'skills' ? 'active' : ''} onClick={() => setActiveTab('skills')}>
            <span className="sidebar-icon">⚡</span> <span className="sidebar-text">Skills</span>
          </button>
          <button className={activeTab === 'resume' ? 'active' : ''} onClick={() => setActiveTab('resume')}>
            <span className="sidebar-icon">📄</span> <span className="sidebar-text">Resume</span>
          </button>
          <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
            <span className="sidebar-icon">✉️</span> <span className="sidebar-text">Messages</span> {messages.filter(m => !m.read).length > 0 && <span className="badge">{messages.filter(m => !m.read).length}</span>}
          </button>
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            <span className="sidebar-icon">👤</span> <span className="sidebar-text">Profile</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-public-sidebar">
            <span className="sidebar-icon">🌍</span> <span className="sidebar-text">View Site</span>
          </a>
          <button onClick={handleLogout} className="btn-logout-sidebar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logout-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span className="sidebar-text">Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-stat-cards">
          <div className="stat-card-admin"><h3>{projects.length}</h3><p>Projects</p></div>
          <div className="stat-card-admin"><h3>{skills.length}</h3><p>Skills</p></div>
          <div className="stat-card-admin"><h3>{certificates.length}</h3><p>Certificates</p></div>
          <div className="stat-card-admin"><h3>{messages.length}</h3><p>Messages</p></div>
        </div>

        <div className="admin-content">
        {loadingData ? (
          <SkeletonLoader type={activeTab} />
        ) : (
          <>
            {activeTab === 'profile' && (
          <div className="profile-admin">
            <h2>Edit Profile</h2>
            <form className="add-project-form glass-morphism skill-form-enhanced" onSubmit={handleProfileUpdate}>
              <div className="skill-form-title">👤 Edit Admin Profile</div>
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Profile Image URL</label>
                {profile.profileImage && (
                  <div className="profile-form-preview">
                    <img 
                      src={profile.profileImage.startsWith('http') ? profile.profileImage : getApiUrl(profile.profileImage)} 
                      alt="Profile" 
                      style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }}
                    />
                  </div>
                )}
                <input type="text" value={profile.profileImage} onChange={e => setProfile({...profile, profileImage: e.target.value})} />
                <div className="upload-box-inline">
                  <input type="file" id="profileImageUpload" onChange={e => handleFileUpload(e, 'profile')} accept="image/*" style={{ display: 'none' }} />
                  <label htmlFor="profileImageUpload" className="file-label">
                    <div className="file-icon">📷</div>
                    <span>Click to upload profile image</span>
                    <small>PNG, JPG, WEBP (Max 5MB)</small>
                  </label>
                </div>
                {uploading && (
                  <div className="uploading-status">
                    <div className="spinner"></div>
                    <span>Uploading image...</span>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>New Password (leave blank to keep current)</label>
                <input 
                  type="password" 
                  placeholder="Enter new password"
                  onChange={e => setProfile({...profile, password: e.target.value})} 
                />
              </div>
              <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="projects-admin">
            <div className="section-header">
              <h2>Manage Projects</h2>
              <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>Add New Project</button>
            </div>

            {showAddForm && (
              <form className="add-project-form glass-morphism skill-form-enhanced" onSubmit={handleAddProject}>
                <div className="skill-form-title">{editingId ? '✏️ Edit Project' : '🚀 Add New Project'}</div>
                <input type="text" placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required />
                <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} required />
                <input type="text" placeholder="Tech Stack (comma separated)" value={newProject.techStack} onChange={e => setNewProject({...newProject, techStack: e.target.value})} />
                <div className="form-group">
                  <label>Project Image</label>
                  {newProject.imageUrl && (
                    <div className="project-form-preview">
                      <img 
                      src={newProject.imageUrl.startsWith('http') ? newProject.imageUrl : getApiUrl(newProject.imageUrl)}
                        alt="Preview" 
                        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '0.4rem', marginBottom: '10px' }}
                      />
                    </div>
                  )}
                  <input type="text" placeholder="Image URL" value={newProject.imageUrl} onChange={e => setNewProject({...newProject, imageUrl: e.target.value})} />
                  <div className="upload-box-inline">
                    <input type="file" id="projectImageUpload" onChange={e => handleFileUpload(e, 'project')} accept="image/*" style={{ display: 'none' }} />
                    <label htmlFor="projectImageUpload" className="file-label">
                      <div className="file-icon">🖼️</div>
                      <span>Click to upload project image</span>
                      <small>PNG, JPG, WEBP (Max 5MB)</small>
                    </label>
                  </div>
                </div>
                <input type="text" placeholder="Demo Link" value={newProject.demoLink} onChange={e => setNewProject({...newProject, demoLink: e.target.value})} />
                <input type="text" placeholder="GitHub Link" value={newProject.githubLink} onChange={e => setNewProject({...newProject, githubLink: e.target.value})} />
                <div className="form-btns">
                  <button type="submit" className="btn btn-primary">{editingId ? 'Update Project' : 'Save Project'}</button>
                  <button type="button" className="btn btn-outline" onClick={() => { setShowAddForm(false); setEditingId(null); }}>Cancel</button>
                </div>
              </form>
            )}

            <div className="admin-list">
              {projects.map(p => (
                <div key={p._id} className="admin-item glass-morphism">
                  <div className="admin-item-preview">
                    <img 
                      src={p.imageUrl?.startsWith('http') ? p.imageUrl : getApiUrl(p.imageUrl)} 
                      alt={p.title} 
                      className="admin-project-thumb"
                    />
                    <div>
                      <h3>{p.title}</h3>
                      <p>{p.techStack.join(', ')}</p>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => handleEditClick(p)} className="edit-btn">Edit</button>
                    <button onClick={() => deleteProject(p._id)} className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-admin">
            <h2>User Messages</h2>
            <div className="admin-list">
              {messages.map(m => (
                <div key={m._id} className={`admin-item glass-morphism ${!m.read ? 'unread' : ''}`}>
                  <div>
                    <h3>{m.name} ({m.email})</h3>
                    <p className="subject">{m.subject}</p>
                    <p className="msg-body">{m.message}</p>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => deleteMessage(m._id)} className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="skills-admin">
            <div className="section-header">
              <h2>Manage Skills</h2>
              <div className="skills-header-actions">
                <span className="skills-count">{skills.length} skills total</span>
                <button className="btn btn-primary" onClick={() => { setShowAddForm(true); setEditingId(null); setNewSkill({ name: '', category: 'frontend', proficiency: 80, icon: '', logoUrl: '', color: '#6366f1', order: 0 }); }}>+ Add New Skill</button>
              </div>
            </div>

            {showAddForm && (
              <form className="add-project-form glass-morphism skill-form-enhanced" onSubmit={handleAddSkill}>
                <div className="skill-form-title">{editingId ? '✏️ Edit Skill' : '🚀 Add New Skill'}</div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Skill Name</label>
                    <input type="text" placeholder="e.g., React, Node.js" value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select id='skill-options' value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})}>
                      <option value="frontend">Frontend Development</option>
                      <option value="backend">Backend & Database</option>
                      <option value="tools">Tools & Technologies</option>
                      {/* <option value="other">Other Skills</option> */}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Proficiency ({newSkill.proficiency}%)</label>
                    <input type="range" min="1" max="100" value={newSkill.proficiency} onChange={e => setNewSkill({...newSkill, proficiency: parseInt(e.target.value)})} className="proficiency-slider" />
                  </div>
                  <div className="form-group">
                    <label>Display Order</label>
                    <input type="number" min="0" value={newSkill.order} onChange={e => setNewSkill({...newSkill, order: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Icon (optional)</label>
                    <input type="text" placeholder="e.g., ⚛️ or SVG URL" value={newSkill.icon} onChange={e => setNewSkill({...newSkill, icon: e.target.value})} />
                    <div className="upload-box-inline">
                      <input type="file" id="skillIconUpload" onChange={e => handleFileUpload(e, 'skill-icon')} accept=".svg" style={{ display: 'none' }} />
                      <label htmlFor="skillIconUpload" className="file-label">
                        <div className="file-icon">⚡</div>
                        <span>Click to upload SVG icon</span>
                        <small>SVG files only</small>
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Accent Color</label>
                    <div className="color-picker-row">
                      <input type="color" value={newSkill.color} onChange={e => setNewSkill({...newSkill, color: e.target.value})} />
                      <span className="color-hex">{newSkill.color}</span>
                    </div>
                  </div>
                </div>

                <div className="form-btns">
                  <button type="submit" className="btn btn-primary">{editingId ? '💾 Update Skill' : '➕ Add Skill'}</button>
                  <button type="button" className="btn btn-outline" onClick={() => { setShowAddForm(false); setEditingId(null); }}>Cancel</button>
                </div>
              </form>
            )}

            <div className="skills-filter-container">
              <button className={`filter-btn ${skillFilter === 'all' ? 'active' : ''}`} onClick={() => setSkillFilter('all')}>All</button>
              <button className={`filter-btn ${skillFilter === 'frontend' ? 'active' : ''}`} onClick={() => setSkillFilter('frontend')}>🎨 Frontend</button>
              <button className={`filter-btn ${skillFilter === 'backend' ? 'active' : ''}`} onClick={() => setSkillFilter('backend')}>⚙️ Backend</button>
              <button className={`filter-btn ${skillFilter === 'tools' ? 'active' : ''}`} onClick={() => setSkillFilter('tools')}>🔧 Tools</button>
              <button className={`filter-btn ${skillFilter === 'other' ? 'active' : ''}`} onClick={() => setSkillFilter('other')}>📦 Other</button>
            </div>

            <div className="skills-list-enhanced">
              {['frontend', 'backend', 'tools', 'other'].map(category => {
                if (skillFilter !== 'all' && skillFilter !== category) return null;
                
                const categorySkills = skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;

                const catLabels = { frontend: '🎨 Frontend', backend: '⚙️ Backend', tools: '🔧 Tools & Technologies', other: '📦 Other' };

                return (
                  <div key={category} className="skill-category-admin">
                    <div className="skill-category-header">
                      <h3>{catLabels[category] || category}</h3>
                      <span className="category-count">{categorySkills.length}</span>
                    </div>
                    <div className="admin-skills-grid">
                      {categorySkills.map(skill => (
                        <div key={skill._id} className="skill-card-admin glass-morphism" style={{ '--skill-accent': skill.color || '#6366f1' }}>
                          <div className="skill-card-accent"></div>
                          <div className="skill-card-body">
                            <div className="skill-card-top">
                              <div className="skill-card-icon-container">
                                {skill.logoUrl || (skill.icon && (skill.icon.startsWith('http') || skill.icon.startsWith('/'))) ? (
                                  <img
                                    src={skill.logoUrl ? (skill.logoUrl.startsWith('http') ? skill.logoUrl : getApiUrl(skill.logoUrl)) : (skill.icon.startsWith('http') ? skill.icon : getApiUrl(skill.icon))}
                                    alt={skill.name}
                                  />
                                ) : skill.icon && skill.icon.startsWith('<svg') ? (
                                  <div className="skill-svg-icon" dangerouslySetInnerHTML={{ __html: skill.icon }} />
                                ) : (
                                  <span className="skill-emoji-icon">{skill.icon || '⚡'}</span>
                                )}
                              </div>
                              <div className="skill-card-meta">
                                <h4>{skill.name}</h4>
                                <span className="skill-order-badge">#{skill.order || 0}</span>
                              </div>
                            </div>
                            <div className="skill-card-progress">
                              <div className="skill-progress-track">
                                <div className="skill-progress-fill" style={{ width: `${skill.proficiency}%`, background: `linear-gradient(90deg, ${skill.color || '#6366f1'}, ${skill.color || '#6366f1'}88)` }}></div>
                              </div>
                              <span className="skill-progress-value" style={{ color: skill.color || '#6366f1' }}>{skill.proficiency}%</span>
                            </div>
                            <div className="skill-card-actions">
                              <button onClick={() => handleEditSkill(skill)} className="skill-edit-btn">✏️ Edit</button>
                              <button onClick={() => deleteSkill(skill._id)} className="skill-delete-btn">🗑️ Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="resume-admin">
            <div className="section-header">
              <h2>Manage Resume</h2>
            </div>
            
            {resume ? (
              <div className="resume-card glass-morphism">
                <div className="resume-header">
                  <div className="resume-icon">📄</div>
                  <div className="resume-info">
                    <h3>{resume.filename}</h3>
                    <p className="resume-date">Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="resume-actions">
                  <a href={getApiUrl(resume.url)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    ⬇️ Download Resume
                  </a>
                  <button className="btn btn-outline" onClick={() => document.getElementById('resumeFileInput').click()}>
                    🔄 Update Resume
                  </button>
                </div>
              </div>
            ) : (
              <div className="resume-empty glass-morphism">
                <div className="empty-icon">📋</div>
                <h3>No Resume Uploaded Yet</h3>
                <p>Upload your first resume to make it available on your portfolio</p>
              </div>
            )}

            <div className="resume-upload-section glass-morphism">
              <div className="upload-header">
                <h3>📤 Upload New Resume</h3>
                <p>Accepted format: PDF only</p>
              </div>
              <div className="upload-box">
                <input 
                  type="file" 
                  id="resumeFileInput"
                  onChange={handleResumeUpload} 
                  accept=".pdf" 
                  style={{ display: 'none' }}
                />
                <label htmlFor="resumeFileInput" className="file-label">
                  <div className="file-icon">📁</div>
                  <span>Click to upload or drag and drop</span>
                  <small>PDF files only (Max 10MB)</small>
                </label>
              </div>
              {uploading && (
                <div className="uploading-status">
                  <div className="spinner"></div>
                  <span>Uploading resume...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="certificates-admin">
            <div className="section-header">
              <h2>Manage Certificates</h2>
              <button className="btn btn-primary" onClick={() => { setShowAddForm(true); setEditingId(null); setNewCertificate({ title: '', issuer: '', imageUrl: '', issueDate: '', credentialUrl: '', description: '' }); }}>Add New Certificate</button>
            </div>

            {showAddForm && (
              <form className="add-project-form glass-morphism skill-form-enhanced" onSubmit={handleAddCertificate}>
                <div className="skill-form-title">{editingId ? '✏️ Edit Certificate' : '🏆 Add New Certificate'}</div>
                <input type="text" placeholder="Certificate Title" value={newCertificate.title} onChange={e => setNewCertificate({...newCertificate, title: e.target.value})} required />
                <input type="text" placeholder="Issuer/Organization" value={newCertificate.issuer} onChange={e => setNewCertificate({...newCertificate, issuer: e.target.value})} required />
                <input type="date" value={newCertificate.issueDate} onChange={e => setNewCertificate({...newCertificate, issueDate: e.target.value})} required />
                <textarea placeholder="Description" value={newCertificate.description} onChange={e => setNewCertificate({...newCertificate, description: e.target.value})} />
                <input type="text" placeholder="Credential URL (optional)" value={newCertificate.credentialUrl} onChange={e => setNewCertificate({...newCertificate, credentialUrl: e.target.value})} />
                
                <div className="form-group">
                  <label>Certificate Image</label>
                  {newCertificate.imageUrl && (
                    <div className="project-form-preview">
                      <img 
                        src={newCertificate.imageUrl.startsWith('http') ? newCertificate.imageUrl : getApiUrl(newCertificate.imageUrl)} 
                        alt="Certificate" 
                        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '0.4rem', marginBottom: '10px' }}
                      />
                    </div>
                  )}
                  <input type="text" placeholder="Image URL" value={newCertificate.imageUrl} onChange={e => setNewCertificate({...newCertificate, imageUrl: e.target.value})} />
                  <div className="upload-box-inline">
                    <input type="file" id="certificateImageUpload" onChange={handleCertificateImageUpload} accept="image/*" style={{ display: 'none' }} />
                    <label htmlFor="certificateImageUpload" className="file-label">
                      <div className="file-icon">🏆</div>
                      <span>Click to upload certificate image</span>
                      <small>PNG, JPG, WEBP (Max 5MB)</small>
                    </label>
                  </div>
                  {uploading && (
                    <div className="uploading-status">
                      <div className="spinner"></div>
                      <span>Uploading image...</span>
                    </div>
                  )}
                </div>

                <div className="form-btns">
                  <button type="submit" className="btn btn-primary">{editingId ? 'Update Certificate' : 'Add Certificate'}</button>
                  <button type="button" className="btn btn-outline" onClick={() => { setShowAddForm(false); setEditingId(null); }}>Cancel</button>
                </div>
              </form>
            )}

            <div className="admin-list">
              {certificates.map(cert => (
                <div key={cert._id} className="admin-item glass-morphism">
                  <div className="admin-item-preview">
                    <img 
                      src={cert.imageUrl?.startsWith('http') ? cert.imageUrl : getApiUrl(cert.imageUrl)} 
                      alt={cert.title} 
                      className="admin-project-thumb"
                    />
                    <div>
                      <h3>{cert.title}</h3>
                      <p>{cert.issuer} • {new Date(cert.issueDate).getFullYear()}</p>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => handleEditCertificate(cert)} className="edit-btn">Edit</button>
                    <button onClick={() => deleteCertificate(cert._id)} className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
            )}
          </>
        )}
      </div>

      {imageToCrop && (
        <div className="crop-modal">
          <div className="crop-container">
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={cropType === 'profile' ? 1 : 16/9}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="crop-controls">
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(e.target.value)}
            />
            <div className="crop-btns">
              <button type="button" onClick={() => setImageToCrop(null)} className="btn btn-outline">Cancel</button>
              <button type="button" onClick={handleCropDone} className="btn btn-primary">Crop & Upload</button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
};

export default AdminDashboard;
