import "./style.css";
const form = document.querySelector("form");
const list = document.querySelector("ul");
const input = document.querySelector("input");

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
    const id = item.getAttribute("key-id")
    if (item) {
      item.remove(item);

      // REMOVE FROM LOCALSTORAGE
      let tasks = JSON.parse(localStorage.getItem("key")) || [];
      tasks = tasks.filter((task) => task.id !== item.getAttribute("key-id"));
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
