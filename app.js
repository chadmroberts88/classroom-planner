// ------ Button Selectors ------

const addObjectsButton = document.querySelector('#add-objects-button');
const removeObjectButton = document.querySelector('#remove-object-button');
const rotateCcwButton = document.querySelector('#rotate-ccw-button');
const rotateCwButton = document.querySelector('#rotate-cw-button');
const sendbackwardButton = document.querySelector('#send-backward-button');
const bringForwardButton = document.querySelector('#bring-forward-button');
const incWidthButton = document.querySelector('#inc-width-button');
const decWidthButton = document.querySelector('#dec-width-button');
const incLengthButton = document.querySelector('#inc-length-button');
const decLengthButton = document.querySelector('#dec-length-button');
const toggleNamesButton = document.querySelector('#toggle-names-button');
const printClassroomButton = document.querySelector('#print-classroom-button');

const collapseDrawerButton = document.querySelector('#collapse-drawer-button');
const addStudentButton = document.querySelector('#add-student-button');
const sortAzButton = document.querySelector('#sort-az-button');
const printStudentsButton = document.querySelector('#print-students-button');

const closeModalButton = document.querySelector('#close-modal-button');
const saveChangesButton = document.querySelector('#save-changes-button');

// ------ Student List Selector ------

const studentList = document.querySelector('#student-list');

// ------ Classroom Selectors ------

const classroomContainer = document.querySelector('#classroom-container');
const classroom = document.querySelector('#classroom');

// ------ Modal Selector ------

const addStudentModal = document.querySelector('#add-student-modal');

// ------ Drawer Selector ------

const drawer = document.querySelector('#drawer');

// ------ Title Box Selector ------

const titleBox = document.querySelector('#title-box');

// ------ Event Listeners ------

addObjectsButton.addEventListener('click', addObject);
removeObjectButton.addEventListener('click', removeObject);
rotateCcwButton.addEventListener('click', rotateCcw);
rotateCwButton.addEventListener('click', rotateCw);
sendbackwardButton.addEventListener('click', sendBackward);
bringForwardButton.addEventListener('click', bringforward);
incWidthButton.addEventListener('click', incClassroomWidth);
decWidthButton.addEventListener('click', decClassroomWidth);
incLengthButton.addEventListener('click', incclassroomLength);
decLengthButton.addEventListener('click', decclassroomLength);
toggleNamesButton.addEventListener('click', toggleNames);
printClassroomButton.addEventListener('click', printClassroom);

collapseDrawerButton.addEventListener('click', collapseDrawer);
addStudentButton.addEventListener('click', addStudent);
sortAzButton.addEventListener('click', sortAz);
printStudentsButton.addEventListener('click', printStudents);

closeModalButton.addEventListener('click', closeModal);
saveChangesButton.addEventListener('click', setStudentInfo);

classroom.addEventListener("touchstart", dragStart, false);
classroomContainer.addEventListener("touchend", dragEnd, false);
classroomContainer.addEventListener("touchmove", drag, false);
classroom.addEventListener('mousedown', dragStart, false);
classroomContainer.addEventListener("mousemove", drag, false);
classroomContainer.addEventListener("mouseup", dragEnd, false);
document.addEventListener('keydown', transformWithKeys, true);
document.addEventListener('keyup', resetArrowKeys, true);

// ------ Handle Deselection of Classroom Objects ------

titleBox.addEventListener('click', deselectObjects);

classroom.addEventListener('mouseenter', () => {
    state.classroomInFocus = true;
});

classroom.addEventListener('mouseleave', () => {
    state.classroomInFocus = false;
});

classroom.addEventListener('touchstart', () => {
    state.classroomInFocus = true;
});

classroom.addEventListener('touchend', () => {
    state.classroomInFocus = false;
});

classroomContainer.addEventListener('mousedown', () => {
    if (state.classroomInFocus) {
        return;
    } else {
        deselectObjects();
    }
});


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

    arrowKeysPressed: {},

    displayNameStatus: "hidden",

    sortedAz: false,

    mainPageInFocus: true,
    classroomInFocus: false,

    drawerOpen: false
};

// ------ Classes ------

