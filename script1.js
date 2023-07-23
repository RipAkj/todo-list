let itemArray = [];
let activityLogArray=[];

const title1 = document.getElementById("title");
const desc1 = document.getElementById("description");
const dueDate1 = document.getElementById("dueDate");
const priority1 = document.getElementById("priority")
const category1 = document.getElementById("category")
const tags1 = document.getElementById("tags")

function clearStorage(){
    itemArray=[];
    Update();
    getActivityLog({
        time: new Date().toLocaleString(),
        text: `Whole List was cleared.`,
    });
}

function getAndUpdate(){
    const title = title1.value;
    const desc = desc1.value;
    const dueDate = dueDate1.value;
    const priority = priority1.value;
    const category = category1.value;
    const tags = tags1.value.split(",");
    //console.log(priority)
    if (title !== "") {
        const eachItem = {
            title: title,
            desc: desc,
            category: category,
            priority: priority,
            dueDate: dueDate,
            tags: tags,
            done: false
        };
        itemArray.push(eachItem);
        Update();
        title1.value = "";
        desc1.value = "";
        category1.value = "";
        priority1.value = "";
        dueDate1.value = "";
        tags1.value = "";
    }
    getActivityLog({
        time: new Date().toLocaleString(),
        text: `Todo: ${title} was added.`,
    });
}

function editItem(index){
    const newtitle = prompt("Edit Todo:", itemArray[index].title);
    if (newtitle != "") {
        itemArray[index].title = newtitle;
        Update();
    }
}

function deleteItem(index){
    getActivityLog({
        time: new Date().toLocaleString(),
        text: `Todo no ${index+1}: ${itemArray[index].title} was deleted.`,
    });
    itemArray.splice(index, 1);
    Update();
}


function markCompletedIncompleted(index){
    itemArray[index].done = !itemArray[index].done;
    getActivityLog({
        time: new Date().toLocaleString(),
        text: `Todo no ${index+1}: ${itemArray[index].title} was marked ${itemArray[index].done ? "completed" : "incompleted"}.`,
    });
    localStorage.setItem("itemArray", JSON.stringify(itemArray));
    Update();
}

function filterUsingPriority(){
    const priorityValue = document.getElementById("priorityFilter").value;
    //console.log(priorityValue)
    if (priorityValue != "none") {
        const filterItemArray = itemArray.filter((eachItem) => {
           return (eachItem.priority == priorityValue);
        });
        ///console.log(filterItemArray)
        Update(filterItemArray);
    } 
    else {
        Update();
    }
}

function filterUsingCategory(){
    const categoryValue = document.getElementById("categoryFilter").value;
    if (categoryValue) {
        const filterItemArray = itemArray.filter((eachItem) => {
            return (eachItem.category == categoryValue);
        });
        Update(filterItemArray);
    } 
    else {
        Update();
    }
}

function filterUsingDateRange(){
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    if (startDate && endDate) {
        const startDateActual = new Date(startDate);
        const endDateActual = new Date(endDate);
        const filterItemArray = itemArray.filter((eachItem) => {
            const itemDate = new Date(eachItem.dueDate);
            return (itemDate >= startDateActual && itemDate <= endDateActual);
        });
        Update(filterItemArray);
    } 
    else {
        Update();
    }
}

function sortUsingPriority(){
    const sortItemArray = itemArray.sort((a,b) => {
        if(a.priority && b.priority){
            const priorityOrder = ["high","medium","low"];
            return (priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority));
        } 
        else if(a.priority){
            return -1;
        } 
        else if(b.priority){
            return 1;
        }
        return 0;
    });
    Update(sortItemArray);
}

function sortUsingDueDate(){
    const sortItemArray = itemArray.sort((a,b) => {
        if(a.dueDate && b.dueDate){
            return new Date(a.dueDate) - new Date(b.dueDate);
        } 
        else if(a.dueDate){
            return -1;
        } 
        else if(b.dueDate){
            return 1;
        }
        return 0;
    });
    Update(sortItemArray);
}

function viewMissing(){
    const todayDate = new Date();
    const missedItemArray = itemArray.filter((eachItem) => {
        if(eachItem.dueDate){
            const dueDateValue = new Date(eachItem.dueDate);
            return (!eachItem.done && dueDateValue < todayDate);
        }
        return false;
    });
    if(missedItemArray.length===0){
        alert("There are no missed todos whose due date is today.");
    } 
    else{
        Update(missedItemArray);
    }
}

function viewPending(){
    const pendingItemArray = itemArray.filter((eachItem) => {
        if(!eachItem.done){
            return (!eachItem.done);
        }
        return false;
    });
    if(pendingItemArray.length===0){
        alert("There are no todos which are incomplete");
    } 
    else{
        Update(pendingItemArray);
    }
}

function viewAllItems(){
    getItems();
}

