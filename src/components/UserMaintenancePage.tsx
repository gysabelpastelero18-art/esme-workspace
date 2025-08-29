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
    fetch('/api/auth/users')
      .then(res => res.json())
      .then(data => setUsers(data));
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
    await fetch(`/api/auth/users/${selectedUser.id}`, { method: 'DELETE' });
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setSelectedUser(null);
    setIsEditing(false);
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
    const user = await res.json();
    if (selectedUser) {
      setUsers(users.map(u => (u.id === user.id ? user : u)));
    } else {
      setUsers([...users, user]);
    }
    setSelectedUser(user);
    setIsEditing(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>User Maintenance</h2>
       <input
         type="text"
         placeholder="Search by username or email"
         value={search}
         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
         style={{ marginBottom: 12, width: 300 }}
       />
      <button onClick={handleAdd} style={{ marginLeft: 12 }}>Add User</button>
      <table border={1} cellPadding={8} style={{ marginTop: 12, width: '100%' }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Branch</th>
            <th>Position</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id} style={{ background: selectedUser?.id === user.id ? '#e0ffe0' : undefined }}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.branch}</td>
              <td>{user.position}</td>
              <td>{user.permissions}</td>
              <td>
                <button onClick={() => handleSelect(user)}>Select</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUser || isEditing ? (
        <div style={{ marginTop: 24, border: '1px solid #ccc', padding: 16, maxWidth: 500 }}>
          <h3>{isEditing ? (selectedUser ? 'Edit User' : 'Add User') : 'User Details'}</h3>
          <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <label>Username: <input name="username" value={form.username} onChange={handleInputChange} disabled={!isEditing && !!selectedUser} /></label><br />
            <label>Password: <input name="password" type="password" value={form.password} onChange={handleInputChange} disabled={!isEditing} /></label><br />
            <label>Email: <input name="email" value={form.email} onChange={handleInputChange} disabled={!isEditing} /></label><br />
            <label>First Name: <input name="firstName" value={form.firstName} onChange={handleInputChange} disabled={!isEditing} /></label><br />
            <label>Last Name: <input name="lastName" value={form.lastName} onChange={handleInputChange} disabled={!isEditing} /></label><br />
            <label>Branch: <input name="branch" value={form.branch} onChange={handleInputChange} disabled={!isEditing} /></label><br />
            <label>Position: <input name="position" value={form.position} onChange={handleInputChange} disabled={!isEditing} /></label><br />
            <label>Permissions: <input name="permissions" value={form.permissions} onChange={handleInputChange} disabled={!isEditing} /></label><br />
            {isEditing ? (
              <button type="submit">Save</button>
            ) : (
              <button type="button" onClick={handleEdit}>Edit</button>
            )}
            <button type="button" onClick={handleDelete} style={{ marginLeft: 12 }}>Delete</button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
