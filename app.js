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

// ------ State Object ------

const state = {
    objectIds: 0,
    objects: [],
    currentObjectId: null,
    currentObject: null,
    studentIds: 0,
    students: [],
    currentStudentId: null,
    currentStudent: null,
    draggableObject: null,
    dragActive: false,
    initialX: null,
    initialY: null,
    currentX: null,
    currentY: null,
    currentDisplayNameState: "hidden"
};

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
    let newDiv = document.createElement('div');
    newDiv.setAttribute('data-object-id', state.objectIds);
    newDiv.addEventListener('click', selectObject);
    newDiv.addEventListener('mousedown', addDraggable);
    newDiv.style.left = 0;
    newDiv.style.top = 0;
    newDiv.style.transform = "rotate(0deg)";
    classroom.appendChild(newDiv);

    let newObject = new Object();
    newObject.setRotationState(0);
    newObject.setXPosition(0);
    newObject.setYPosition(0);

    state.objects[state.objectIds] = newObject;

    return newDiv;
}

function addStudentDesk() {
    let newDesk = createObject();
    newDesk.classList.add('student-desk');

    let newDeskGraphic = document.createElement('i');
    newDeskGraphic.classList.add('far', 'fa-user');
    newDesk.appendChild(newDeskGraphic);

    let newDisplayName = document.createElement('span');
    newDisplayName.innerText = "Vacant";
    newDisplayName.classList.add('display-name');
    newDisplayName.style.visibility = state.displayNameStatus;
    newDesk.appendChild(newDisplayName);

    state.objectIds++;
}

function addTeacherDesk() {
    createObject().classList.add('teacher-desk');
    state.objectIds++;
}

function addBookshelf() {
    createObject().classList.add('bookshelf');
    state.objectIds++;
}

// ------ Classroom Functions ------

function deselectObjects() {
    for (let i = 0; i <= state.objectIds; i++) {
        let dataAttribute = "[data-object-id='" + i + "']";
        state.currentObject = document.querySelector(dataAttribute);
        if (state.currentObject != null) {
            state.currentObject.classList.remove('selected');
        }
    }
}

function selectObject(event) {
    deselectObjects();
    event.target.classList.add('selected');
}

function removeDraggable() {
    for (let i = 0; i <= state.objectIds; i++) {
        let dataAttribute = "[data-object-id='" + i + "']";
        state.currentObject = document.querySelector(dataAttribute);
        if (state.currentObject != null) {
            state.currentObject.classList.remove('draggable');
        }
    }
}

function addDraggable(event) {
    removeDraggable();
    event.target.classList.add('draggable');
}

function dragStart(event) {

    state.draggableObject = document.querySelector('.draggable');

    if (event.type === "touchstart") {
        state.initialX = event.touches[0].clientX - parseInt(state.draggableObject.style.left);
        state.initialY = event.touches[0].clientY - parseInt(state.draggableObject.style.top);
    } else {
        state.initialX = event.clientX - parseInt(state.draggableObject.style.left);
        state.initialY = event.clientY - parseInt(state.draggableObject.style.top);
    }

    if (event.target === state.draggableObject) {
        state.dragActive = true;
    }

}

function drag(event) {
    if (state.dragActive) {

        state.draggableObject = document.querySelector('.draggable');

        event.preventDefault();

        if (event.type === "touchmove") {
            state.currentX = event.touches[0].clientX - state.initialX;
            state.currentY = event.touches[0].clientY - state.initialY;
        } else {
            state.currentX = event.clientX - state.initialX;
            state.currentY = event.clientY - state.initialY;
        }

        state.draggableObject.style.left = state.currentX + "px";
        state.draggableObject.style.top = state.currentY + "px";

    }
}

function dragEnd() {
    state.initialX = state.currentX;
    state.initialY = state.currentY;
    state.dragActive = false;
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
    let currentWidth = getComputedStyle(classroom).width;

    if (parseInt(currentWidth) > 240) {
        classroom.style.width = parseInt(currentWidth) - 10 + "px";
    } else {
        alert("You've reached the min width.");
    }

}

function incclassroomWidth() {
    let currentWidth = getComputedStyle(classroom).width;

    if (parseInt(currentWidth) < 760) {
        classroom.style.width = parseInt(currentWidth) + 10 + "px";
    } else {
        alert("You've reached the max width.");
    }

}

function decclassroomLength() {
    let currentHeight = getComputedStyle(classroom).height;

    if (parseInt(currentHeight) > 240) {
        classroom.style.height = parseInt(currentHeight) - 10 + "px";
    } else {
        alert("You've reached the min length.");
    }
}

function incclassroomLength() {
    let currentHeight = getComputedStyle(classroom).height;

    if (parseInt(currentHeight) < 760) {
        classroom.style.height = parseInt(currentHeight) + 10 + "px";
    } else {
        alert("You've reached the max length.");
    }
}

function showNames() {

    let displayNames = document.querySelectorAll('.display-name');

    displayNames.forEach((item) => {
        item.style.visibility = "visible";
    });

    state.displayNameStatus = "visible";

}

function hideNames() {

    let displayNames = document.querySelectorAll('.display-name');

    displayNames.forEach((item) => {
        item.style.visibility = "hidden";
    });

    state.displayNameStatus = "hidden";


}

function rotateCcw() {

    let selectedObject = document.querySelector('.selected');

    if (selectedObject != null) {
        state.currentObjectId = selectedObject.getAttribute('data-object-id');
        state.currentObject = state.objects[state.currentObjectId];

        let currentRotationState = state.currentObject.getRotationState();
        let newRotationState = parseInt(currentRotationState) - 15;

        selectedObject.style.transform = "rotate(" + newRotationState + "deg)";
        state.currentObject.setRotationState(newRotationState);
    }

}