class Student {
    constructor() {
        this.id = null;
        this.firstName = 'New';
        this.lastName = 'Student';
        this.assignedDeskId = null;
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

    getAssignedDeskId() {
        return this.assignedDeskId;
    }

    setAssignedDeskId(value) {
        this.assignedDeskId = value;
    }

}

class Object {
    constructor() {
        this.rotationState = 0;
        this.assignedStudentId = null;
    }

    getRotationState() {
        return this.rotationState;
    }

    setRotationState(value) {
        this.rotationState = value;
    }

    getAssignedStudentId() {
        return this.assignedStudentId;
    }

    setAssignedStudentId(value) {
        this.assignedStudentId = value;
    }
}

// ------ Object Functions ------

function createObject() {
    const newDiv = document.createElement('div');
    newDiv.setAttribute('data-object-id', state.objectIds);
    newDiv.addEventListener('mousedown', selectObject);
    newDiv.addEventListener('touchstart', selectObject);
    newDiv.addEventListener('mousedown', addDraggable);
    newDiv.addEventListener('touchstart', addDraggable);
    newDiv.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            selectObject(event);
        }
    });

    newDiv.style.left = 0;
    newDiv.style.top = 0;
    newDiv.style.transform = "rotate(0deg)";
    newDiv.setAttribute("tabindex", 0);
    classroom.appendChild(newDiv);

    const newObject = new Object();
    newObject.setRotationState(0);

    state.objects.set(state.objectIds, newObject);

    return newDiv;
}

function addObject() {
    const selectedQuantity = parseInt(document.querySelector('#quantity-selector').value);
    const selectedObject = document.querySelector('#object-selector').value;

    for (let i = 0; i < selectedQuantity; i++) {
        switch (selectedObject) {
            case 'student-desk':
                addStudentDesk();
                break;
            case 'teacher-desk':
                addTeacherDesk();
                break;
            case 'computer-station':
                addComputerStation();
                break;
            case 'table-round':
                addTableRound();
                break;
            case 'table-square':
                addTableSquare();
                break;
            case 'table-rectangle':
                addTableRectangle();
                break;
            case 'whiteboard':
                addWhiteboard();
                break;
            case 'bookshelf':
                addBookshelf();
                break;
            case 'doorway-left':
                addDoorwayLeft();
                break;
            case 'doorway-right':
                addDoorwayRight();
                break;
            case 'window':
                addWindow();
                break;
            case 'wall-segment':
                addWallSegment();
                break;
            default:
                break;
        }
    }

}

function addStudentDesk() {
    const newObject = createObject();
    newObject.classList.add('student-desk');
    newObject.setAttribute("title", "Student Desk");

    const newGraphic = document.createElement('i');
    newGraphic.classList.add('far', 'fa-user');
    newObject.appendChild(newGraphic);

    const newDisplayName = document.createElement('span');
    newDisplayName.innerText = "Vacant";
    newDisplayName.classList.add('display-name');
    newDisplayName.style.visibility = state.displayNameStatus;
    newObject.appendChild(newDisplayName);

    state.objectIds++;
}

function addTeacherDesk() {
    const newObject = createObject();
    newObject.classList.add('teacher-desk');
    newObject.setAttribute("title", "Teacher Desk");

    const newLabel = document.createElement('span');
    newLabel.innerText = "Teacher Desk";
    newObject.appendChild(newLabel);

    state.objectIds++;
}

function addBookshelf() {
    const newObject = createObject();
    newObject.classList.add('bookshelf');
    newObject.setAttribute("title", "Bookshelf");

    const newLabel = document.createElement('span');
    newLabel.innerText = "Bookshelf";
    newObject.appendChild(newLabel);

    state.objectIds++;
}

function addWhiteboard() {
    const newObject = createObject();
    newObject.classList.add('whiteboard');
    newObject.setAttribute("title", "Board");

    const newLabel = document.createElement('span');
    newLabel.innerText = "Board";
    newObject.appendChild(newLabel);

    state.objectIds++;
}

function addComputerStation() {
    const newObject = createObject();
    newObject.classList.add('computer-station');
    newObject.setAttribute("title", "Computer Station");

    const newLabel = document.createElement('span');
    newLabel.innerText = "Comp. Station";
    newObject.appendChild(newLabel);

    state.objectIds++;
}

function addTableRound() {
    const newObject = createObject();
    newObject.classList.add('table-round');
    newObject.setAttribute("title", "Round Table");

    const newLabel = document.createElement('span');
    newLabel.innerText = "Table";
    newObject.appendChild(newLabel);

    state.objectIds++;
}

