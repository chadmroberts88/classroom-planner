// ------ Button Selectors ------

const studentDeskButton = document.querySelector('#add-student-desk-button');
const teacherDeskButton = document.querySelector('#add-teacher-desk-button');
const bookshelfButton = document.querySelector('#add-bookshelf-button');
const incWidthButton = document.querySelector('#inc-width-button');
const decWidthButton = document.querySelector('#dec-width-button');
const incLengthButton = document.querySelector('#inc-length-button');
const decLengthButton = document.querySelector('#dec-length-button');
const rotateCcwButton = document.querySelector('#rotate-ccw-button');
const rotateCwButton = document.querySelector('#rotate-cw-button');
const removeItemButton = document.querySelector('#remove-item-button');
const showNamesButton = document.querySelector('#show-names-button');
const hideNamesButton = document.querySelector('#hide-names-button');
const addStudentButton = document.querySelector('#add-student-button');
const closeModalButton = document.querySelector('#close-modal-button');
const saveChangesButton = document.querySelector('#save-changes-button');

// ------ Tab Selectors ------

const objectsTab = document.querySelector('#objects-tab');
const studentsTab = document.querySelector('#students-tab');

// ------ Panel Selectors ------

const objectsPanel = document.querySelector('.objects-panel');
const studentsPanel = document.querySelector('.students-panel');
const studentList = document.querySelector('.student-list');

// ------ Classroom Selector ------

const classroom = document.querySelector('.classroom');

// ------ Modal Selector ------

const addStudentModal = document.querySelector(".add-student-modal");

// ------ Event Listeners ------

studentDeskButton.addEventListener('click', addStudentDesk);
teacherDeskButton.addEventListener('click', addTeacherDesk);
bookshelfButton.addEventListener('click', addBookshelf);
incWidthButton.addEventListener('click', incclassroomWidth);
decWidthButton.addEventListener('click', decclassroomWidth);
incLengthButton.addEventListener('click', incclassroomLength);
decLengthButton.addEventListener('click', decclassroomLength);
rotateCcwButton.addEventListener('click', rotateCcw);
rotateCwButton.addEventListener('click', rotateCw);
removeItemButton.addEventListener('click', removeObject);
showNamesButton.addEventListener('click', showNames);
hideNamesButton.addEventListener('click', hideNames);
addStudentButton.addEventListener('click', addStudent);
closeModalButton.addEventListener('click', closeModal);
objectsTab.addEventListener('click', showObjectsPanel);
studentsTab.addEventListener('click', showStudentsPanel);
saveChangesButton.addEventListener('click', setStudentInfo);
classroom.addEventListener('dblclick', deselectObjects);
classroom.addEventListener("touchstart", dragStart, false);
classroom.addEventListener("touchend", dragEnd, false);
classroom.addEventListener("touchmove", drag, false);
classroom.addEventListener('mousedown', dragStart, false);
classroom.addEventListener("mousemove", drag, false);
classroom.addEventListener("mouseup", dragEnd, false);
classroom.addEventListener('mouseleave', dragEnd, false);

// ------ Global Variables ------

let objectIds = 0;
let objects = [];

let currentObjectId = null;
let currentObject = null;

let studentIds = 0;
let students = [];

let currentStudentId = null;
let currentStudent = null;

let draggableObject;
let dragActive = false;
let initialX;
let initialY;
let currentX;
let currentY;

let currentDisplayNameState = "hidden";

// ------ Classes ------

class Student {
    constructor() {
        this.firstName = 'New';
        this.lastName = 'Student';
        this.birthMonth = '';
        this.birthDay = '';
        this.birthYear = '';
        this.grade = '';
        this.assignedSeat = null;
    }

    setFirstName(value) {
        this.firstName = value;
    }

    getFirstName() {
        return this.firstName;
    }

    setLastName(value) {
        this.lastName = value;
    }

    getLastName() {
        return this.lastName;
    }

    getAssignedSeat() {
        return this.assignedSeat;
    }

    setAssignedSeat(value) {
        this.assignedSeat = value;
    }

}

