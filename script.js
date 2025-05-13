// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('show');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
        });
    });
    
    // Update clock
    function updateClock() {
        const now = new Date();
        const clock = document.getElementById('clock');
        const footerClock = document.getElementById('footer-clock');
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        if (clock) clock.textContent = timeString;
        if (footerClock) footerClock.textContent = `${dateString} • ${timeString}`;
    }
    
    setInterval(updateClock, 1000);
    updateClock();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // To-Do List functionality
    const advancedTodoForm = document.getElementById('advanced-todo-form');
    const advancedTodoInput = document.getElementById('advanced-todo-input');
    const prioritySelect = document.getElementById('priority-select');
    const advancedTodoList = document.getElementById('advanced-todo-list');
    const filterAll = document.getElementById('filter-all');
    const filterActive = document.getElementById('filter-active');
    const filterCompleted = document.getElementById('filter-completed');
    const clearCompleted = document.getElementById('clear-completed');
    const tasksRemaining = document.getElementById('tasks-remaining');
    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    // Render todos
    function renderTodos(filter = 'all') {
        advancedTodoList.innerHTML = '';
        
        const filteredTodos = todos.filter(todo => {
            if (filter === 'active') return !todo.completed;
            if (filter === 'completed') return todo.completed;
            return true;
        });
        
        if (filteredTodos.length === 0) {
            advancedTodoList.innerHTML = '<li class="empty-message">No tasks found</li>';
            return;
        }
        
        filteredTodos.forEach((todo, index) => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.priority}-priority ${todo.completed ? 'completed' : ''}`;
            
            todoItem.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''} class="todo-checkbox">
                <span class="task-text">${todo.text}</span>
                <div class="task-actions">
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            const checkbox = todoItem.querySelector('.todo-checkbox');
            const editBtn = todoItem.querySelector('.edit-btn');
            const deleteBtn = todoItem.querySelector('.delete-btn');
            
            checkbox.addEventListener('change', () => {
                todos[index].completed = checkbox.checked;
                saveTodos();
                renderTodos(getCurrentFilter());
                updateTasksRemaining();
            });
            
            editBtn.addEventListener('click', () => {
                const newText = prompt('Edit task:', todo.text);
                if (newText !== null && newText.trim() !== '') {
                    todos[index].text = newText.trim();
                    saveTodos();
                    renderTodos(getCurrentFilter());
                }
            });
            
            deleteBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this task?')) {
                    todos.splice(index, 1);
                    saveTodos();
                    renderTodos(getCurrentFilter());
                    updateTasksRemaining();
                }
            });
            
            advancedTodoList.appendChild(todoItem);
        });
    }
    
    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    // Get current filter
    function getCurrentFilter() {
        if (filterActive.classList.contains('active')) return 'active';
        if (filterCompleted.classList.contains('active')) return 'completed';
        return 'all';
    }
    
    // Update tasks remaining count
    function updateTasksRemaining() {
        const activeTodos = todos.filter(todo => !todo.completed).length;
        tasksRemaining.textContent = `${activeTodos} ${activeTodos === 1 ? 'task' : 'tasks'} left`;
    }
    
    // Add new todo
    advancedTodoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const text = advancedTodoInput.value.trim();
        if (text === '') return;
        
        const newTodo = {
            text,
            priority: prioritySelect.value,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        todos.push(newTodo);
        saveTodos();
        renderTodos(getCurrentFilter());
        updateTasksRemaining();
        
        advancedTodoInput.value = '';
        advancedTodoInput.focus();
    });
    
    // Filter todos
    filterAll.addEventListener('click', () => {
        filterAll.classList.add('active');
        filterActive.classList.remove('active');
        filterCompleted.classList.remove('active');
        renderTodos('all');
    });
    
    filterActive.addEventListener('click', () => {
        filterActive.classList.add('active');
        filterAll.classList.remove('active');
        filterCompleted.classList.remove('active');
        renderTodos('active');
    });
    
    filterCompleted.addEventListener('click', () => {
        filterCompleted.classList.add('active');
        filterAll.classList.remove('active');
        filterActive.classList.remove('active');
        renderTodos('completed');
    });
    
    // Clear completed todos
    clearCompleted.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all completed tasks?')) {
            todos = todos.filter(todo => !todo.completed);
            saveTodos();
            renderTodos(getCurrentFilter());
            updateTasksRemaining();
        }
    });
    
    // Initialize
    renderTodos();
    updateTasksRemaining();
    filterAll.classList.add('active');
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
});
// Projects Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter projects
    const filterButtons = document.querySelectorAll('.category-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Add animation to project items on page load
    projectItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});