function addTableSquare() {
    const newObject = createObject();
    newObject.classList.add('table-square');
    newObject.setAttribute("title", "Square Table");

    const newLabel = document.createElement('span');
    newLabel.innerText = "Table";
    newObject.appendChild(newLabel);

    state.objectIds++;
}

function addTableRectangle() {
    const newObject = createObject();
    newObject.classList.add('table-rectangle');
    newObject.setAttribute("title", "Rectangle Table");

    const newLabel = document.createElement('span');
    newLabel.innerText = "Table";
    newObject.appendChild(newLabel);

    state.objectIds++;
}

function addDoorwayLeft() {
    const newObject = createObject();
    newObject.classList.add('doorway-left');
    newObject.setAttribute("title", "Left Swinging Doorway");

    state.objectIds++;
}

function addDoorwayRight() {
    const newObject = createObject();
    newObject.classList.add('doorway-right');
    newObject.setAttribute("title", "Right Swinging Doorway");

    state.objectIds++;
}

function addWindow() {
    const newObject = createObject();
    newObject.classList.add('window');
    newObject.setAttribute("title", "Window");

    state.objectIds++;
}

function addWallSegment() {
    const newObject = createObject();
    newObject.classList.add('wall-segment');
    newObject.setAttribute("title", "Wall Segment/Barrier");

    state.objectIds++;
}

function rotateCcw() {

    const selectedElement = document.querySelector('.selected');

    if (selectedElement) {
        const objectId = parseInt(selectedElement.getAttribute('data-object-id'));
        const currentObject = state.objects.get(objectId);
        const deg = 15;

        const currentRotationState = currentObject.getRotationState();
        let newRotationState = parseInt(currentRotationState) - deg;

        if (newRotationState === -360) {
            newRotationState = 0;
        }

        selectedElement.style.transform = "rotate(" + newRotationState + "deg)";
        currentObject.setRotationState(newRotationState);

        const currentPos = {
            x: parseInt(getComputedStyle(selectedElement).left),
            y: parseInt(getComputedStyle(selectedElement).top),
        }

        state.newPos.x = currentPos.x;
        state.newPos.y = currentPos.y;

        checkBounds(selectedElement);

        selectedElement.style.left = state.newPos.x + "px";
        selectedElement.style.top = state.newPos.y + "px";
    }

}

function rotateCw() {

    const selectedElement = document.querySelector('.selected');

    if (selectedElement) {
        const objectId = parseInt(selectedElement.getAttribute('data-object-id'));
        const currentObject = state.objects.get(objectId);
        const deg = 15;

        const currentRotationState = currentObject.getRotationState();
        let newRotationState = parseInt(currentRotationState) + deg;

        if (newRotationState === 360) {
            newRotationState = 0;
        }

        selectedElement.style.transform = "rotate(" + newRotationState + "deg)";
        currentObject.setRotationState(newRotationState);

        const currentPos = {
            x: parseInt(getComputedStyle(selectedElement).left),
            y: parseInt(getComputedStyle(selectedElement).top),
        }

        state.newPos.x = currentPos.x;
        state.newPos.y = currentPos.y;

        checkBounds(selectedElement);

        selectedElement.style.left = state.newPos.x + "px";
        selectedElement.style.top = state.newPos.y + "px";
    }

}

function sendBackward() {

    const selectedElement = document.querySelector('.selected');
    let prevElement = null;

    if (selectedElement) {
        prevElement = document.querySelector('.selected').previousSibling;
    }

    if (selectedElement && prevElement) {
        classroom.insertBefore(selectedElement, prevElement);
    }

}

function bringforward() {

    const selectedElement = document.querySelector('.selected');
    let nextElement = null;

    if (selectedElement) {
        nextElement = document.querySelector('.selected').nextSibling;
    }

    if (selectedElement && nextElement) {
        classroom.insertBefore(nextElement, selectedElement);
    }

}

function removeObject() {
    const selectedElement = document.querySelector('.selected');
    const removeMessage = document.querySelector('#remove-message');

    if (selectedElement) {
        if (selectedElement.classList.contains('occupied')) {
            removeMessage.innerText = 'Please unassign this desk before removing it.';
            removeMessage.classList.add('show');
            setTimeout(() => { removeMessage.classList.remove('show'); }, 3000);
        } else {
            selectedElement.remove();
            const objectId = parseInt(selectedElement.getAttribute('data-object-id'));
            state.objects.delete(objectId);
        }
    }

}

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

