var displayName;

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
function createNewStudent(email, password, name, major, gpa, year) {
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
	});
	var sid = Math.floor(Math.random() * 9000000) + 1000000;
	writeStudentData(sid, email, name, major, gpa, year);
}

function createNewProfessor(email, password, name, department) {
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
	});
	var pid = Math.floor(Math.random() * 9000000) + 1000000;
	writeProfessorData(pid, email, name, department);
}

// Login page
function signInExistingUser(email, password) {
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
	});
}

function signOutUser() {
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		// Redirect to login or main page.
		window.location = 'login.html';
	}).catch(function(error) {
		// An error happened.
	});
}

function checkUser() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			var providerData = user.providerData;
			if (location.href.indexOf('login.html') !== -1 || location.href.indexOf('register.html') !== -1) {
				//window.location = 'index.html';
			}
			alert('Hello ' + displayName + '!');
			console.log(user);
		} else {
			// User is signed out.
			window.location = 'login.html';
		}
	});
}

checkUser();