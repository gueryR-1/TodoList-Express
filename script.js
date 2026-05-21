const taskForm = document.getElementById('taskForm');
const taskTitleInput = document.getElementById('taskTitle');
const taskStatusSelect = document.getElementById('taskStatus');
const taskList = document.getElementById('taskList');
const message = document.getElementById('message');
const taskCounter = document.getElementById('taskCounter');

let tasks = [];
let nextId = 1;

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;

  setTimeout(() => {
    message.textContent = '';
    message.className = 'message';
  }, 2500);
}

function formatStatus(status) {
  if (status === 'pendiente') return 'Pendiente';
  if (status === 'en-proceso') return 'En proceso';
  if (status === 'completada') return 'Completada';
  return status;
}

function renderTasks() {
  taskList.innerHTML = '';
  taskCounter.textContent = `${tasks.length} tarea${tasks.length === 1 ? '' : 's'}`;

  if (tasks.length === 0) {
    taskList.innerHTML = '<li class="empty-message">No hay tareas creadas.</li>';
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    li.innerHTML = `
      <span class="task-title">${task.title}</span>
      <select class="status-select" data-id="${task.id}">
        <option value="pendiente" ${task.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
        <option value="en-proceso" ${task.status === 'en-proceso' ? 'selected' : ''}>En proceso</option>
        <option value="completada" ${task.status === 'completada' ? 'selected' : ''}>Completada</option>
      </select>
      <button class="delete-btn" data-id="${task.id}">Eliminar</button>
    `;

    taskList.appendChild(li);
  });
}

function createTask(title, status) {
  const newTask = {
    id: nextId,
    title: title,
    status: status
  };

  tasks.push(newTask);
  nextId++;
  renderTasks();
}

function updateTaskStatus(id, newStatus) {
  const task = tasks.find((task) => task.id === id);

  if (task) {
    task.status = newStatus;
    renderTasks();
    showMessage('Estado actualizado correctamente.', 'success');
  }
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
  showMessage('Tarea eliminada correctamente.', 'success');
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const status = taskStatusSelect.value;

  if (title === '') {
    showMessage('Debe ingresar el nombre de la tarea.', 'error');
    return;
  }

  createTask(title, status);
  taskForm.reset();
  taskTitleInput.focus();
  showMessage('Tarea creada correctamente.', 'success');
});

taskList.addEventListener('change', (event) => {
  if (event.target.classList.contains('status-select')) {
    const id = Number(event.target.dataset.id);
    const newStatus = event.target.value;
    updateTaskStatus(id, newStatus);
  }
});

taskList.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-btn')) {
    const id = Number(event.target.dataset.id);
    deleteTask(id);
  }
});

renderTasks();