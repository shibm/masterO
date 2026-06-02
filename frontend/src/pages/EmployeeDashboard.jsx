import { useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import { TaskEditor } from "../components/TaskEditor.jsx";
import { TaskTable } from "../components/TaskTable.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    const response = await apiRequest(`/users/${user.id}/tasks`);
    setTasks(response.tasks);
  };

  useEffect(() => {
    loadTasks().catch((requestError) => setError(requestError.message));
  }, [user.id]);

  const handleUpdateTask = async (form) => {
    setBusy(true);
    setError("");

    try {
      await apiRequest(`/tasks/${selectedTask.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: form.status })
      });
      setSelectedTask(null);
      await loadTasks();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardLayout
      title="Employee Dashboard"
      subtitle="Stay focused on assigned work and move each task through its required status."
    >
      <section className="panel stack full-width">
        <div className="section-heading">
          <h2>My Tasks</h2>
          <span>{tasks.length} assigned</span>
        </div>
        {error ? <div className="alert">{error}</div> : null}
        <TaskTable tasks={tasks} canEdit onEdit={setSelectedTask} />
      </section>

      <TaskEditor
        task={selectedTask}
        userRole="employee"
        onClose={() => setSelectedTask(null)}
        onSave={handleUpdateTask}
        busy={busy}
      />
    </DashboardLayout>
  );
};
