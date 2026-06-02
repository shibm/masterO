import { useEffect, useState } from "react";

export const TaskEditor = ({ task, userRole, onClose, onSave, busy }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending"
  });

  useEffect(() => {
    if (task) {
      const nextEmployeeStatus = {
        pending: "in_progress",
        in_progress: "completed",
        completed: "completed"
      };

      setForm({
        title: task.title,
        description: task.description,
        status: userRole === "employee" ? nextEmployeeStatus[task.status] : task.status
      });
    }
  }, [task, userRole]);

  if (!task) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSave(form);
  };

  const employeeStatuses = {
    pending: ["in_progress"],
    in_progress: ["completed"],
    completed: ["completed"]
  };

  const statusOptions =
    userRole === "employee"
      ? employeeStatuses[task.status]
      : ["pending", "in_progress", "completed"];

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Edit Task</h3>
          <button className="ghost-button" onClick={onClose} type="button">
            Close
          </button>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="full-span">
            <label htmlFor="edit-title">Title</label>
            <input
              id="edit-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={userRole === "employee"}
            />
          </div>
          <div className="full-span">
            <label htmlFor="edit-description">Description</label>
            <textarea
              id="edit-description"
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              disabled={userRole === "employee"}
            />
          </div>
          <div>
            <label htmlFor="edit-status">Status</label>
            <select id="edit-status" name="status" value={form.status} onChange={handleChange}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button className="primary-button" disabled={busy} type="submit">
              {busy ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
