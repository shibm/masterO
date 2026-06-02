import { useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import { TaskEditor } from "../components/TaskEditor.jsx";
import { TaskForm } from "../components/TaskForm.jsx";
import { TaskTable } from "../components/TaskTable.jsx";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";

export const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({ status: "", dueDate: "", page: 1 });
  const [pagination, setPagination] = useState({ total: 0, limit: 10 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadEmployees = async () => {
    const response = await apiRequest("/users");
    setEmployees(response.filter((user) => user.role === "employee"));
  };

  const loadTasks = async () => {
    const query = new URLSearchParams({
      page: String(filters.page),
      limit: String(pagination.limit),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.dueDate ? { dueDate: filters.dueDate } : {})
    });

    const response = await apiRequest(`/tasks?${query.toString()}`);
    setTasks(response.tasks);
    setPagination((current) => ({ ...current, total: response.total }));
  };

  useEffect(() => {
    Promise.all([loadEmployees(), loadTasks()]).catch((requestError) => setError(requestError.message));
  }, []);

  useEffect(() => {
    loadTasks().catch((requestError) => setError(requestError.message));
  }, [filters.page, filters.status, filters.dueDate]);

  const handleCreateTask = async (form) => {
    setBusy(true);
    setError("");

    try {
      await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          assignedTo: Number(form.assignedTo)
        })
      });
      await loadTasks();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateTask = async (form) => {
    setBusy(true);
    setError("");

    try {
      await apiRequest(`/tasks/${selectedTask.id}`, {
        method: "PUT",
        body: JSON.stringify(form)
      });
      setSelectedTask(null);
      await loadTasks();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="Manage employees, assign work, and monitor every task in one place."
    >
      <section className="panel stack">
        <div className="section-heading">
          <h2>Employees</h2>
          <span>{employees.length} active employees</span>
        </div>
        <div className="employee-list">
          {employees.map((employee) => (
            <article key={employee.id} className="employee-card">
              <strong>{employee.name}</strong>
              <span>{employee.email}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="stack">
        <div className="section-heading">
          <h2>Create Task</h2>
        </div>
        <TaskForm employees={employees} onSubmit={handleCreateTask} busy={busy} />
      </section>

      <section className="panel stack full-width">
        <div className="section-heading">
          <h2>All Tasks</h2>
          <span>{pagination.total} total</span>
        </div>
        {error ? <div className="alert">{error}</div> : null}
        <div className="filter-row">
          <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value, page: 1 }))}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="date"
            value={filters.dueDate}
            onChange={(event) => setFilters((current) => ({ ...current, dueDate: event.target.value, page: 1 }))}
          />
        </div>
        <TaskTable tasks={tasks} canEdit onEdit={setSelectedTask} />
        <div className="pagination-row">
          <button
            className="secondary-button"
            disabled={filters.page === 1}
            onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
            type="button"
          >
            Previous
          </button>
          <span>
            Page {filters.page} of {totalPages}
          </span>
          <button
            className="secondary-button"
            disabled={filters.page >= totalPages}
            onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
            type="button"
          >
            Next
          </button>
        </div>
      </section>

      <TaskEditor
        task={selectedTask}
        userRole="admin"
        onClose={() => setSelectedTask(null)}
        onSave={handleUpdateTask}
        busy={busy}
      />
    </DashboardLayout>
  );
};
