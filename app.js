// ------ Button Selectors ------

const addStudentDeskButton = document.querySelector('#add-student-desk-button');
const addTeacherDeskButton = document.querySelector('#add-teacher-desk-button');
const addBookshelfButton = document.querySelector('#add-bookshelf-button');
const addWhiteboardButton = document.querySelector('#add-whiteboard-button');
const addDoorwayButton = document.querySelector('#add-doorway-button');
const addWindowButton = document.querySelector('#add-window-button');
const addWallSegmentButton = document.querySelector('#add-wall-segment-button');
const addRoundTableButton = document.querySelector('#add-round-table-button');
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

// ------ Classroom Selectors ------

const classroomWrapper = document.querySelector('.classroom-wrapper');
const classroom = document.querySelector('.classroom');

// ------ Modal Selector ------

const addStudentModal = document.querySelector(".add-student-modal");

// ------ Event Listeners ------

addStudentDeskButton.addEventListener('click', addStudentDesk);
addTeacherDeskButton.addEventListener('click', addTeacherDesk);
addBookshelfButton.addEventListener('click', addBookshelf);
addWhiteboardButton.addEventListener('click', addWhiteboard);
addDoorwayButton.addEventListener('click', addDoorway);
addWindowButton.addEventListener('click', addWindow);
addWallSegmentButton.addEventListener('click', addWallSegment);
addRoundTableButton.addEventListener('click', addRoundTable);
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
document.addEventListener('keydown', moveObject, false);

// ------ State Object ------

