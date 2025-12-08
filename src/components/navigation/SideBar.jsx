import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './navigation.css';
import Activity from '../Activity';
import homeIcon from '../../assets/Frame1.png';
import favoritesIcon from '../../assets/Frame2.png';
import historyIcon from '../../assets/Frame3.png';

function SideBar() {
  const [selected, setSelected] = useState('home');
  const [small] = useState(true);
  const [activities, setActivities] = useState([]);
  const [showActivities, setShowActivities] = useState(false);

  const navigate = useNavigate();

  const setPage = (pageName) => {
    setSelected(pageName.toLowerCase());

    if (pageName === 'Home') {
      navigate('/home');
    } else if (pageName === 'Favorites') {
      navigate('/favorites');
    } else if (pageName === 'Watch Later') {
      navigate('/watchlater');
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        const res = await axios.get('http://localhost:8000/api/activity', {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        });

        console.log('GET /api/activity =>', res.data);

        let data = res.data;

        if (!Array.isArray(data) && Array.isArray(data.activities)) {
          data = data.activities;
        }

        const sorted = [...(data || [])].sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date || a.updatedAt);
          const dateB = new Date(b.createdAt || b.date || b.updatedAt);
          return dateB - dateA;
        });
        setActivities(sorted);

        setShowActivities(true);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setActivities([]);
        setShowActivities(true);
      }
    };

    fetchActivities();
  }, []);

  return (
    <nav className={`sidebar ${small ? 'sidebar-small' : 'sidebar-large'}`}>
      {/* Navigation */}
      <ul className="sidebar-menu">
        <li
          className={`sidebar-item ${selected === 'home' ? 'active' : ''}`}
          onClick={() => setPage('Home')}
        >
          <img src={homeIcon} alt="Home" className="sidebar-icon" />
          <span className="sidebar-text">Home</span>
        </li>

        <li
          className={`sidebar-item ${selected === 'favorites' ? 'active' : ''}`}
          onClick={() => setPage('Favorites')}
        >
          <img src={favoritesIcon} alt="Favorites" className="sidebar-icon" />
          <span className="sidebar-text">Favorites</span>
        </li>

        <li
          className={`sidebar-item ${selected === 'watch later' ? 'active' : ''}`}
          onClick={() => setPage('Watch Later')}
        >
          <img src={historyIcon} alt="Watch Later" className="sidebar-icon" />
          <span className="sidebar-text">Watch Later</span>
        </li>
      </ul>
      {showActivities && (
        <div className="sidebar-activities-container">
          <h2 className="sidebar-activities-title">Latest Activities</h2>

          {activities.length === 0 ? (
            <p className="activity-empty">No activity yet</p>
          ) : (
            <ul className="sidebar-activities">
              {activities.slice(0, 10).map((act) => (
                <Activity key={act.id || `${act.userId}-${act.titleId}-${act.createdAt}`} activity={act} />
              ))}
            </ul>
          )}
        </div>
      )}
    </nav>
  );
}

export default SideBar;