// ------ Student Functions ------

function addStudent() {
    const newDiv = document.createElement('div');
    newDiv.classList.add('student');
    newDiv.setAttribute('data-student-id', state.studentIds);
    studentList.appendChild(newDiv);

    const newInfoButton = document.createElement('button');
    newInfoButton.classList.add('student-info-button', 'fas', 'fa-info', 'ol-active', 'bg-active');
    newInfoButton.setAttribute('role', 'button');
    newInfoButton.setAttribute('title', 'Edit Student Info');
    newInfoButton.setAttribute('tabindex', 0);
    newDiv.appendChild(newInfoButton);

    const newPara = document.createElement('p');
    newPara.textContent = "New Student";
    newDiv.appendChild(newPara);

    const newAssignButton = document.createElement('button');
    newAssignButton.classList.add('assign-desk-button', 'fas', 'fa-chair', 'ol-active', 'bg-active');
    newAssignButton.setAttribute('role', 'button');
    newAssignButton.setAttribute('title', 'Assign to Desk');
    newAssignButton.setAttribute('tabindex', 0);
    newDiv.appendChild(newAssignButton);

    const newRemoveStudentButton = document.createElement('button');
    newRemoveStudentButton.classList.add('remove-student-button', 'fas', 'fa-trash-alt', 'ol-active', 'bg-active');
    newRemoveStudentButton.setAttribute('role', 'button');
    newRemoveStudentButton.setAttribute('title', 'Remove Student');
    newRemoveStudentButton.setAttribute('tabindex', 0);
    newDiv.appendChild(newRemoveStudentButton);

    newInfoButton.addEventListener('click', loadStudentInfo);
    newAssignButton.addEventListener('click', assignDesk);
    newRemoveStudentButton.addEventListener('click', removeStudent);

    const newStudent = new Student();
    newStudent.setId(state.studentIds);

    state.students.set(state.studentIds, newStudent);
    state.studentIds++;

}

function sortAz() {

    const studentDivs = document.querySelectorAll('.student');
    const unsortedStudents = [];
    let sortedStudents;
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

    if (state.sortedAz) {

        sortedStudents = studentsToSort.sort(function (a, b) {
            if (a.fullName.toLowerCase() > b.fullName.toLowerCase()) return -1;
            if (a.fullName.toLowerCase() < b.fullName.toLowerCase()) return 1;
            return 0;
        });

        state.sortedAz = false;
        sortAzButton.childNodes[0].classList.remove('fa-sort-alpha-down-alt');
        sortAzButton.childNodes[0].classList.add('fa-sort-alpha-down');

    } else {

        sortedStudents = studentsToSort.sort(function (a, b) {
            if (a.fullName.toLowerCase() < b.fullName.toLowerCase()) return -1;
            if (a.fullName.toLowerCase() > b.fullName.toLowerCase()) return 1;
            return 0;
        });

        state.sortedAz = true;
        sortAzButton.childNodes[0].classList.remove('fa-sort-alpha-down');
        sortAzButton.childNodes[0].classList.add('fa-sort-alpha-down-alt');
    }

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
    state.mainPageInFocus = false;

}

function setStudentInfo() {

    const firstName = document.querySelector('#first-name').value;
    const lastName = document.querySelector('#last-name').value;

    state.targetStudent.setFirstName(firstName);
    state.targetStudent.setLastName(lastName);

    let currentElement = document.querySelector(`[data-student-id='${state.targetStudentId}']`);

    currentElement.childNodes[1].innerText = `${firstName} ${lastName}`;

    if (parseInt(state.targetStudent.getAssignedDeskId()) >= 0) {

        currentElement = document.querySelector(`[data-object-id='${state.targetStudent.getAssignedDeskId()}']`);
        currentElement.childNodes[1].innerText = `${state.targetStudent.getFirstName()} ${state.targetStudent.getLastName()}`;

    }

    closeModal();
    state.mainPageInFocus = true;
}