const state = {
    objectIds: 0,
    objects: new Map(),

    studentIds: 0,
    students: new Map(),

    targetStudentId: null,
    targetStudent: null,

    draggableObject: null,
    dragActive: false,
    cursorOffset: { x: 0, y: 0 },
    newPos: { x: 0, y: 0 },

    displayNameStatus: "hidden",
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
        this.occupant = null;
    }

    getRotationState() {
        return this.rotationState;
    }

    setRotationState(value) {
        this.rotationState = value;
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

    state.objects.set(state.objectIds, newObject);

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

function addWhiteboard() {
    createObject().classList.add('whiteboard');
    state.objectIds++;
}

function addDoorway() {
    createObject().classList.add('doorway');
    state.objectIds++;
}

function addWindow() {
    createObject().classList.add('window');
    state.objectIds++;
}

function addWallSegment() {
    createObject().classList.add('wall-segment');
    state.objectIds++;
}

function addRoundTable() {
    createObject().classList.add('round-table');
    state.objectIds++;
}

// ------ Classroom Functions ------

function deselectObjects() {
    for (let i = 0; i < state.objectIds; i++) {

        const dataAttribute = "[data-object-id='" + i + "']";
        const selectedObject = document.querySelector(dataAttribute);

        if (selectedObject) {
            selectedObject.classList.remove('selected');
        }

    }
}

function selectObject(event) {
    deselectObjects();
    event.target.classList.add('selected');
}

function removeDraggable() {
    for (let i = 0; i < state.objectIds; i++) {

        const dataAttribute = "[data-object-id='" + i + "']";
        const selectedObject = document.querySelector(dataAttribute);

        if (selectedObject) {
            selectedObject.classList.remove('draggable');
        }

    }
}

function addDraggable(event) {
    removeDraggable();
    event.target.classList.add('draggable');
}

// ------ Drag Events ------

function dragStart(event) {

    state.draggableObject = document.querySelector('.draggable');

    if (state.draggableObject) {

        if (event.type === "touchstart") {
            state.cursorOffset.x = event.touches[0].clientX - parseInt(state.draggableObject.style.left);
            state.cursorOffset.y = event.touches[0].clientY - parseInt(state.draggableObject.style.top);
        } else {
            state.cursorOffset.x = event.clientX - parseInt(state.draggableObject.style.left);
            state.cursorOffset.y = event.clientY - parseInt(state.draggableObject.style.top);
        }

        if (event.target === state.draggableObject) {
            state.dragActive = true;
        }

    }

}

function drag(event) {
    if (state.dragActive) {

        event.preventDefault();

        if (event.type === "touchmove") {
            state.newPos.x = event.touches[0].clientX - state.cursorOffset.x;
            state.newPos.y = event.touches[0].clientY - state.cursorOffset.y;
        } else {
            state.newPos.x = event.clientX - state.cursorOffset.x;
            state.newPos.y = event.clientY - state.cursorOffset.y;
        }

        checkBounds(state.draggableObject);

        state.draggableObject.style.left = state.newPos.x + "px";
        state.draggableObject.style.top = state.newPos.y + "px";

    }

}

function dragEnd() {
    state.cursorOffset.x = 0;
    state.cursorOffset.y = 0;
    state.dragActive = false;
}

function checkBounds(object) {

    const objectId = parseInt(object.getAttribute('data-object-id'));
    const currentObject = state.objects.get(objectId);

    let deg = Math.abs(currentObject.getRotationState());

    if (deg >= 0 && deg <= 90) {
        deg = deg;
    } else if (deg > 90 && deg <= 180) {
        deg = 180 - deg;
    } else if (deg > 180 && deg <= 270) {
        deg = deg - 180;
    } else if (deg > 270 && deg <= 360) {
        deg = 360 - deg;
    }

    const rad = deg * (Math.PI / 180);

    const room = {
        width: parseInt(getComputedStyle(classroom).width),
        height: parseInt(getComputedStyle(classroom).height)
    };

    const obj = {
        width: parseInt(getComputedStyle(object).width) + (parseInt(getComputedStyle(object).borderRightWidth) * 2),
        height: parseInt(getComputedStyle(object).height) + (parseInt(getComputedStyle(object).borderBottomWidth) * 2)
    };

    const centerObj = {
        x: obj.width / 2,
        y: obj.height / 2
    }

    const boundingBox = {
        width: Math.sin(rad) * obj.height + Math.cos(rad) * obj.width,
        height: Math.cos(rad) * obj.height + Math.sin(rad) * obj.width
    }

    const centerBoundingBox = {
        x: boundingBox.width / 2,
        y: boundingBox.height / 2
    }

    const bounds = {
        left: centerBoundingBox.x - centerObj.x,
        top: centerBoundingBox.y - centerObj.y,
        right: room.width - obj.width - (centerBoundingBox.x - centerObj.x),
        bottom: room.height - obj.height - (centerBoundingBox.y - centerObj.y)
    };

    if (object.classList.contains('round-table')) {
        bounds.left = 0;
        bounds.top = 0;
        bounds.right = room.width - obj.width;
        bounds.bottom = room.height - obj.height;
    };

    if (state.newPos.x < bounds.left) { state.newPos.x = bounds.left; };
    if (state.newPos.y < bounds.top) { state.newPos.y = bounds.top; };
    if (state.newPos.x > bounds.right) { state.newPos.x = bounds.right; };
    if (state.newPos.y > bounds.bottom) { state.newPos.y = bounds.bottom; };

}


// ------ Move Object with Keys ------

function moveObject(event) {

    const selectedObject = document.querySelector('.selected');

    if (selectedObject) {

        const currentPos = {
            x: parseInt(getComputedStyle(selectedObject).left),
            y: parseInt(getComputedStyle(selectedObject).top)
        }

        switch (event.key) {
            case "ArrowRight":
                state.newPos.x = currentPos.x + 1;
                event.preventDefault();
                break;
            case "ArrowLeft":
                state.newPos.x = currentPos.x - 1;
                event.preventDefault();
                break;
            case "ArrowUp":
                state.newPos.y = currentPos.y - 1;
                event.preventDefault();
                break;
            case "ArrowDown":
                state.newPos.y = currentPos.y + 1;
                event.preventDefault();
                break;
        }

        checkBounds(selectedObject);

        selectedObject.style.left = state.newPos.x + "px";
        selectedObject.style.top = state.newPos.y + "px";

    }

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

    const selectedElement = document.querySelector('.selected');

    if (selectedElement) {
        const objectId = parseInt(selectedElement.getAttribute('data-object-id'));
        const currentObject = state.objects.get(objectId);

        const currentRotationState = currentObject.getRotationState();
        let newRotationState = parseInt(currentRotationState) - 15;

        if (newRotationState === -360) {
            newRotationState = 0;
        }

        selectedElement.style.transform = "rotate(" + newRotationState + "deg)";
        currentObject.setRotationState(newRotationState);
    }

}

function rotateCw() {

    const selectedElement = document.querySelector('.selected');

    if (selectedElement) {
        const objectId = parseInt(selectedElement.getAttribute('data-object-id'));
        const currentObject = state.objects.get(objectId);

        const currentRotationState = currentObject.getRotationState();
        let newRotationState = parseInt(currentRotationState) + 15;

        if (newRotationState === 360) {
            newRotationState = 0;
        }

        selectedElement.style.transform = "rotate(" + newRotationState + "deg)";
        currentObject.setRotationState(newRotationState);
    }

}

function removeObject() {
    const selectedElement = document.querySelector(".selected");

    if (selectedElement) {
        if (selectedElement.classList.contains('occupied')) {
            alert("Please unassign this desk before removing it.");
        } else {
            selectedElement.remove();
            const objectId = parseInt(selectedElement.getAttribute('data-object-id'));
            state.objects.delete(objectId);
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

    const newStudent = new Student();
    newStudent.setId(state.studentIds);

    state.students.set(state.studentIds, newStudent);

    state.studentIds++;

}

function sortAz() {

    const studentList = document.querySelector('.student-list');
    const studentDivs = document.querySelectorAll('.student');
    const unsortedStudents = [];
    const studentsToSort = [];
    const sortedStudentDivs = [];

    studentDivs.forEach((element) => {
        const studentId = parseInt(element.getAttribute('data-student-id'));
        unsortedStudents.push(state.students.get(studentId));
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

        const dataStudentId = "[data-student-id='" + sortedStudents[i].id + "']";
        sortedStudentDivs[i] = document.querySelector(dataStudentId);

    }

    for (let i = 0; i < sortedStudentDivs.length; i++) {
        studentList.appendChild(sortedStudentDivs[i]);
    }

}

function loadStudentInfo(event) {

    state.targetStudentId = parseInt(event.target.parentNode.getAttribute('data-student-id'));
    state.targetStudent = state.students.get(state.targetStudentId);

    document.querySelector('#first-name').value = state.targetStudent.getFirstName();
    document.querySelector('#last-name').value = state.targetStudent.getLastName();

    openModal();
}

function setStudentInfo() {

    const firstName = document.querySelector('#first-name').value;
    const lastName = document.querySelector('#last-name').value;

    state.targetStudent.setFirstName(firstName);
    state.targetStudent.setLastName(lastName);

    let currentElement = document.querySelector(`[data-student-id='${state.targetStudentId}']`);

    currentElement.childNodes[1].innerText = `${firstName} ${lastName}`;

    if (parseInt(state.targetStudent.getAssignedDesk()) >= 0) {

        currentElement = document.querySelector(`[data-object-id='${state.targetStudent.getAssignedDesk()}']`);
        currentElement.childNodes[1].innerText = `${state.targetStudent.getFirstName()} ${state.targetStudent.getLastName()}`;

    }

    closeModal();
}

function assignDesk(event) {

    const selectedElement = document.querySelector(".selected");
    const studentDiv = event.target.parentNode;

    const studentId = parseInt(studentDiv.getAttribute('data-student-id'));
    const currentStudent = state.students.get(studentId);

    if (!selectedElement || !selectedElement.classList.contains('student-desk')) {
        alert("Please select a student desk to assign.");
        return;
    }

    if (studentDiv.classList.contains('assigned')) {
        if (confirm(`${currentStudent.getFirstName()} ${currentStudent.getLastName()} will be unassigned from thier desk.`)) { unassignDesk(event); }
        return;
    }

    if (selectedElement.classList.contains('occupied')) {
        alert("The selected desk is already occupied.");
    } else {

        const objectId = parseInt(selectedElement.getAttribute('data-object-id'));
        const currentObject = state.objects.get(objectId);

        currentObject.setOccupant(studentId);
        currentStudent.setAssignedDesk(objectId);

        selectedElement.childNodes[1].innerText = `${currentStudent.getFirstName()} ${currentStudent.getLastName()}`;
        selectedElement.childNodes[0].classList.remove('far');
        selectedElement.childNodes[0].classList.add('fas');

        studentDiv.classList.add('assigned');
        selectedElement.classList.add('occupied');

        alert(`${currentStudent.getFirstName()} ${currentStudent.getLastName()} was assigned to the selected desk.`);

    }

}

function unassignDesk(event) {

    const studentDiv = event.target.parentNode;

    const studentId = parseInt(studentDiv.getAttribute('data-student-id'));
    const currentStudent = state.students.get(studentId);

    const objectId = parseInt(currentStudent.getAssignedDesk());
    const currentObject = state.objects.get(objectId);

    if (objectId >= 0) {

        const assignedObject = document.querySelector(`[data-object-id='${objectId}']`);

        assignedObject.childNodes[0].classList.remove('fas');
        assignedObject.childNodes[0].classList.add('far');
        assignedObject.childNodes[1].innerText = "Vacant";
        assignedObject.classList.remove('occupied')

        currentStudent.setAssignedDesk(null);
        currentObject.setOccupant(null);

    }

    studentDiv.classList.remove('assigned');

}

function removeStudent(event) {

    if (confirm("WARNING: This student will be removed. This action cannot be undone.")) {
        unassignDesk(event);
        event.target.parentNode.remove();

        const studentId = parseInt(event.target.parentNode.getAttribute('data-student-id'));
        state.students.delete(studentId);
    }

}

// ------ Print Functions ------

function printClassroom() {
    const classroomHTML = document.querySelector('.classroom-wrapper').innerHTML;
    const win = window.open('', '', 'height=750, width=1000');
    win.document.write('<head>');
    win.document.write('<link rel="stylesheet" href="./styles.css" />')
    win.document.write('<title>Print Classroom Plan</title>');
    win.document.write('</head>');
    win.document.write('<html style="background: none; display: flex; justify-content: center; min-width: 100%; font-family: "Quicksand", sans-serif;"><body>');
    win.document.write('<div id="print-title"><h1>My Classroom Plan</h1></div>');
    win.document.write(classroomHTML);

    const roomElements = win.document.querySelector('.classroom').childNodes;

    roomElements.forEach((element) => {
        element.style.borderColor = "black";
        element.style.cursor = "default";
    });

    win.document.write('</body></html>');
    win.document.close();
    win.print();
}

function printStudents() {
    const studentDivs = document.querySelectorAll('.student');
    const win = window.open('', '', 'height=750, width=1000');
    win.document.write('<head>');
    win.document.write('<link rel="stylesheet" href="./styles.css" />')
    win.document.write('<title>Print Student List</title>');
    win.document.write('</head>');
    win.document.write('<html style="background: none; display: flex; justify-content: center; min-width: 100%; font-family: "Quicksand", sans-serif;"><body>');
    win.document.write('<div id="print-title"><h1>My Student List</h1></div>');

    for (let i = 0; i < studentDivs.length; i++) {
        win.document.write('<p class="print-list">');
        win.document.write('&#9744; ');

        const studentId = parseInt(studentDivs[i].getAttribute('data-student-id'));
        const currentStudent = state.students.get(studentId);
        const firstName = currentStudent.getFirstName();
        const lastName = currentStudent.getLastName();

        win.document.write(firstName + " " + lastName);
        win.document.write('</p>');
    }

    win.document.write('</body></html>');
    win.document.close();
    win.print();
}