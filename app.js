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
const removeObjectButton = document.querySelector('#remove-object-button');
const showNamesButton = document.querySelector('#show-names-button');
const hideNamesButton = document.querySelector('#hide-names-button');
const addStudentButton = document.querySelector('#add-student-button');
const sortAzButton = document.querySelector('#sort-az-button');
const closeModalButton = document.querySelector('#close-modal-button');
const saveChangesButton = document.querySelector('#save-changes-button');
const printClassroomButton = document.querySelector('#print-classroom-button');
const printStudentsButton = document.querySelector('#print-students-button');

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
removeObjectButton.addEventListener('click', removeObject);
showNamesButton.addEventListener('click', showNames);
hideNamesButton.addEventListener('click', hideNames);
addStudentButton.addEventListener('click', addStudent);
sortAzButton.addEventListener('click', sortAz);
closeModalButton.addEventListener('click', closeModal);
objectsTab.addEventListener('click', showObjectsPanel);
studentsTab.addEventListener('click', showStudentsPanel);
saveChangesButton.addEventListener('click', setStudentInfo);
printClassroomButton.addEventListener('click', printClassroom);
printStudentsButton.addEventListener('click', printStudents);
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
    initialPos: { x: null, y: null },
    currentPos: { x: null, y: null },
    currentDisplayNameState: "hidden"
};

// ------ Classes ------

class Student {
    constructor() {
        this.id = null;
        this.firstName = 'New';
        this.lastName = 'Student';
        this.assignedDesk = null;
    }

    setId(value) {
        this.id = value;
    }