function assignDesk(event) {

    const selectedElement = document.querySelector('.selected');
    const studentDiv = event.target.parentNode;

    const studentId = parseInt(studentDiv.getAttribute('data-student-id'));
    const currentStudent = state.students.get(studentId);

    const selectMessage = document.querySelector('#select-message');
    const occupiedMessage = document.querySelector('#occupied-message');
    const assignedMessage = document.querySelector('#assigned-message');
    const unassignedMessage = document.querySelector('#unassigned-message');

    if (studentDiv.classList.contains('assigned')) {

        unassignedMessage.innerText = `${currentStudent.getFirstName()} ${currentStudent.getLastName()} was unassigned from their desk.`;
        unassignedMessage.classList.add('show');
        setTimeout(() => { unassignedMessage.classList.remove('show'); }, 3000);
        unassignDesk(event);
        return;

    }

    if (!selectedElement || !selectedElement.classList.contains('student-desk')) {

        selectMessage.innerText = 'Please select a student desk to assign.';
        selectMessage.classList.add('show');
        setTimeout(() => { selectMessage.classList.remove('show'); }, 3000);
        return;

    }

    if (selectedElement.classList.contains('occupied')) {

        occupiedMessage.innerText = 'The selected desk is already occupied';
        occupiedMessage.classList.add('show');
        setTimeout(() => { occupiedMessage.classList.remove('show'); }, 3000);

    } else {

        const objectId = parseInt(selectedElement.getAttribute('data-object-id'));
        const currentObject = state.objects.get(objectId);

        currentObject.setAssignedStudentId(studentId);
        currentStudent.setAssignedDeskId(objectId);

        selectedElement.childNodes[1].innerText = `${currentStudent.getFirstName()} ${currentStudent.getLastName()}`;
        selectedElement.childNodes[0].classList.remove('far');
        selectedElement.childNodes[0].classList.add('fas');

        studentDiv.classList.add('assigned');
        selectedElement.classList.add('occupied');

        assignedMessage.innerText = `${currentStudent.getFirstName()} ${currentStudent.getLastName()} was assigned to the selected desk.`;
        assignedMessage.classList.add('show');
        setTimeout(() => { assignedMessage.classList.remove('show'); }, 3000);
        assignedMessage, innerText = '';

    }

}

function unassignDesk(event) {

    const studentDiv = event.target.parentNode;

    const studentId = parseInt(studentDiv.getAttribute('data-student-id'));
    const currentStudent = state.students.get(studentId);

    const objectId = parseInt(currentStudent.getAssignedDeskId());
    const currentObject = state.objects.get(objectId);

    if (objectId >= 0) {

        const assignedObject = document.querySelector(`[data-object-id='${objectId}']`);

        assignedObject.childNodes[0].classList.remove('fas');
        assignedObject.childNodes[0].classList.add('far');
        assignedObject.childNodes[1].innerText = "Vacant";
        assignedObject.classList.remove('occupied')

        currentStudent.setAssignedDeskId(null);
        currentObject.setAssignedStudentId(null);

    }

    studentDiv.classList.remove('assigned');

}

function removeStudent(event) {

    if (confirm("This student will be removed from the list. This action cannot be undone.")) {

        unassignDesk(event);
        event.target.parentNode.remove();

        const studentId = parseInt(event.target.parentNode.getAttribute('data-student-id'));
        state.students.delete(studentId);

    }

}

// ------ Add-Student Modal Functions ------

function openModal() {
    addStudentModal.style.display = "block";
    document.querySelector('#first-name').focus();

    const buttons = document.getElementsByTagName('button');
    const selectors = document.getElementsByTagName('select');
    const roomObjects = document.querySelectorAll('[data-object-id]');

    for (let i = 0; i < buttons.length; i++) {

        if (!(buttons[i].id === "close-modal-button" || buttons[i].id === "save-changes-button")) {
            buttons[i].setAttribute("tabindex", -1);
        } else {
            buttons[i].setAttribute("tabindex", 0);
        }

    }

    for (let i = 0; i < selectors.length; i++) {
        selectors[i].setAttribute("tabindex", -1);
    }

    for (let i = 0; i < roomObjects.length; i++) {
        roomObjects[i].setAttribute("tabindex", -1);
    }

}

