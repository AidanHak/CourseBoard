function writeStudentData(sid, semail, sname) {
	firebase.database().ref('students/' + sid).set({
		email: semail,
		name: sname,
	});
}

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
		// ...
	} else {
		// User is signed out.
		// ...
	}
});