    getId() {
        return this.id;
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

    getAssignedDesk() {
        return this.assignedDesk;
    }

    setAssignedDesk(value) {
        this.assignedDesk = value;
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
    const newDiv = document.createElement('div');
    newDiv.setAttribute('data-object-id', state.objectIds);
    newDiv.addEventListener('click', selectObject);
    newDiv.addEventListener('mousedown', addDraggable);
    newDiv.style.left = 0;
    newDiv.style.top = 0;
    newDiv.style.transform = "rotate(0deg)";
    classroom.appendChild(newDiv);

    const newObject = new Object();
    newObject.setRotationState(0);
    newObject.setXPosition(0);
    newObject.setYPosition(0);

    state.objects[state.objectIds] = newObject;

    return newDiv;
}

function addStudentDesk() {
    const newDesk = createObject();
    newDesk.classList.add('student-desk');

    const newDeskGraphic = document.createElement('i');
    newDeskGraphic.classList.add('far', 'fa-user');
    newDesk.appendChild(newDeskGraphic);

    const newDisplayName = document.createElement('span');
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
        const dataAttribute = "[data-object-id='" + i + "']";
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
        const dataAttribute = "[data-object-id='" + i + "']";
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

    if (state.draggableObject) {

        if (event.type === "touchstart") {
            state.initialPos.x = event.touches[0].clientX - parseInt(state.draggableObject.style.left);
            state.initialPos.y = event.touches[0].clientY - parseInt(state.draggableObject.style.top);
        } else {
            state.initialPos.x = event.clientX - parseInt(state.draggableObject.style.left);
            state.initialPos.y = event.clientY - parseInt(state.draggableObject.style.top);
        }

        if (event.target === state.draggableObject) {
            state.dragActive = true;
        }

    }

}

function drag(event) {
    if (state.dragActive) {

        state.draggableObject = document.querySelector('.draggable');

        event.preventDefault();

        if (event.type === "touchmove") {
            state.currentPos.x = event.touches[0].clientX - state.initialPos.x;
            state.currentPos.y = event.touches[0].clientY - state.initialPos.y;
        } else {
            state.currentPos.x = event.clientX - state.initialPos.x;
            state.currentPos.y = event.clientY - state.initialPos.y;
        }

        state.draggableObject.style.left = state.currentPos.x + "px";
        state.draggableObject.style.top = state.currentPos.y + "px";

    }
}

function dragEnd() {
    state.initialPos.x = state.currentPos.x;
    state.initialPos.y = state.currentPos.y;
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
    const currentWidth = getComputedStyle(classroom).width;

    if (parseInt(currentWidth) > 240) {
        classroom.style.width = parseInt(currentWidth) - 10 + "px";
    } else {
        alert("You've reached the min width.");
    }

}

function incclassroomWidth() {
    const currentWidth = getComputedStyle(classroom).width;

    if (parseInt(currentWidth) < 760) {
        classroom.style.width = parseInt(currentWidth) + 10 + "px";
    } else {
        alert("You've reached the max width.");
    }

}

function decclassroomLength() {
    const currentHeight = getComputedStyle(classroom).height;

    if (parseInt(currentHeight) > 240) {
        classroom.style.height = parseInt(currentHeight) - 10 + "px";
    } else {
        alert("You've reached the min length.");
    }
}

function incclassroomLength() {
    const currentHeight = getComputedStyle(classroom).height;

    if (parseInt(currentHeight) < 760) {
        classroom.style.height = parseInt(currentHeight) + 10 + "px";
    } else {
        alert("You've reached the max length.");
    }
}

function showNames() {

    const displayNames = document.querySelectorAll('.display-name');

    displayNames.forEach((item) => {
        item.style.visibility = "visible";
    });

    state.displayNameStatus = "visible";

}

function hideNames() {

    const displayNames = document.querySelectorAll('.display-name');

    displayNames.forEach((item) => {
        item.style.visibility = "hidden";
    });

    state.displayNameStatus = "hidden";


}

function rotateCcw() {

    const selectedObject = document.querySelector('.selected');

    if (selectedObject != null) {
        state.currentObjectId = selectedObject.getAttribute('data-object-id');
        state.currentObject = state.objects[state.currentObjectId];

        const currentRotationState = state.currentObject.getRotationState();
        const newRotationState = parseInt(currentRotationState) - 15;

        selectedObject.style.transform = "rotate(" + newRotationState + "deg)";
        state.currentObject.setRotationState(newRotationState);
    }

}

function rotateCw() {

    const selectedObject = document.querySelector('.selected');

    if (selectedObject != null) {
        state.currentObjectId = selectedObject.getAttribute('data-object-id');
        state.currentObject = state.objects[state.currentObjectId];

        const currentRotationState = state.currentObject.getRotationState();
        const newRotationState = parseInt(currentRotationState) + 15;

        selectedObject.style.transform = "rotate(" + newRotationState + "deg)";
        state.currentObject.setRotationState(newRotationState);
    }

}

function removeObject() {
    const selectedObject = document.querySelector(".selected");

    if (selectedObject != null) {
        if (selectedObject.classList.contains('occupied')) {
            alert("Please unassign this desk before removing it.");
        } else {
            selectedObject.remove();
        }
    } else {
        alert("Please select an object to remove.")
    }

}

// ------ Students Panel Functions ------

function addStudent() {
    const newDiv = document.createElement('div');
    newDiv.classList.add('student');
    newDiv.setAttribute('data-student-id', state.studentIds);
    studentList.appendChild(newDiv);

    const newInfoButton = document.createElement('i');
    newInfoButton.classList.add('student-info-button', 'fas', 'fa-info-circle');
    newDiv.appendChild(newInfoButton);

    const newPara = document.createElement('p');
    newPara.textContent = "New Student";
    newDiv.appendChild(newPara);

    const newAssignButton = document.createElement('i');
    newAssignButton.classList.add('assign-desk-button', 'fas', 'fa-chair');
    newDiv.appendChild(newAssignButton);

    const removeStudentButton = document.createElement('i');
    removeStudentButton.classList.add('remove-student-button', 'fas', 'fa-trash-alt')
    newDiv.appendChild(removeStudentButton);

    newInfoButton.addEventListener('click', loadStudentInfo);
    newAssignButton.addEventListener('click', assignDesk);
    removeStudentButton.addEventListener('click', removeStudent);

    state.students[state.studentIds] = new Student();
    state.students[state.studentIds].setId(state.studentIds);

    state.studentIds++;

}

function sortAz() {

    const studentList = document.querySelector('.student-list');
    const studentDivs = document.querySelectorAll('.student');
    const unsortedStudents = [];
    const studentsToSort = [];
    const sortedStudentDivs = [];

    studentDivs.forEach((element) => {
        state.currentStudentId = element.getAttribute('data-student-id');
        unsortedStudents.push(state.students[state.currentStudentId]);
    });

    for (let i = 0; i < unsortedStudents.length; i++) {
        studentsToSort[i] = {
            fullName: unsortedStudents[i].getFirstName() + " " + unsortedStudents[i].getLastName(),
            id: unsortedStudents[i].getId()
        };
    }

    const sortedStudents = studentsToSort.sort(function (a, b) {
        if (a.fullName.toLowerCase() < b.fullName.toLowerCase()) return -1;
        if (a.fullName.toLowerCase() > b.fullName.toLowerCase()) return 1;
        return 0;
    });

    for (let i = 0; i < sortedStudents.length; i++) {

        const dataAttribute = "[data-student-id='" + sortedStudents[i].id + "']";
        sortedStudentDivs[i] = document.querySelector(dataAttribute);

    }

    for (let i = 0; i < sortedStudentDivs.length; i++) {
        studentList.appendChild(sortedStudentDivs[i]);
    }

}

function loadStudentInfo(event) {

    state.currentStudentId = event.target.parentNode.getAttribute('data-student-id');
    state.currentStudent = state.students[state.currentStudentId];

    const currentFirstName = state.currentStudent.getFirstName();
    const currentLastName = state.currentStudent.getLastName();

    document.querySelector('#first-name').value = currentFirstName;
    document.querySelector('#last-name').value = currentLastName;

    openModal();
}

function setStudentInfo() {

    const newFirstName = document.querySelector('#first-name').value;
    const newLastName = document.querySelector('#last-name').value;

    state.currentStudent.setFirstName(newFirstName);
    state.currentStudent.setLastName(newLastName);

    const dataStudentId = "[data-student-id='" + state.currentStudentId + "']";
    const currentStudentDiv = document.querySelector(dataStudentId);

    currentStudentDiv.childNodes[1].innerText = newFirstName + " " + newLastName;

    if (state.currentStudent.getAssignedDesk() != null) {

        const dataObjectId = "[data-object-id='" + state.currentStudent.getAssignedDesk() + "']";
        const deskToUpdate = document.querySelector(dataObjectId);

        deskToUpdate.childNodes[1].innerText = state.currentStudent.getFirstName() + " " + state.currentStudent.getLastName();

    }

    closeModal();
}

function assignDesk(event) {

    const selectedObject = document.querySelector(".selected");
    const studentDiv = event.target.parentNode;

    state.currentStudentId = studentDiv.getAttribute('data-student-id');
    state.currentStudent = state.students[state.currentStudentId];

    if (selectedObject != null && selectedObject.classList.contains('student-desk')) { // if an object is selected

        if (studentDiv.classList.contains('assigned')) { // if student is already assigned to a desk, unassign student

            const confirmUnassign = confirm("This student will be unassigned from its desk.");

            if (confirmUnassign) {

                unassignDesk(event);

            }

        } else { // if student is not already assigned to a desk, assign student

            if (selectedObject.classList.contains('occupied')) {

                alert("The selected desk is already occupied.");

            } else {

                // set student id for desk
                state.currentObjectId = selectedObject.getAttribute('data-object-id');
                state.currentObject = state.objects[state.currentObjectId];
                state.currentObject.setOccupant(state.currentStudentId);

                // set desk id for student
                state.currentStudent.setAssignedDesk(state.currentObjectId);

                // update desk's display name with student name
                selectedObject.childNodes[1].innerText = state.currentStudent.getFirstName() + " " + state.currentStudent.getLastName();
                selectedObject.childNodes[0].classList.remove('far');
                selectedObject.childNodes[0].classList.add('fas');

                // highlight student div
                studentDiv.classList.add('assigned');

                // mark desk as occupied
                selectedObject.classList.add('occupied');

                // alert that action is complete
                alert(state.currentStudent.getFirstName() + " " + state.currentStudent.getLastName() + " was assigned to the selected desk.");

            }
        }

    } else { // if an object is not selected

        alert("Please select a student desk to assign.");

    }

}

function unassignDesk(event) {

    const studentDiv = event.target.parentNode;

    state.currentStudentId = studentDiv.getAttribute('data-student-id');
    state.currentStudent = state.students[state.currentStudentId];

    // get object id and array object for assigned desk
    state.currentObjectId = state.currentStudent.getAssignedDesk();
    state.currentObject = state.objects[state.currentObjectId];

    if (state.currentObjectId != null) {

        // query the assigned desk and mark as vacant
        const dataObjectId = "[data-object-id='" + state.currentObjectId + "']";
        const assignedObject = document.querySelector(dataObjectId);
        assignedObject.childNodes[0].classList.remove('fas');
        assignedObject.childNodes[0].classList.add('far');
        assignedObject.childNodes[1].innerText = "Vacant";
        assignedObject.classList.remove('occupied')

        // set the assigned desk and assigned student to null
        state.currentStudent.setAssignedDesk(null);
        state.currentObject.setOccupant(null);

    }

    // remove highlight from student div
    studentDiv.classList.remove('assigned');
}

function removeStudent(event) {

    const confirmRemove = confirm("WARNING: This student will be removed. This action cannot be undone.");

    if (confirmRemove) {
        unassignDesk(event);
        event.target.parentNode.remove();
    }
}

function printClassroom() {
    const classroom = document.querySelector('.classroom-wrapper').innerHTML;
    const win = window.open('', '', 'height=750, width=1000');
    win.document.write('<head>');
    win.document.write('<link rel="stylesheet" href="./printstyles.css" />')
    win.document.write('<title>Print Classroom Plan</title>');
    win.document.write('</head>');
    win.document.write('<html><body>');
    win.document.write('<div id="print-title"><h1>My Classroom Plan</h1></div>');
    win.document.write(classroom);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
}

function printStudents() {
    const studentDivs = document.querySelectorAll('.student');
    const win = window.open('', '', 'height=750, width=1000');
    win.document.write('<head>');
    win.document.write('<link rel="stylesheet" href="./printstyles.css" />')
    win.document.write('<title>Print Student List</title>');
    win.document.write('</head>');
    win.document.write('<html><body>');
    win.document.write('<div id="print-title"><h1>My Student List</h1></div>');

    for (let i = 0; i < studentDivs.length; i++) {
        win.document.write('<p class="print-list">');
        win.document.write('&#9744; ');

        state.currentStudentId = studentDivs[i].getAttribute('data-student-id');
        state.currentStudent = state.students[state.currentStudentId];
        const firstName = state.currentStudent.getFirstName();
        const lastName = state.currentStudent.getLastName();

        win.document.write(firstName + " " + lastName);
        win.document.write('</p>');
    }

    win.document.write('</body></html>');
    win.document.close();
    win.print();
}