function closeModal() {
    addStudentModal.style.display = "none";

    const buttons = document.getElementsByTagName('button');
    const selectors = document.getElementsByTagName('select');
    const roomObjects = document.querySelectorAll('[data-object-id]');

    for (let i = 0; i < buttons.length; i++) {

        if (buttons[i].id === "close-modal-button" || buttons[i].id === "save-changes-button") {
            buttons[i].setAttribute("tabindex", -1);
        } else {
            buttons[i].setAttribute("tabindex", 0);
        }

    }

    for (let i = 0; i < selectors.length; i++) {
        selectors[i].setAttribute("tabindex", 0);
    }

    for (let i = 0; i < roomObjects.length; i++) {
        roomObjects[i].setAttribute("tabindex", 0);
    }

}

// ------ Classroom Functions ------

function decClassroomWidth() {
    const currentWidth = getComputedStyle(classroom).width;
    const minWidth = getComputedStyle(classroom).minWidth;
    const x = 10;
    const roomElements = classroom.childNodes;
    const minWidthMessage = document.querySelector('#min-width-message');

    if (parseInt(currentWidth) > parseInt(minWidth)) {
        classroom.style.width = parseInt(currentWidth) - x + "px";

        roomElements.forEach((element) => {
            const currentPosX = parseInt(getComputedStyle(element).left);
            state.newPos.x = currentPosX;
            checkBounds(element);
            element.style.left = state.newPos.x + "px";
        });

    } else {
        minWidthMessage.innerText = "You've reached the minimum classroom width.";
        minWidthMessage.classList.add('show');
        setTimeout(() => { minWidthMessage.classList.remove('show'); }, 3000);
    }

}

function incClassroomWidth() {
    const currentWidth = getComputedStyle(classroom).width;
    const maxWidth = getComputedStyle(classroom).maxWidth;
    const x = 10;
    const maxWidthMessage = document.querySelector('#max-width-message');

    if (parseInt(currentWidth) < parseInt(maxWidth)) {
        classroom.style.width = parseInt(currentWidth) + x + "px";
    } else {
        maxWidthMessage.innerText = "You've reached the maximum classroom width.";
        maxWidthMessage.classList.add('show');
        setTimeout(() => { maxWidthMessage.classList.remove('show'); }, 3000);
    }

}

function decclassroomLength() {
    const currentHeight = getComputedStyle(classroom).height;
    const minHeight = getComputedStyle(classroom).minHeight;
    const y = 10;
    const roomElements = classroom.childNodes;
    const minLengthMessage = document.querySelector('#min-length-message');

    if (parseInt(currentHeight) > parseInt(minHeight)) {
        classroom.style.height = parseInt(currentHeight) - y + "px";

        roomElements.forEach((element) => {
            const currentPosY = parseInt(getComputedStyle(element).top);
            state.newPos.y = currentPosY;
            checkBounds(element);
            element.style.top = state.newPos.y + "px";
        });

    } else {
        minLengthMessage.innerText = "You've reached the minimum classroom length.";
        minLengthMessage.classList.add('show');
        setTimeout(() => { minLengthMessage.classList.remove('show'); }, 3000);
    }

}

function incclassroomLength() {
    const currentHeight = getComputedStyle(classroom).height;
    const maxHeight = getComputedStyle(classroom).maxHeight;
    const y = 10;
    const maxLengthMessage = document.querySelector('#max-length-message');

    if (parseInt(currentHeight) < parseInt(maxHeight)) {
        classroom.style.height = parseInt(currentHeight) + y + "px";
    } else {
        maxLengthMessage.innerText = "You've reached the maximum classroom length.";
        maxLengthMessage.classList.add('show');
        setTimeout(() => { maxLengthMessage.classList.remove('show'); }, 3000);
    }
}

function toggleNames() {

    const displayNames = document.querySelectorAll('.display-name');

    if (state.displayNameStatus === "hidden") {

        toggleNamesButton.childNodes[0].classList.remove('fa-toggle-off');
        toggleNamesButton.childNodes[0].classList.add('fa-toggle-on');
        displayNames.forEach((item) => {
            item.style.visibility = "visible";
        });

        state.displayNameStatus = "visible";

    } else if (state.displayNameStatus === "visible") {

        toggleNamesButton.childNodes[0].classList.remove('fa-toggle-on');
        toggleNamesButton.childNodes[0].classList.add('fa-toggle-off');
        displayNames.forEach((item) => {
            item.style.visibility = "hidden";
        });

        state.displayNameStatus = "hidden";

    }

}

// ------ Drag Functions ------

