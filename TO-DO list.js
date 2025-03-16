document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todo-input");
    const addBtn = document.getElementById("add-btn");
    const todoList = document.getElementById("todo-list");

    addBtn.addEventListener("click", addTodo);

    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText === "") return;

        const todoItem = document.createElement("li");
        todoItem.classList.add("todo-item");
        todoItem.draggable = true;

        todoItem.innerHTML = `
            <input type="checkbox" class="todo-checkbox">
            <span class="todo-text">${todoText}</span>
            <button class="delete-btn">✖</button>
        `;

        todoList.appendChild(todoItem);
        todoInput.value = "";

        addDeleteEvent(todoItem);
        addToggleStrikeThrough(todoItem);
        addDragAndDrop(todoItem);
    }

    function addDeleteEvent(todoItem) {
        const deleteBtn = todoItem.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => {
            todoItem.remove();
        });
    }

    function addToggleStrikeThrough(todoItem) {
        const checkbox = todoItem.querySelector(".todo-checkbox");
        const text = todoItem.querySelector(".todo-text");

        checkbox.addEventListener("change", () => {
            text.classList.toggle("completed", checkbox.checked);
            moveCompletedToBottom();
        });
    }

    function addDragAndDrop(todoItem) {
        todoItem.addEventListener("dragstart", () => {
            todoItem.classList.add("dragging");
        });

        todoItem.addEventListener("dragend", () => {
            todoItem.classList.remove("dragging");
        });

        todoList.addEventListener("dragover", (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(todoList, e.clientY);
            if (afterElement == null) {
                todoList.appendChild(todoItem);
            } else {
                todoList.insertBefore(todoItem, afterElement);
            }
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".todo-item:not(.dragging)")];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            return offset < 0 && offset > closest.offset ? {
                offset,
                element: child
            } : closest;
        }, {
            offset: Number.NEGATIVE_INFINITY
        }).element;
    }

    function moveCompletedToBottom() {
        const items = Array.from(todoList.children);
        items.sort((a, b) => {
            const aChecked = a.querySelector(".todo-checkbox").checked;
            const bChecked = b.querySelector(".todo-checkbox").checked;
            return aChecked - bChecked;
        });

        items.forEach(item => todoList.appendChild(item));
    }
});
