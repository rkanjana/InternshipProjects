// Initialize tasks array from localStorage or empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskCount();
}

// Function to add a new task
function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        tasks.unshift(task); // Add to beginning of array
        saveTasks();
        renderTasks();
        input.value = '';
    }
}

// Function to delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Function to toggle task completion
function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Function to clear completed tasks
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// Function to filter tasks
function filterTasks(filter) {
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === filter) {
            btn.classList.add('active');
        }
    });
    
    renderTasks();
}

// Function to update task count
function updateTaskCount() {
    const activeCount = tasks.filter(task => !task.completed).length;
    document.getElementById('taskCount').textContent = 
        `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;
}

// Function to render tasks
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" 
                   class="task-checkbox"
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleComplete(${task.id})">
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                Delete
            </button>
        `;
        
        taskList.appendChild(li);
    });
    
    updateTaskCount();
}

// Initialize the display
renderTasks();

// Add event listener for Enter key
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Add event listener for input focus
document.getElementById('taskInput').addEventListener('focus', function() {
    this.placeholder = 'What needs to be done?';
});

document.getElementById('taskInput').addEventListener('blur', function() {
    this.placeholder = 'Add a new task...';
});

// Add drag and drop functionality
let draggedItem = null;

document.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('task-item')) {
        draggedItem = e.target;
        e.target.style.opacity = '0.5';
    }
});

document.addEventListener('dragend', function(e) {
    if (e.target.classList.contains('task-item')) {
        e.target.style.opacity = '1';
    }
});

document.addEventListener('dragover', function(e) {
    e.preventDefault();
});

document.getElementById('taskList').addEventListener('drop', function(e) {
    e.preventDefault();
    if (draggedItem) {
        const taskList = document.getElementById('taskList');
        const afterElement = getDragAfterElement(taskList, e.clientY);
        
        if (afterElement) {
            taskList.insertBefore(draggedItem, afterElement);
        } else {
            taskList.appendChild(draggedItem);
        }
        
        // Update tasks array to match new order
        updateTasksOrder();
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateTasksOrder() {
    const newTasks = [];
    document.querySelectorAll('.task-item').forEach(item => {
        const taskId = parseInt(item.querySelector('.delete-btn').getAttribute('onclick').match(/\d+/)[0]);
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            newTasks.push(task);
        }
    });
    tasks = newTasks;
    saveTasks();
}