function addDraggable(event) {
    removeDraggable();
    event.target.classList.add('draggable');
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

function dragStart(event) {

    state.draggableObject = document.querySelector('.draggable');

    event.preventDefault();

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

    if (object.classList.contains('table-round')) {
        bounds.left = 0;
        bounds.right = room.width - obj.width;
        bounds.top = 0;
        bounds.bottom = room.height - obj.height;
    };

    if (state.newPos.x < bounds.left) { state.newPos.x = bounds.left };
    if (state.newPos.x > bounds.right) { state.newPos.x = bounds.right; };
    if (state.newPos.y < bounds.top) { state.newPos.y = bounds.top; };
    if (state.newPos.y > bounds.bottom) { state.newPos.y = bounds.bottom; };

}

// ------ Transform Functions ------

function transformWithKeys(event) {

    const selectedObject = document.querySelector('.selected');

    if (selectedObject && state.mainPageInFocus) {

        const currentPos = {
            x: parseInt(getComputedStyle(selectedObject).left),
            y: parseInt(getComputedStyle(selectedObject).top)
        }

        state.newPos.x = currentPos.x;
        state.newPos.y = currentPos.y;

        const velocity = {
            x: 1,
            y: 1
        }

        const watchKeys = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"];

        if (watchKeys.includes(event.key)) {
            event.preventDefault();
            state.arrowKeysPressed[event.key] = true;
        }

        if (event.key === "z") {
            event.preventDefault();
            rotateCcw();
        }

        if (event.key === "x") {
            event.preventDefault();
            rotateCw();
        }

        if (event.key === "Delete" || event.key === "Backspace") {
            event.preventDefault();
            removeObject();
            return;
        }

        if (state.arrowKeysPressed.ArrowDown) {
            state.newPos.y = currentPos.y + velocity.y;
        }

        if (state.arrowKeysPressed.ArrowUp) {
            state.newPos.y = currentPos.y - velocity.y;
        }

        if (state.arrowKeysPressed.ArrowRight) {
            state.newPos.x = currentPos.x + velocity.x;
        }

        if (state.arrowKeysPressed.ArrowLeft) {
            state.newPos.x = currentPos.x - velocity.x;
        }

        checkBounds(selectedObject);

        selectedObject.style.left = state.newPos.x + "px";
        selectedObject.style.top = state.newPos.y + "px";

    }

}

function resetArrowKeys(event) {

    const selectedObject = document.querySelector('.selected');
    const watchKeys = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"];

    if (selectedObject && state.mainPageInFocus) {
        if (watchKeys.includes(event.key)) {
            state.arrowKeysPressed[event.key] = false;
        }
    }

}

// ------ Print Functions ------

function printClassroom() {
    const classroomHTML = document.querySelector('#classroom-wrapper').innerHTML;
    const win = window.open('', '', 'height=750, width=1000');
    win.document.write('<head>');
    win.document.write('<link rel="stylesheet" href="./styles.css" />')
    win.document.write('<title>Print Classroom Plan</title>');
    win.document.write('</head>');
    win.document.write('<html style="background: none; display: flex; justify-content: center; min-width: 100%; font-family: "Quicksand", sans-serif;"><body>');
    win.document.write('<div id="print-title"><h1>My Classroom Plan</h1></div>');
    win.document.write(classroomHTML);

    const roomElements = win.document.querySelector('#classroom').childNodes;

    roomElements.forEach((element) => {
        element.style.borderColor = "black";
        element.style.cursor = "default";
    });

    win.document.write('</body></html>');
    win.document.close();
    setTimeout(() => { win.print(); }, 1000);
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
    setTimeout(() => { win.print(); }, 1000);
}

// ------ Drawer Functions ------

function collapseDrawer() {

    drawer.style.transition = "top 0.5s ease-out";

    if (state.drawerOpen) {
        drawer.style.top = "calc(100vh - 60px)";
        drawer.style.bottom = 0 + "px";
        collapseDrawerButton.childNodes[0].style.transform = "rotateX(0deg)";
        state.drawerOpen = false;
    } else {
        drawer.style.top = "calc(50vh - 60px)";
        drawer.style.bottom = 0 + "px";
        collapseDrawerButton.childNodes[0].style.transform = "rotateX(-180deg)";
        state.drawerOpen = true;
    }

    setTimeout(() => { drawer.style.transition = "none"; }, 500);

}