function rotateCw() {

    let selectedObject = document.querySelector('.selected');

    if (selectedObject != null) {
        state.currentObjectId = selectedObject.getAttribute('data-object-id');
        state.currentObject = state.objects[state.currentObjectId];

        let currentRotationState = state.currentObject.getRotationState();
        let newRotationState = parseInt(currentRotationState) + 15;

        selectedObject.style.transform = "rotate(" + newRotationState + "deg)";
        state.currentObject.setRotationState(newRotationState);
    }

}

function removeObject() {
    let selectedObject = document.querySelector(".selected");

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
    let newDiv = document.createElement('div');
    newDiv.classList.add('student');
    newDiv.setAttribute('data-student-id', state.studentIds);
    studentList.appendChild(newDiv);

    let newInfoButton = document.createElement('i');
    newInfoButton.classList.add('student-info-button', 'fas', 'fa-info-circle');
    newDiv.appendChild(newInfoButton);

    let newPara = document.createElement('p');
    newPara.textContent = "New Student";
    newDiv.appendChild(newPara);

    let newAssignButton = document.createElement('i');
    newAssignButton.classList.add('assign-seat-button', 'fas', 'fa-chair');
    newDiv.appendChild(newAssignButton);

    let removeStudentButton = document.createElement('i');
    removeStudentButton.classList.add('remove-student-button', 'fas', 'fa-trash-alt')
    newDiv.appendChild(removeStudentButton);

    newInfoButton.addEventListener('click', loadStudentInfo);
    newAssignButton.addEventListener('click', assignSeat);
    removeStudentButton.addEventListener('click', removeStudent);

    state.students[state.studentIds] = new Student();

    state.studentIds++;

}

function loadStudentInfo(event) {

    state.currentStudentId = event.target.parentNode.getAttribute('data-student-id');
    state.currentStudent = state.students[state.currentStudentId];

    let currentFirstName = state.currentStudent.getFirstName();
    let currentLastName = state.currentStudent.getLastName();

    document.querySelector('#first-name').value = currentFirstName;
    document.querySelector('#last-name').value = currentLastName;

    openModal();
}

function setStudentInfo() {

    let newFirstName = document.querySelector('#first-name').value;
    let newLastName = document.querySelector('#last-name').value;

    state.currentStudent.setFirstName(newFirstName);
    state.currentStudent.setLastName(newLastName);

    let dataStudentId = "[data-student-id='" + state.currentStudentId + "']";
    let currentStudentDiv = document.querySelector(dataStudentId);

    currentStudentDiv.childNodes[1].innerText = newFirstName + " " + newLastName;

    if (state.currentStudent.getAssignedSeat() != null) {

        let dataObjectId = "[data-object-id='" + state.currentStudent.getAssignedSeat() + "']";
        let seatToUpdate = document.querySelector(dataObjectId);

        console.log(dataObjectId);

        seatToUpdate.childNodes[1].innerText = state.currentStudent.getFirstName() + " " + state.currentStudent.getLastName();

    }

    closeModal();
}

function assignSeat(event) {

    let selectedObject = document.querySelector(".selected");
    let studentDiv = event.target.parentNode;

    state.currentStudentId = studentDiv.getAttribute('data-student-id');
    state.currentStudent = state.students[state.currentStudentId];

    if (selectedObject != null && selectedObject.classList.contains('student-desk')) { // if an object is selected

        if (studentDiv.classList.contains('assigned')) { // if student is already assigned to a desk, unassign student

            let confirmUnassign = confirm("This student will be unassigned from its desk.");

            if (confirmUnassign) {

                unassignSeat(event);

            }

        } else { // if student is not already assigned to a desk, assign student

            if (selectedObject.classList.contains('occupied')) {

                alert("The selected desk is already occupied.");

            } else {

                // set student id for seat
                state.currentObjectId = selectedObject.getAttribute('data-object-id');
                state.currentObject = state.objects[state.currentObjectId];
                state.currentObject.setOccupant(state.currentStudentId);

                // set seat id for student
                state.currentStudent.setAssignedSeat(state.currentObjectId);

                // update seat's display name with student name
                selectedObject.childNodes[1].innerText = state.currentStudent.getFirstName() + " " + state.currentStudent.getLastName();
                selectedObject.childNodes[0].classList.remove('far');
                selectedObject.childNodes[0].classList.add('fas');

                // highlight student div
                studentDiv.classList.add('assigned');

                // mark seat as occupied
                selectedObject.classList.add('occupied');

                // alert that action is complete
                alert(state.currentStudent.getFirstName() + " " + state.currentStudent.getLastName() + " was assigned to the selected desk.");

            }
        }

    } else { // if an object is not selected

        alert("Please select a student desk to assign.");

    }

}

function unassignSeat(event) {

    let studentDiv = event.target.parentNode;

    state.currentStudentId = studentDiv.getAttribute('data-student-id');
    state.currentStudent = state.students[state.currentStudentId];

    // get object id and array object for assigned desk
    state.currentObjectId = state.currentStudent.getAssignedSeat();
    state.currentObject = state.objects[state.currentObjectId];

    if (state.currentObjectId != null) {

        // query the assigned desk and mark as vacant
        let dataObjectId = "[data-object-id='" + state.currentObjectId + "']";
        let assignedObject = document.querySelector(dataObjectId);
        assignedObject.childNodes[0].classList.remove('fas');
        assignedObject.childNodes[0].classList.add('far');
        assignedObject.childNodes[1].innerText = "Vacant";
        assignedObject.classList.remove('occupied')

        // set the assigned desk and assigned student to null
        state.currentStudent.setAssignedSeat(null);
        state.currentObject.setOccupant(null);

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

