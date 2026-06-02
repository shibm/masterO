import { useState } from "react";

const initialState = {
  name: "",
  email: "",
  password: "",
  role: "employee"
};

export const UserForm = ({ onSubmit, busy }) => {
  const [form, setForm] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm(initialState);
  };

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="userName">Full name</label>
        <input id="userName" name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="userRole">Role</label>
        <select id="userRole" name="role" value={form.role} onChange={handleChange} required>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label htmlFor="userEmail">Email</label>
        <input id="userEmail" name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="userPassword">Password</label>
        <input
          id="userPassword"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          minLength="8"
          required
        />
      </div>
      <div className="full-span form-actions">
        <button className="primary-button" disabled={busy} type="submit">
          {busy ? "Creating..." : "Create User"}
        </button>
      </div>
    </form>
  );
};