class Object {
    constructor() {
        this.rotationState = 0;
        this.xPosition = 0;
        this.yPosition = 0;
        this.occupant = null;
    }

    getRotationState() {
        return this.rotationState;
    }

    setRotationState(value) {
        this.rotationState = value;
    }

    getXPosition() {
        return this.xPosition;
    }

    setXPosition(value) {
        this.xPosition = value;
    }

    getYPosition() {
        return this.yPosition;
    }

    setYPosition(value) {
        this.yPosition = value;
    }

    getOccupant() {
        return this.occupant;
    }

    setOccupant(value) {
        this.occupant = value;
    }
}

// ------ Object Panel Functions ------

function createObject() {
    var newDiv = document.createElement('div');
    newDiv.setAttribute('data-object-id', objectIds);
    newDiv.addEventListener('click', selectObject);
    newDiv.addEventListener('mousedown', addDraggable);
    newDiv.style.left = 0;
    newDiv.style.top = 0;
    newDiv.style.transform = "rotate(0deg)";
    classroom.appendChild(newDiv);

    var newObject = new Object();
    newObject.setRotationState(0);
    newObject.setXPosition(0);
    newObject.setYPosition(0);

    objects[objectIds] = newObject;

    return newDiv;
}

function addStudentDesk() {
    var newDesk = createObject();
    newDesk.classList.add('student-desk');

    var deskGraphic = document.createElement('i');
    deskGraphic.classList.add('far', 'fa-user');
    newDesk.appendChild(deskGraphic);

    var displayName = document.createElement('span');
    displayName.innerText = "Vacant";
    displayName.classList.add('display-name');
    displayName.style.visibility = currentDisplayNameState;
    newDesk.appendChild(displayName);

    objectIds++;
}

function addTeacherDesk() {
    createObject().classList.add('teacher-desk');
    objectIds++;
}

function addBookshelf() {
    createObject().classList.add('bookshelf');
    objectIds++;
}

// ------ Classroom Functions ------

function deselectObjects() {
    for (var i = 0; i <= objectIds; i++) {
        var dataAttribute = "[data-object-id='" + i + "']";
        var currentObject = document.querySelector(dataAttribute);
        if (currentObject != null) {
            currentObject.classList.remove('selected');
        }
    }
}

function selectObject(event) {
    deselectObjects();
    event.target.classList.add('selected');
}

function removeDraggable() {
    for (var i = 0; i <= objectIds; i++) {
        var dataAttribute = "[data-object-id='" + i + "']";
        var currentObject = document.querySelector(dataAttribute);
        if (currentObject != null) {
            currentObject.classList.remove('draggable');
        }
    }
}

function addDraggable(event) {
    removeDraggable();
    event.target.classList.add('draggable');
}

function dragStart(event) {

    draggableObject = document.querySelector('.draggable');

    if (event.type === "touchstart") {
        initialX = event.touches[0].clientX - parseInt(draggableObject.style.left);
        initialY = event.touches[0].clientY - parseInt(draggableObject.style.top);
    } else {
        initialX = event.clientX - parseInt(draggableObject.style.left);
        initialY = event.clientY - parseInt(draggableObject.style.top);
    }

    if (event.target === draggableObject) {
        dragActive = true;
    }

}

function drag(event) {
    if (dragActive) {

        draggableObject = document.querySelector('.draggable');

        event.preventDefault();

        if (event.type === "touchmove") {
            currentX = event.touches[0].clientX - initialX;
            currentY = event.touches[0].clientY - initialY;
        } else {
            currentX = event.clientX - initialX;
            currentY = event.clientY - initialY;
        }

        draggableObject.style.left = currentX + "px";
        draggableObject.style.top = currentY + "px";

    }
}

function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    dragActive = false;
}

// ------ Panel Selection Functions ------

function showObjectsPanel() {
    objectsPanel.style.visibility = "visible";
    studentsPanel.style.visibility = "hidden";
}

function showStudentsPanel() {
    objectsPanel.style.visibility = "hidden";
    studentsPanel.style.visibility = "visible";
}

// ------ Add Student Modal Functions ------

