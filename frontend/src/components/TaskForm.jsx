import { useState } from "react";

const initialState = {
  title: "",
  description: "",
  assignedTo: "",
  dueDate: ""
};

export const TaskForm = ({ employees, onSubmit, busy }) => {
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
        <label htmlFor="title">Task title</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="assignedTo">Assign to</label>
        <select id="assignedTo" name="assignedTo" value={form.assignedTo} onChange={handleChange} required>
          <option value="">Select employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
      <div className="full-span">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="dueDate">Due date</label>
        <input id="dueDate" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required />
      </div>
      <div className="form-actions">
        <button className="primary-button" disabled={busy} type="submit">
          {busy ? "Saving..." : "Create Task"}
        </button>
      </div>
    </form>
  );
};
