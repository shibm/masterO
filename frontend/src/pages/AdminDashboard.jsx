import { useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import { TaskEditor } from "../components/TaskEditor.jsx";
import { TaskForm } from "../components/TaskForm.jsx";
import { TaskTable } from "../components/TaskTable.jsx";
import { UserForm } from "../components/UserForm.jsx";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({ status: "", dueDate: "", page: 1 });
  const [pagination, setPagination] = useState({ total: 0, limit: 10 });
  const [taskBusy, setTaskBusy] = useState(false);
  const [userBusy, setUserBusy] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [taskError, setTaskError] = useState("");
  const [userError, setUserError] = useState("");
  const [userSuccess, setUserSuccess] = useState("");

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
    Promise.all([loadEmployees(), loadTasks()]).catch((requestError) => setLoadError(requestError.message));
  }, []);

  useEffect(() => {
    loadTasks().catch((requestError) => setTaskError(requestError.message));
  }, [filters.page, filters.status, filters.dueDate]);

  const handleCreateTask = async (form) => {
    setTaskBusy(true);
    setTaskError("");

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
      setTaskError(requestError.message);
    } finally {
      setTaskBusy(false);
    }
  };

  const handleUpdateTask = async (form) => {
    setTaskBusy(true);
    setTaskError("");

    try {
      await apiRequest(`/tasks/${selectedTask.id}`, {
        method: "PUT",
        body: JSON.stringify(form)
      });
      setSelectedTask(null);
      await loadTasks();
    } catch (requestError) {
      setTaskError(requestError.message);
    } finally {
      setTaskBusy(false);
    }
  };

  const handleCreateUser = async (form) => {
    setUserBusy(true);
    setUserError("");
    setUserSuccess("");

    try {
      const response = await apiRequest("/users", {
        method: "POST",
        body: JSON.stringify(form)
      });

      await loadEmployees();
      setUserSuccess(`User ${response.user.name} created successfully.`);
    } catch (requestError) {
      setUserError(requestError.message);
      throw requestError;
    } finally {
      setUserBusy(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Manage employees, assign work, and monitor every task in one place."
    >
      <section className="full-width tab-row">
        <button
          className={activeTab === "tasks" ? "tab-button tab-button-active" : "tab-button"}
          onClick={() => setActiveTab("tasks")}
          type="button"
        >
          Tasks
        </button>
        <button
          className={activeTab === "users" ? "tab-button tab-button-active" : "tab-button"}
          onClick={() => setActiveTab("users")}
          type="button"
        >
          Users
        </button>
      </section>

      {activeTab === "tasks" ? (
        <>
          <section className="stack">
            <div className="section-heading">
              <h2>Create Task</h2>
            </div>
            <TaskForm employees={employees} onSubmit={handleCreateTask} busy={taskBusy} />
          </section>

          <section className="panel stack">
            <div className="section-heading">
              <h2>All Tasks</h2>
              <span>{pagination.total} total</span>
            </div>
            {taskError ? <div className="alert">{taskError}</div> : null}
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
        </>
      ) : (
        <>
          <section className="panel stack">
            <div className="section-heading">
              <h2>Users</h2>
              <span>{employees.length} active employees</span>
            </div>
            {loadError ? <div className="alert">{loadError}</div> : null}
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
              <h2>Create User</h2>
              <span>Add employees or admins from the dashboard</span>
            </div>
            {userSuccess ? <div className="alert alert-success">{userSuccess}</div> : null}
            {userError ? <div className="alert">{userError}</div> : null}
            <UserForm onSubmit={handleCreateUser} busy={userBusy} />
          </section>
        </>
      )}

      <TaskEditor
        task={selectedTask}
        userRole="admin"
        onClose={() => setSelectedTask(null)}
        onSave={handleUpdateTask}
        busy={taskBusy}
      />
    </DashboardLayout>
  );
};