function openModal() {
    addStudentModal.style.display = "block";
}

function closeModal() {
    addStudentModal.style.display = "none";
}

// ------ Classroom Panel Functions ------

function decclassroomWidth() {
    var currentWidth = getComputedStyle(classroom).width;

    if (parseInt(currentWidth) > 240) {
        classroom.style.width = parseInt(currentWidth) - 10 + "px";
    } else {
        alert("You've reached the min width.");
    }

}

function incclassroomWidth() {
    var currentWidth = getComputedStyle(classroom).width;

    if (parseInt(currentWidth) < 760) {
        classroom.style.width = parseInt(currentWidth) + 10 + "px";
    } else {
        alert("You've reached the max width.");
    }

}

function decclassroomLength() {
    var currentHeight = getComputedStyle(classroom).height;

    if (parseInt(currentHeight) > 240) {
        classroom.style.height = parseInt(currentHeight) - 10 + "px";
    } else {
        alert("You've reached the min length.");
    }
}

function incclassroomLength() {
    var currentHeight = getComputedStyle(classroom).height;

    if (parseInt(currentHeight) < 760) {
        classroom.style.height = parseInt(currentHeight) + 10 + "px";
    } else {
        alert("You've reached the max length.");
    }
}

function showNames() {

    var displayNames = document.querySelectorAll('.display-name');

    displayNames.forEach((item) => {
        item.style.visibility = "visible";
    });

    currentDisplayNameState = "visible";

}

function hideNames() {

    var displayNames = document.querySelectorAll('.display-name');

    displayNames.forEach((item) => {
        item.style.visibility = "hidden";
    });

    currentDisplayNameState = "hidden";


}

function rotateCcw() {

    var selectedObject = document.querySelector('.selected');

    if (selectedObject != null) {
        currentObjectId = selectedObject.getAttribute('data-object-id');
        currentObject = objects[currentObjectId];

        var currentRotationState = currentObject.getRotationState();
        var newRotationState = parseInt(currentRotationState) - 15;

        selectedObject.style.transform = "rotate(" + newRotationState + "deg)";
        currentObject.setRotationState(newRotationState);
    }

}

function rotateCw() {

    var selectedObject = document.querySelector('.selected');

    if (selectedObject != null) {
        currentObjectId = selectedObject.getAttribute('data-object-id');
        currentObject = objects[currentObjectId];

        var currentRotationState = currentObject.getRotationState();
        var newRotationState = parseInt(currentRotationState) + 15;

        selectedObject.style.transform = "rotate(" + newRotationState + "deg)";
        currentObject.setRotationState(newRotationState);
    }

}

function removeObject() {
    var selectedObject = document.querySelector(".selected");

    if (selectedObject != null) {
        if (selectedObject.classList.contains('occupied')) {
            alert("Please unassign this seat before removing it.");
        } else {
            selectedObject.remove();
        }
    } else {
        alert("Please select a seat to remove.")
    }

}

// ------ Students Panel Functions ------

function addStudent() {
    var newDiv = document.createElement('div');
    newDiv.classList.add('student');
    newDiv.setAttribute('data-student-id', studentIds);
    studentList.appendChild(newDiv);

    var newInfoButton = document.createElement('i');
    newInfoButton.classList.add('student-info-button', 'fas', 'fa-info-circle');
    newDiv.appendChild(newInfoButton);

    var newPara = document.createElement('p');
    newPara.textContent = "New Student";
    newDiv.appendChild(newPara);

    var newAssignButton = document.createElement('i');
    newAssignButton.classList.add('assign-seat-button', 'fas', 'fa-chair');
    newDiv.appendChild(newAssignButton);

    var removeStudentButton = document.createElement('i');
    removeStudentButton.classList.add('remove-student-button', 'fas', 'fa-trash-alt')
    newDiv.appendChild(removeStudentButton);

    newInfoButton.addEventListener('click', loadStudentInfo);
    newAssignButton.addEventListener('click', assignSeat);
    removeStudentButton.addEventListener('click', removeStudent);

    students[studentIds] = new Student();

    studentIds++;

}

