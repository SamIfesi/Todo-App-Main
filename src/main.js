import "./style.css";
import "./prompt.css";
import "./install.js";
import iconCross from "/assets/images/icon-cross.svg";
import iconCheck from "/assets/images/icon-check.svg";

const form = document.querySelector("form");
const list = document.querySelector("ul");
const input = document.querySelector("input");
const select = document.querySelectorAll(".select");
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

// for the ITEMS LEFT
function updateItemsLeft(tasks) {
  const incompleteTasks = tasks.filter((task) => !task.completed);
  itemsLeft.textContent = incompleteTasks.length;
}
updateItemsLeft(JSON.parse(localStorage.getItem("key")) || []);

// CREATE NEW LIST ITEM
function createNewLI(task) {
  const li = document.createElement("li");
  li.classList.add("item");
  if (task.completed) {
    li.classList.add("checked");
  }
  li.setAttribute("key-id", task.id);
  li.setAttribute("draggable", "true"); //FOR DRAG AND DROP
  li.innerHTML = `<span class="marker">
              <img src="${iconCheck}" alt="checker" />
            </span>
            <span>${task.text}</span>
            <img src="${iconCross}" alt="close icon" class="close">`;

  // REMOVE ITEM FOR DOM AND LOCAL STORAGE
  const remove = li.querySelector(".close");
  remove.addEventListener("click", (e) => {
    e.stopPropagation();
    const id = li.getAttribute("key-id");
    if (li) {
      li.remove();

      // REMOVE FROM LOCALSTORAGE
      let tasks = JSON.parse(localStorage.getItem("key")) || [];
      tasks = tasks.filter((task) => task.id !== id);
      updateItemsLeft(tasks || []);
      localStorage.setItem("key", JSON.stringify(tasks));
    }
  });

  // TOGGLE CHECKED STATE AND TO SAVE TO LOCALSTORAGE
  li.addEventListener("click", (e) => {
    const item = e.target.classList.contains("item");

    if (item) {
      li.classList.toggle("checked");
      const id = li.getAttribute("key-id");
      let tasks = JSON.parse(localStorage.getItem("key")) || [];
      tasks = tasks.map((task) =>
        task.id === id
          ? { ...task, completed: li.classList.contains("checked") }
          : task
      );
      updateItemsLeft(tasks || []);
      localStorage.setItem("key", JSON.stringify(tasks));
    }
  });

  // DRAG AND DROP FUNCTIONALITY
  li.addEventListener("dragstart", (e) => {
    li.classList.add("dragging");
  });

  li.addEventListener("dragend", (e) => {
    li.classList.remove("dragging");
  });
  return li;
}

list.addEventListener("dragover", (e) => {
  e.preventDefault();
  const draggingItem = list.querySelector(".dragging");
  const afterElement = getDragAfterElement(list, e.clientY);

  if (draggingItem) {
    if (afterElement == null) {
      list.appendChild(draggingItem, list.lastElementChild);
    } else {
      list.insertBefore(draggingItem, afterElement);
    }
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".item:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

list.addEventListener("drop", (e) => {
  e.preventDefault();
  const newOrder = [...list.querySelectorAll("li.item")];
  let newOrderIds = newOrder.map((item) => item.getAttribute("key-id"));

  newOrderIds.reverse(); // Reverse to match the prepend order

  let tasks = JSON.parse(localStorage.getItem("key")) || [];
  tasks.sort((a, b) => {
    return newOrderIds.indexOf(a.id) - newOrderIds.indexOf(b.id);
  });
  localStorage.setItem("key", JSON.stringify(tasks));
});

// FORM SUBMIT EVENT
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let tasks = JSON.parse(localStorage.getItem("key")) || [];
  const inputValue = input.value.trim();

  if (inputValue !== "") {
    const newTask = {
      text: inputValue,
      id: Date.now().toString(),
      completed: false,
    };

    const listItem = createNewLI(newTask);
    list.appendChild(listItem);
    saveData(newTask);
    updateItemsLeft(tasks.concat(newTask) || []);
    input.value = "";
  }
});

// SAVE TO LOCALSTORAGE
function saveData(task) {
  let tasks = JSON.parse(localStorage.getItem("key")) || [];
  tasks.push(task);
  localStorage.setItem("key", JSON.stringify(tasks));
}

// SHOW DATA FROM LOCALSTORAGE
function showData() {
  const storedTasks = JSON.parse(localStorage.getItem("key")) || [];
  storedTasks.forEach((storedTask) => {
    const listItem = createNewLI(storedTask);
    list.appendChild(listItem);
  });
}
showData();

// FUNCTION FOR THE SELECTED FILTER
function selection() {
  select.forEach((btn) => {
    btn.addEventListener("click", () => {
      select.forEach((button) => button.classList.remove("selected"));
      btn.classList.add("selected");

      const filter = btn.id;
      const storedTasks = JSON.parse(localStorage.getItem("key")) || [];
      list.classList.add("fade-out");

      setTimeout(() => {
        const currentTaskItems = list.querySelectorAll("li.item");
        currentTaskItems.forEach((item) => item.remove());
        let filteredTasks = [];
        if (filter === "all") {
          filteredTasks = storedTasks;
        } else if (filter === "active") {
          filteredTasks = storedTasks.filter((task) => !task.completed);
        } else if (filter === "completed") {
          filteredTasks = storedTasks.filter((task) => task.completed);
        }

        filteredTasks.forEach((task) => {
          const listItem = createNewLI(task);
          list.appendChild(listItem);
        });
        list.classList.remove("fade-out");
        list.classList.add("fade-in");

        setTimeout(() => {
          list.classList.remove("fade-in");
        }, 300);
      }, 300);
    });
  });
}
selection();

// CLEAR COMPLETED FUNCTION
const clearBtn = document.getElementById("clear");
clearBtn.addEventListener("click", () => {
  let tasks = JSON.parse(localStorage.getItem("key")) || [];
  tasks = tasks.filter((task) => !task.completed);
  localStorage.setItem("key", JSON.stringify(tasks));
  const completedItems = list.querySelectorAll("li.item.checked");
  completedItems.forEach((item) => item.remove());
  updateItemsLeft(tasks);
});