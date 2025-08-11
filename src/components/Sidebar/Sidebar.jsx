import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const menuItems = [
  {
    path: '/incidents',
    icon: 'fas fa-exclamation-triangle',
    label: 'Incidents',
    roles: ['dispatcher', 'admin', 'responder']
  },
  {
    path: '/dispatch',
    icon: 'fas fa-headset',
    label: 'Dispatch Console',
    roles: ['dispatcher', 'admin']
  },
  {
    path: '/map',
    icon: 'fas fa-map-marked-alt',
    label: 'Map View',
    roles: ['dispatcher', 'admin', 'responder']
  },
  {
    path: '/responders',
    icon: 'fas fa-users',
    label: 'Responders',
    roles: ['dispatcher', 'admin']
  },
  {
    path: '/reports',
    icon: 'fas fa-chart-bar',
    label: 'Reports',
    roles: ['dispatcher', 'admin']
  },
  {
    path: '/settings',
    icon: 'fas fa-cog',
    label: 'Settings',
    roles: ['dispatcher', 'admin', 'responder']
  }
];

const Sidebar = ({ collapsed }) => {
  const { user } = useAuth();
  const location = useLocation();

  const filteredMenuItems = menuItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/incidents' && location.pathname.startsWith(path));
  };

  return (
    <div className={`sidebar ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      <div className="sidebar-content">
        <Nav className="flex-column sidebar-nav">
          {filteredMenuItems.map((item) => (
            <Nav.Item key={item.path}>
              <Link
                to={item.path}
                className={`nav-link sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <i className={`${item.icon} sidebar-icon`}></i>
                {!collapsed && <span className="sidebar-label">{item.label}</span>}
              </Link>
            </Nav.Item>
          ))}
        </Nav>

        {/* User info at bottom */}
        <div className="sidebar-footer">
          {!collapsed && user && (
            <div className="user-info">
              <div className="user-avatar-small">
                <img
                  src={user.avatar || 'https://ui-avatars.com/api/?name=User&background=8bc34a&color=fff'}
                  alt="User Avatar"
                />
              </div>
              <div className="user-details">
                <div className="user-name">{user.name}</div>
                <div className="user-role">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
              </div>
            </div>
          )}
          
          {collapsed && user && (
            <div className="user-info-collapsed" title={`${user.name} (${user.role})`}>
              <img
                src={user.avatar || 'https://ui-avatars.com/api/?name=User&background=8bc34a&color=fff'}
                alt="User Avatar"
                className="user-avatar-collapsed"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;