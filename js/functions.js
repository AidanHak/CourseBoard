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
function createNewStudent(email, password, name, major, ) {
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
	});
	writeStudentData('sid', email, )
}

// Login page
function signInExistingUser(email, password) {
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
	});
}

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// User is signed in.
		var displayName = user.displayName;
		var email = user.email;
		var emailVerified = user.emailVerified;
		var photoURL = user.photoURL;
		var isAnonymous = user.isAnonymous;
		var uid = user.uid;
		var providerData = user.providerData;
	} else {
		// User is signed out.
	}
	console.log('accessing user info...');
	console.log(user);
});