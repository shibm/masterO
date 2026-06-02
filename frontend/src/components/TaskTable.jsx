export const TaskTable = ({ tasks, canEdit, onEdit }) => (
  <div className="table-shell">
    <table className="task-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Assigned To</th>
          <th>Status</th>
          <th>Due Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {tasks.length ? (
          tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.assigned_to_name}</td>
              <td>
                <span className={`status-pill status-${task.status}`}>{task.status.replace("_", " ")}</span>
              </td>
              <td>{new Date(task.due_date).toLocaleDateString()}</td>
              <td>
                {canEdit ? (
                  <button className="secondary-button" onClick={() => onEdit(task)}>
                    Edit
                  </button>
                ) : (
                  "View"
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="empty-row">
              No tasks found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
