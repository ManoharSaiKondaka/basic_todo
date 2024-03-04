document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const editModal = document.getElementById('editModal');
    const editTaskInput = document.getElementById('editTaskInput');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const addButton = document.querySelector('button[type="submit"]');

    // Retrieve tasks from local storage or initialize an empty array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Return all task titles
    function getAllTaskTitles() {
        return tasks.map(task => task.title);
    }

    // Render tasks to the task list
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('taskItem');
            taskItem.dataset.index = index;
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            taskItem.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.title}</span>
                <div class="actions">
                    <button class="editBtn btn">Edit</button>
                    <button class="deleteBtn btn">Delete</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }

    // Add a new task
    function addTask(title) {
        if (title === "") {
            alert('Task name can not be empty');
        } else if (getAllTaskTitles().includes(title)) {
            alert('Task already exists');
        } else {
            tasks.push({ title, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    }

    // Edit a task
    function editTask(index) {
        // Fill input with current task title
        editTaskInput.value = tasks[index].title;

        // Display the modal
        editModal.style.display = 'block';

        // When the user clicks on save button
        saveEditBtn.onclick = function() {
            const newTitle = editTaskInput.value.trim();
            if (newTitle !== '') {
                tasks[index].title = newTitle;
                saveTasks();
                renderTasks();
                editModal.style.display = 'none'; // Hide the modal
            }
        }

        // When the user clicks on <span> (x), close the modal
        const closeBtn = document.getElementsByClassName('close')[0];
        closeBtn.onclick = function() {
            editModal.style.display = 'none';
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == editModal) {
                editModal.style.display = 'none';
            }
        }
    }

    // Delete a task
    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    // Toggle task completion status
    function toggleTaskCompletion(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    // Add task when clicking the add button
    addButton.addEventListener('click', function() {
        addTask(taskInput.value.trim());
    });

    // Add task when pressing Enter in the input field
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask(taskInput.value.trim());
        }
    });

    // Event delegation for editing and deleting tasks
    taskList.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('editBtn')) {
            const index = target.closest('.taskItem').dataset.index;
            editTask(index);
        } else if (target.classList.contains('deleteBtn')) {
            const index = target.closest('.taskItem').dataset.index;
            deleteTask(index);
        } else if (target.matches('input[type="checkbox"]')) {
            const index = target.closest('.taskItem').dataset.index;
            toggleTaskCompletion(index);
        }
    });

    // Initial rendering of tasks
    renderTasks();
});