function searchTodo(){
    const searchQuery = searchInput.value.toLowerCase();
    if (searchQuery === "") {
        alert("Please enter text first.");
        return;
    }
    const searchItemArray = itemArray.filter((eachItem) => {
        const titleLower = eachItem.title.toLowerCase();
        const descLower = eachItem.desc.toLowerCase();
        const hasQueryInTag = eachItem.tags && eachItem.tags.some((tag) => 
            tag.toLowerCase().includes(searchQuery)
        );
        const hasQueryInDesc = descLower.includes(searchQuery);
        const hasQueryInTitle = titleLower.includes(searchQuery);
        return hasQueryInTitle || hasQueryInDesc || hasQueryInTag;
    });
    if (searchItemArray.length === 0) {
        alert("No matching tasks found.");
    } else {
        Update(searchItemArray);
    }
}

function Update(filterItemArray = itemArray) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";
    filterItemArray.forEach((eachItem, index) => {
        const eachRowElement = document.createElement("li");
        eachRowElement.className = "individualItem";
        const indexElement=document.createElement("span");
        indexElement.textContent=index+1;
        indexElement.className="todoSno";
        const titleElement = document.createElement("span");
        titleElement.textContent = eachItem.title;
        titleElement.className="todoTitle";
        const descElement = document.createElement("span");
        descElement.textContent = eachItem.desc;
        descElement.className="todoDesc";
        const dueDateElement = document.createElement("span");
        dueDateElement.textContent = eachItem.dueDate;
        dueDateElement.className="todoDueDate";
        const priorityElement = document.createElement("span");
        priorityElement.textContent = eachItem.priority;
        priorityElement.className="todoPriority";
        const categoryElement = document.createElement("span");
        categoryElement.textContent = eachItem.category;
        categoryElement.className="todoCategory";
        const tagsElement = document.createElement("div");
        tagsElement.className="todoTags";
        console.log(eachItem.tags)
        eachItem.tags.forEach((tag)=>{
            const it=document.createElement("span");
            it.textContent=tag;
            it.className="it";
            tagsElement.appendChild(it);
        })
        
        if (eachItem.done){
            titleElement.classList.add("done");
            descElement.classList.add("done");
            categoryElement.classList.add("done");
            priorityElement.classList.add("done");
            dueDateElement.classList.add("done");
            tagsElement.classList.add("done");
        }
        const actionElement = document.createElement("div");
        actionElement.className = "todoActions";
        const markElement = document.createElement("button");
        markElement.textContent = eachItem.done?"Undone":"Done";
        markElement.className = "mark";
        markElement.addEventListener("click", () => markCompletedIncompleted(index));
        const editElement = document.createElement("button");
        editElement.textContent = "Edit";
        editElement.className = "edit";
        editElement.addEventListener("click", () => editItem(index));
        const deleteElement = document.createElement("button");
        deleteElement.textContent = "Delete";
        deleteElement.className = "delete";
        deleteElement.addEventListener("click", () => deleteItem(index));
        actionElement.appendChild(markElement);
        actionElement.appendChild(editElement);
        actionElement.appendChild(deleteElement);
        eachRowElement.appendChild(indexElement);
        eachRowElement.appendChild(titleElement);
        eachRowElement.appendChild(descElement);
        eachRowElement.appendChild(categoryElement);
        eachRowElement.appendChild(priorityElement);
        eachRowElement.appendChild(dueDateElement);
        eachRowElement.appendChild(tagsElement);
        eachRowElement.appendChild(actionElement);
        tableBody.appendChild(eachRowElement);
    });
}

function getActivityLog(eachLog) {
    activityLogArray.push(eachLog);
    updateActivity();
}

function updateActivity() {
    const activityLogElement = document.getElementById("eachLog");
    activityLogElement.innerHTML = "";
    activityLogArray.forEach((eachEntry) => {
        const eachLogElement = document.createElement("div");
        eachLogElement.textContent = `${eachEntry.time} - ${eachEntry.text}`;
        eachLogElement.className = "eachActivity";
        activityLogElement.appendChild(eachLogElement);
    });
}

function getItems() {
    const itemJsonArray = localStorage.getItem("itemArray");
    if (itemJsonArray) {
        itemArray = JSON.parse(itemJsonArray);
        Update();
    }
}

/*
if (alreadyFetchedFromApi === 0) {
  alreadyFetchedFromApi=1;
  itemJsonArray = [];
  fetch('https://jsonplaceholder.typicode.com/todos') 
	.then((response) => { 
		if (!response.ok){
			throw new Error('Network response was not OK'); 
		} 
		return response.json(); 
	}) 
	.then((data) => { 
		// Process the received data 
    console.log(data.title);
		[...data].forEach(ele=>{
			itemJsonArray.push([ele.title,'From API']);
      localStorage.setItem('itemsJson', JSON.stringify(itemJsonArray))
		});
      
		Update();
	}) 
	.catch(error => { 
		// Handle any errors that occurred during the fetch request 
		console.log('Error:', error.message); 
	})
}
*/

window.addEventListener("beforeunload", () => {
    localStorage.setItem("itemArray", JSON.stringify(itemArray));
});

getItems();

