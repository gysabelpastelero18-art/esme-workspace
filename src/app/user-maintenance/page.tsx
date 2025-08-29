"use client";
import React, { useEffect, useState } from 'react';

export default function UserMaintenancePage() {
  type User = {
    id: number | string;
    username: string;
    password?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    branch?: string;
    position?: string;
    permissions?: string;
  };
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState({ username: '', password: '', email: '', firstName: '', lastName: '', branch: '', position: '', permissions: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/auth/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelect = (user: User) => {
    setSelectedUser(user);
    setForm({
      username: user.username || '',
      password: user.password || '',
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      branch: user.branch || '',
      position: user.position || '',
      permissions: user.permissions || ''
    });
    setSearch('');
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setForm({ username: '', password: '', email: '', firstName: '', lastName: '', branch: '', position: '', permissions: '' });
    setIsEditing(true);
  };

  const handleEdit = () => setIsEditing(true);

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`/api/auth/users/${selectedUser.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setSelectedUser(null);
      setIsEditing(false);
    } catch (err) {
      alert('Error deleting user.');
    }
  };

  const handleSave = async () => {
    const method = selectedUser ? 'PUT' : 'POST';
    const url = selectedUser ? `/api/auth/users/${selectedUser.id}` : '/api/auth/users';
    const body = { ...form, permissions: form.permissions };
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    let user: User | null = null;
    const text = await res.text();
    if (text) {
      user = JSON.parse(text);
      if (user) {
        if (selectedUser) {
          setUsers(users.map(u => (user && u.id === user.id ? user : u)));
        } else {
          setUsers([...users, user]);
        }
        setSelectedUser(user);
      }
    }
    setSearch('');
    setIsEditing(false);
  };

  return (
    <div style={{ padding: '32px 0', background: 'linear-gradient(135deg, #f8fdf8 0%, #e8f5e8 100%)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', background: 'white', borderRadius: 18, boxShadow: '0 4px 32px #9CAF8820', padding: 32, border: '2px solid #A7BCA1' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#4A6741', marginBottom: 0, letterSpacing: 1 }}>User Maintenance</h2>
            <button
              onClick={() => window.location.href = '/maindashboard'}
              title="Go to Main Dashboard"
              style={{
                background: '#A7BCA1',
                border: '2px solid #4A6741',
                borderRadius: 8,
                padding: '8px 16px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px #A7BCA130',
                display: 'flex',
                alignItems: 'center',
                transition: '0.2s'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4A6741" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
                <path d="M3 11.5V21a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1v-9.5a1 1 0 0 0-.293-.707l-9-9a1 1 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 11.5z"/>
              </svg>
              <span style={{ color: '#4A6741', fontWeight: 600, fontSize: 16 }}>Home</span>
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search by username or email"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: 8, border: '2px solid #A7BCA1', fontSize: 16, width: 320, boxShadow: '0 2px 8px #A7BCA110', color: '#4A6741', background: '#F8FDF8' }}
          />
          <button onClick={handleAdd} style={{ background: '#A7BCA1', color: '#4A6741', border: '2px solid #4A6741', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #A7BCA130', cursor: 'pointer', transition: '0.2s' }}>Add User</button>
        </div>
        <div style={{ overflowX: 'auto', marginBottom: 32 }}>
          <table style={{ minWidth: 1200, width: '100%', borderCollapse: 'collapse', fontSize: 16, background: 'white', borderRadius: 12, boxShadow: '0 2px 12px #A7BCA110', border: '2px solid #A7BCA1' }}>
            <thead>
              <tr style={{ background: '#E8F5E8', color: '#4A6741', fontWeight: 700 }}>
                <th style={{ borderBottom: '2px solid #A7BCA1', padding: '12px 8px', textAlign: 'left' }}>Username</th>
                <th style={{ borderBottom: '2px solid #A7BCA1', padding: '12px 8px', textAlign: 'left' }}>Email</th>
                <th style={{ borderBottom: '2px solid #A7BCA1', padding: '12px 8px', textAlign: 'left' }}>First Name</th>
                <th style={{ borderBottom: '2px solid #A7BCA1', padding: '12px 8px', textAlign: 'left' }}>Last Name</th>
                <th style={{ borderBottom: '2px solid #A7BCA1', padding: '12px 8px', textAlign: 'left' }}>Branch</th>
                <th style={{ borderBottom: '2px solid #A7BCA1', padding: '12px 8px', textAlign: 'left' }}>Position</th>
                {/* Permissions column hidden */}
                <th style={{ borderBottom: '2px solid #A7BCA1', padding: '12px 8px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '24px 0', color: '#4A6741' }}>No users found.</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} style={{ background: selectedUser?.id === user.id ? '#F8FDF8' : undefined, borderBottom: '1px solid #A7BCA1', transition: 'background 0.2s' }}>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #A7BCA1', color: '#4A6741' }}>{user.username}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #A7BCA1', color: '#4A6741' }}>{user.email}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #A7BCA1', color: '#4A6741' }}>{user.firstName}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #A7BCA1', color: '#4A6741' }}>{user.lastName}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #A7BCA1', color: '#4A6741' }}>{user.branch}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #A7BCA1', color: '#4A6741' }}>{user.position}</td>
                    {/* Permissions column hidden */}
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #A7BCA1', textAlign: 'center' }}>
                      <button onClick={() => handleSelect(user)} style={{ background: '#E8F5E8', color: '#4A6741', border: '2px solid #A7BCA1', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px #A7BCA110', transition: '0.2s' }}>Select</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {(selectedUser || isEditing) && (
          <div style={{ margin: '0 auto', border: '2px solid #A7BCA1', borderRadius: 12, padding: 24, maxWidth: 520, background: '#F8FDF8', boxShadow: '0 2px 12px #A7BCA110' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#4A6741', marginBottom: 18 }}>{isEditing ? (selectedUser ? 'Edit User' : 'Add User') : 'User Details'}</h3>
            <form onSubmit={e => { e.preventDefault(); handleSave(); }} style={{ display: 'grid', gap: 14 }}>
              <label style={{ fontWeight: 600, color: '#4A6741' }}>Username:
                <input name="username" value={form.username} onChange={handleInputChange} disabled={!isEditing && !!selectedUser} style={{ marginLeft: 8, padding: '8px 12px', borderRadius: 6, border: '2px solid #A7BCA1', fontSize: 15, width: '80%', color: '#4A6741', background: '#E8F5E8' }} />
              </label>
              <label style={{ fontWeight: 600, color: '#4A6741' }}>Password:
                <input name="password" type="password" value={form.password} onChange={handleInputChange} disabled={!isEditing} style={{ marginLeft: 8, padding: '8px 12px', borderRadius: 6, border: '2px solid #A7BCA1', fontSize: 15, width: '80%', color: '#4A6741', background: '#E8F5E8' }} />
              </label>
              <label style={{ fontWeight: 600, color: '#4A6741' }}>Email:
                <input name="email" value={form.email} onChange={handleInputChange} disabled={!isEditing} style={{ marginLeft: 8, padding: '8px 12px', borderRadius: 6, border: '2px solid #A7BCA1', fontSize: 15, width: '80%', color: '#4A6741', background: '#E8F5E8' }} />
              </label>
              <label style={{ fontWeight: 600, color: '#4A6741' }}>First Name:
                <input name="firstName" value={form.firstName} onChange={handleInputChange} disabled={!isEditing} style={{ marginLeft: 8, padding: '8px 12px', borderRadius: 6, border: '2px solid #A7BCA1', fontSize: 15, width: '80%', color: '#4A6741', background: '#E8F5E8' }} />
              </label>
              <label style={{ fontWeight: 600, color: '#4A6741' }}>Last Name:
                <input name="lastName" value={form.lastName} onChange={handleInputChange} disabled={!isEditing} style={{ marginLeft: 8, padding: '8px 12px', borderRadius: 6, border: '2px solid #A7BCA1', fontSize: 15, width: '80%', color: '#4A6741', background: '#E8F5E8' }} />
              </label>
              <label style={{ fontWeight: 600, color: '#4A6741' }}>Branch:
                <input name="branch" value={form.branch} onChange={handleInputChange} disabled={!isEditing} style={{ marginLeft: 8, padding: '8px 12px', borderRadius: 6, border: '2px solid #A7BCA1', fontSize: 15, width: '80%', color: '#4A6741', background: '#E8F5E8' }} />
              </label>
              <label style={{ fontWeight: 600, color: '#4A6741' }}>Position:
                <input name="position" value={form.position} onChange={handleInputChange} disabled={!isEditing} style={{ marginLeft: 8, padding: '8px 12px', borderRadius: 6, border: '2px solid #A7BCA1', fontSize: 15, width: '80%', color: '#4A6741', background: '#E8F5E8' }} />
              </label>
              {/* Permissions field hidden */}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                {isEditing ? (
                  <button type="submit" style={{ background: '#A7BCA1', color: '#4A6741', border: '2px solid #4A6741', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #A7BCA130', cursor: 'pointer', transition: '0.2s' }}>Save</button>
                ) : (
                  <button type="button" onClick={handleEdit} style={{ background: '#E8F5E8', color: '#4A6741', border: '2px solid #A7BCA1', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #A7BCA110', cursor: 'pointer', transition: '0.2s' }}>Edit</button>
                )}
                <button type="button" onClick={handleDelete} style={{ background: '#ff6b35', color: 'white', border: '2px solid #A7BCA1', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #ff6b3530', cursor: 'pointer', transition: '0.2s' }}>Delete</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
