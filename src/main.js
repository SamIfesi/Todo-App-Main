import "./style.css";
const form = document.querySelector("form");
const list = document.querySelector("ul");
const input = document.querySelector("input");
const btn = document.getElementById("btn");
const itemsLeft = document.getElementById("itemsLeft");

// Load theme from localStorage on page load
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("darkTheme");
}

// Save theme preference to localStorage
btn.addEventListener("click", () => {
  document.body.classList.toggle("darkTheme");

  if (document.body.classList.contains("darkTheme")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// CUSTOM APPEND CHILD TO PREPEND ITEMS
list.appendChild = function (node) {
  return this.insertBefore(node, this.firstChild);
};

// CREATE NEW LIST ITEM
function createNewLI(task) {
  const li = document.createElement("li");
  li.classList.add("item");
  li.setAttribute("key-id", task.id);
  li.innerHTML = `<span class="marker">
              <img src="/images/icon-check.svg" alt="checker" />
            </span>
            <span>${task.text}</span>
            <img src="/images/icon-cross.svg" alt="close icon" class="close">`;

  // REMOVE ITEM FOR DOM AND LOCAL STORAGE
  const remove = li.querySelector(".close");
  remove.addEventListener("click", (e) => {
    const item = e.target.closest("li");
    const id = item.getAttribute("key-id");
    if (item) {
      item.remove(item);

      // REMOVE FROM LOCALSTORAGE
      let tasks = JSON.parse(localStorage.getItem("key")) || [];
      tasks = tasks.filter((task) => task.id !== item.getAttribute("key-id"));
      itemsLeft.textContent = tasks.length;
      localStorage.setItem("key", JSON.stringify(tasks));
    }
  });

  // TOGGLE CHECKED STATE
  li.addEventListener("click", (e) => {
    const item =
      e.target.tagName === "LI" ||
      e.target.classList.contains("marker") ||
      e.target.tagName === "SPAN";
    if (item) {
      li.classList.toggle("checked");
    }
  });
  return li;
}

// FORM SUBMIT EVENT
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = input.value.trim();

  if (inputValue !== "") {
    const newTask = {
      text: inputValue,
      id: Date.now().toString(),
      completed: false,
    };

    const listItem = createNewLI(newTask);
    list.appendChild(listItem);
    saveData(newTask.text);
    input.value = "";
  }
});

// SAVE TO LOCALSTORAGE
function saveData(taskText) {
  let tasks = JSON.parse(localStorage.getItem("key")) || [];
  const newValue = {
    text: taskText,
    id: Date.now().toString(),
    completed: false,
  };
  tasks.push(newValue);
  itemsLeft.textContent = tasks.length;
  localStorage.setItem("key", JSON.stringify(tasks));
}

// SHOW DATA FROM LOCALSTORAGE
function showData() {
  const storedTasks = JSON.parse(localStorage.getItem("key")) || [];
  itemsLeft.textContent = storedTasks.length;
  storedTasks.forEach((storedTask) => {
    const listItem = createNewLI(storedTask);
    list.appendChild(listItem);
  });
}
showData();



// FOR DRAG AND DROP FUNCTION
// todoList.addEventListener("dragstart", (e) => {
//   if (e.target.tagName === "LI") {
//     draggedIndex = [...todoList.children].indexOf(e.target);
//     e.target.classList.add("dragging");
//   }
// });

// todoList.addEventListener("dragend", (e) => {
//   if (e.target.tagName === "LI") {
//     e.target.classList.remove("dragging");
//   }
// });

// todoList.addEventListener("dragover", (e) => {
//   e.preventDefault(); // allow drop
//   const afterElement = getDragAfterElement(todoList, e.clientY);
//   const dragging = document.querySelector(".dragging");
//   if (afterElement == null) {
//     todoList.appendChild(dragging);
//   } else {
//     todoList.insertBefore(dragging, afterElement);
//   }
// });

// function getDragAfterElement(container, y) {
//   const draggableElements = [
//     ...container.querySelectorAll("li:not(.dragging)"),
//   ];

//   return draggableElements.reduce(
//     (closest, child) => {
//       const box = child.getBoundingClientRect();
//       const offset = y - box.top - box.height / 2;
//       if (offset < 0 && offset > closest.offset) {
//         return { offset: offset, element: child };
//       } else {
//         return closest;
//       }
//     },
//     { offset: Number.NEGATIVE_INFINITY }
//   ).element;
// }

// todoList.addEventListener("drop", () => {
//   const newOrder = [...todoList.children].map(
//     (li) => li.querySelector("input").dataset.index
//   );
//   todos = newOrder.map((i) => todos[i]); // reorder based on new index
//   renderTodos(); // if you have a save function
// });
