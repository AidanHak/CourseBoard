var $user = firebase.auth().currentUser;

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
	});
}

function signOutUser() {
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		// Redirect to login or main page.
		window.location = 'login.html?logged_out';
	}).catch(function(error) {
		// An error happened.
	});
}

function checkUser() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			$user = user;
			var displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			var providerData = user.providerData;
			if (location.href.indexOf('login.html') !== -1 || location.href.indexOf('register.html') !== -1) {
				console.log('try to access login/register when already logged in, send to index');
				window.location = 'index.html?logged_in';
			}
			alert('Hello ' + user.displayName + '!');
			console.log($user);
		} else {
			// User is signed out.
			window.location = 'login.html?not_logged_in';
		}
	});
}

function sendEmailVerification() {
	$user.sendEmailVerification().then(function() {
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
	user.updateProfile({
		displayName: $name
	}).then(function() {
		// Update successful.
	}).catch(function(error) {
		// An error happened.
	});
}

//checkUser();