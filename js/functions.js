function isLoggedIn() {
	return firebase.auth().currentUser !== null;
}

function writeStudentData(sid, semail, sname, smajor, gpa, year) {
	firebase.database().ref('students/' + sid).set({
		sid: sid,
		email: semail,
		name: sname,
		major: smajor,
		gpa: gpa,
		year: year
	});
}

function setGPA(gpa) {
	firebase.database().ref('students/' + sid).set({
		gpa: gpa
	});
}

function changeMajor(major) {
	firebase.database().ref('students/' + sid).set({
		major: major
	});
}

function writeProfessorData(pid, pemail, pname, pdept) {
	firebase.database().ref('professor/' + pid).set({
		pid: pid,
		email: pemail,
		name: pname,
		department: pdept
	});
}

// Registration page
function createNewStudent(email, password, name, callback) {
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorCode + ': ' + errorMessage);
	});
	var sid = Math.floor(Math.random() * 9000000) + 1000000;
	writeStudentData(sid, email, name, '', '', '');
	updateName(name);
	sendEmailVerification();
	callback();
}

// Professor will not be created by registering, only from backend/DB
/*function createNewProfessor(email, password, name, department) {
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
	});
	var pid = Math.floor(Math.random() * 9000000) + 1000000;
	writeProfessorData(pid, email, name, department);
}*/

// Login page
function signInExistingUser(email, password) {
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorCode + ': ' + errorMessage);
	});
	if (isLoggedIn()) {
		window.location.href = 'index.html';
	}
}

function signOutUser() {
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		// Redirect to login or main page.
		window.location.href = 'login.html?logged_out';
	}).catch(function(error) {
		// An error happened.
	});
}

function sendEmailVerification() {
	firebase.auth().currentUser.sendEmailVerification().then(function() {
		// Email sent.
	}).catch(function(error) {
		// An error happened.
	});
}

function sendPasswordReset(emailAddress) {
	var auth = firebase.auth();

	auth.sendPasswordResetEmail(emailAddress).then(function() {
		// Email sent.
	}).catch(function(error) {
		// An error happened.
	});
}

function updateName($name) {
	firebase.auth().currentUser.updateProfile({
		displayName: $name
	}).then(function() {
		// Update successful.
		alert('Your name has successfully been changed to ' + $name);
	}).catch(function(error) {
		// An error happened.
	});
}

function getName() {
	return firebase.auth().currentUser.displayName;
}

function getEmail() {
	return firebase.auth().currentUser.email;
}

function isVerified() {
	return firebase.auth().currentUser.emailVerified;
}

function initialCheck() {
	if (isLoggedIn()) {
		// User is signed in.
		console.log('is logged in is true');
		if (location.href.indexOf('login.html') !== -1 || location.href.indexOf('register.html') !== -1) {
			console.log('try to access login/register when already logged in, send to index');
			//window.location.href = 'index.html?logged_in';
		}
	} else {
		// User is signed out.
		console.log('is not logged in')
		if(location.href.indexOf('login.html') === -1 && location.href.indexOf('register.html') === -1) {
			console.log('trying to access a page that isn\'t the login or register page, send to login');
			//window.location.href = 'login.html?not_logged_in';
		}
	}
}

initialCheck();