function loadStudentInfo(event) {

    currentStudentId = event.target.parentNode.getAttribute('data-student-id');
    currentStudent = students[currentStudentId];

    var currentFirstName = currentStudent.getFirstName();
    var currentLastName = currentStudent.getLastName();

    document.querySelector('#first-name').value = currentFirstName;
    document.querySelector('#last-name').value = currentLastName;

    openModal();
}

function setStudentInfo() {

    var newFirstName = document.querySelector('#first-name').value;
    var newLastName = document.querySelector('#last-name').value;

    currentStudent.setFirstName(newFirstName);
    currentStudent.setLastName(newLastName);

    var dataStudentId = "[data-student-id='" + currentStudentId + "']";
    var currentStudentDiv = document.querySelector(dataStudentId);

    currentStudentDiv.childNodes[1].innerText = newFirstName + " " + newLastName;

    if (currentStudent.getAssignedSeat() != null) {

        var dataObjectId = "[data-object-id='" + currentStudent.getAssignedSeat() + "']";
        var seatToUpdate = document.querySelector(dataObjectId);

        console.log(dataObjectId);

        seatToUpdate.childNodes[1].innerText = currentStudent.getFirstName() + " " + currentStudent.getLastName();

    }

    closeModal();
}

function assignSeat(event) {

    var selectedObject = document.querySelector(".selected");
    var studentDiv = event.target.parentNode;

    currentStudentId = studentDiv.getAttribute('data-student-id');
    currentStudent = students[currentStudentId];

    if (selectedObject != null && selectedObject.classList.contains('student-desk')) { // if an object is selected

        if (studentDiv.classList.contains('assigned')) { // if student is already assigned to a seat, unassign student

            let confirmUnassign = confirm("This student will be unassigned from its seat.");

            if (confirmUnassign) {

                unassignSeat(event);

            }

        } else { // if student is not already assigned to a seat, assign student

            if (selectedObject.classList.contains('occupied')) {

                alert("The selected seat is already occupied.");

            } else {

                // set student id for seat
                currentObjectId = selectedObject.getAttribute('data-object-id');
                currentObject = objects[currentObjectId];
                currentObject.setOccupant(currentStudentId);

                // set seat id for student
                currentStudent.setAssignedSeat(currentObjectId);

                // update seat's display name with student name
                selectedObject.childNodes[1].innerText = currentStudent.getFirstName() + " " + currentStudent.getLastName();
                selectedObject.childNodes[0].classList.remove('far');
                selectedObject.childNodes[0].classList.add('fas');

                // highlight student div
                studentDiv.classList.add('assigned');

                // mark seat as occupied
                selectedObject.classList.add('occupied');

                // alert that action is complete
                alert(currentStudent.getFirstName() + " " + currentStudent.getLastName() + " was assigned to the selected seat.");

            }
        }

    } else { // if an object is not selected

        alert("Please select a student desk to assign.");

    }

}

function unassignSeat(event) {

    var studentDiv = event.target.parentNode;

    currentStudentId = studentDiv.getAttribute('data-student-id');
    currentStudent = students[currentStudentId];

    // get object id and array object for assigned seat
    currentObjectId = currentStudent.getAssignedSeat();
    currentObject = objects[currentObjectId];

    if (currentObjectId != null) {

        // query the assigned seat and mark as vacant
        var dataObjectId = "[data-object-id='" + currentObjectId + "']";
        var assignedObject = document.querySelector(dataObjectId);
        assignedObject.childNodes[0].classList.remove('fas');
        assignedObject.childNodes[0].classList.add('far');
        assignedObject.childNodes[1].innerText = "Vacant";
        assignedObject.classList.remove('occupied')

        // set the assigned seat and assigned student to null
        currentStudent.setAssignedSeat(null);
        currentObject.setOccupant(null);

    }

    // remove highlight from student div
    studentDiv.classList.remove('assigned');
}

function removeStudent(event) {

    let confirmRemove = confirm("WARNING: This student will be removed. This action cannot be undone.");

    if (confirmRemove) {
        unassignSeat(event);
        event.target.parentNode.remove();
    }
}

