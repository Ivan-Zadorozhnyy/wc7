class Task {
    constructor(text, timestamp, isCompleted = false) {
        this.text = text;
        this.timestamp = timestamp;
        this.isCompleted = isCompleted;
    }

    toggleCompleted() {
        this.isCompleted = !this.isCompleted;
    }
}

class TaskList {
    constructor(tasks = []) {
        this.tasks = tasks;
    }

    addTask(task) {
        this.tasks.push(task);
    }

    removeTask(task) {
        const index = this.tasks.indexOf(task);
        if (index !== -1) {
            this.tasks.splice(index, 1);
        }
    }

    getCompletedTasks() {
        return this.tasks.filter(task => task.isCompleted);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const taskListInstance = new TaskList();
    let editingTask = null;

    function addOrUpdateTask() {
        const taskText = document.getElementById('taskInput').value.trim();
        if (!taskText) return;

        if (editingTask) {
            editingTask.text = taskText;
            editingTask.timestamp = new Date().getTime();
            editingTask = null;
        } else {
            const timestamp = new Date().getTime();
            const task = new Task(taskText, timestamp, false);
            taskListInstance.addTask(task);
        }

        document.getElementById('taskInput').value = '';
        updateTaskList();
    }

    function updateTaskList() {
        const taskListElement = document.getElementById('taskList');
        taskListElement.innerHTML = '';

        taskListInstance.tasks.sort((a, b) => b.timestamp - a.timestamp).forEach(task => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.isCompleted;
            checkbox.addEventListener('change', () => {
                task.toggleCompleted();
                updateTaskList();
            });
            li.appendChild(checkbox);

            const span = document.createElement('span');
            span.textContent = `${task.text} (${new Date(task.timestamp).toLocaleString()})`;
            span.addEventListener('dblclick', () => {
                editingTask = task;
                document.getElementById('taskInput').value = task.text;
            });
            li.appendChild(span);

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => {
                taskListInstance.removeTask(task);
                updateTaskList();
            });
            li.appendChild(removeBtn);

            taskListElement.appendChild(li);
        });
    }

    document.getElementById('saveTask').addEventListener('click', addOrUpdateTask);
    document.getElementById('taskInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addOrUpdateTask();
        if (e.key === 'Escape') {
            document.getElementById('taskInput').value = '';
            editingTask = null;
        }
    });

    document.getElementById('removeCompleted').addEventListener('click', () => {
        taskListInstance.tasks = taskListInstance.tasks.filter(task => !task.isCompleted);
        updateTaskList();
    });

    document.getElementById('removeAll').addEventListener('click', () => {
        if (taskListInstance.tasks.some(task => !task.isCompleted)) {
            const confirmDelete = confirm('Are you sure you want to delete all tasks?');
            if (confirmDelete) {
                taskListInstance.tasks = [];
                updateTaskList();
            }
        } else {
            taskListInstance.tasks = [];
            updateTaskList();
        }
    });
});
