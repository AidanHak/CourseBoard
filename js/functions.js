initialCheck();

$('#forgotpw').click(function(e) {
	e.preventDefault();
	sendPasswordReset(firebase.auth().currentUser.email);
});

$('#signout').click(function(e) {
	e.preventDefault();
	signOutUser();
});

function initialCheck() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in and currentUser will no longer return null.
			if (location.href.indexOf('login.html') !== -1 || location.href.indexOf('register.html') !== -1) {
				window.location.href = 'index.html?logged_in';
			} else if (location.href.indexOf('profile.html') !== -1) {
				$('h1.page-header').append(' ' + getName() + '!');
			}
			getCourses();

			if (!user.emailVerified) {
				sendEmailVerification();
			}

			if (user.displayName === null) {
				updateName(prompt('What is your name?'));
			}
		} else {
			// No user is signed in.
			if(location.href.indexOf('login.html') === -1 && location.href.indexOf('register.html') === -1) {
				window.location.href = 'login.html?not_logged_in';
			}
		}
	});
}

/*
 ** Helper function to:
 ** dbResult
 */
function retrieveFrom(path, callback, after) {
	firebase.database().ref(path).once('value', function(snap) {
		callback(snap.val());
	}).then(function() {
		after();
	});
}

function dbResult(path, result, after) {
	retrieveFrom(path, function(data) {
		$.each(data, function (index, item) {
			result(index, item);
		});
	}, function() {
		after();
	});
}

function getCourses() {
	dbResult('/students/' + getUID() + '/courses/', function(key, value) {
		$('li#courses ul').append('<li class="' + key + '"><a href="courses.html?cid=' + key + '">' + key + '</li>');
		getCourseInfo(key);
	}, function() {
		if ($('li#courses ul li').length > 0) {
			$('li#courses > a').append('<span class="fa arrow"></span>');
			$('li#courses ul').prepend('<li><a href="courses.html">All Courses</a></li>');
		}
	});
}

function getCourseInfo(cid) {
	dbResult('/courses/' + cid, function(key, value) {
		if ($('tr.' + cid).length === 0) {
			$('#allcourses-table tbody').append('<tr class="' + cid + '"><td class="ctitle"></td><td class="cloc"></td><td class="cdays"></td><td class="cdesc"></td></tr>');
		}

		if (key === 'title') {
			$('li.' + cid + ' a').html(value);
			$('tr.' + cid + ' td.ctitle').text(value);
		} else if (key === 'location') {
			$('tr.' + cid + ' td.cloc').text(value);
		} else if (key === 'days') {
			console.log(value);
			var $days = '';
			$.each(value, function(data) {
				$days += data.charAt(0).toUpperCase() + data.slice(1) + ', ';
			});
			$('tr.' + cid + ' td.cdays').append($days);
		} else if (key === 'description') {
			$('tr.' + cid + ' td.cdesc').text(value);
		}
	}, function() {
		// Callback to retrieving DB data
	});
}
/*dbResult('/students/', function(index, item) {

}, function(){
	//if you want to do something after the above function executes
});*/

/*
 ** Helper function to:
 ** createNewStudent
 */
function writeStudentData() {
	firebase.database().ref('students/' + getUID()).set({
		email: firebase.auth().currentUser.email,
		name: firebase.auth().currentUser.displayName
	});
}

/*
 ** Function purpose:
 ** Registration - register new student
 ** register.html
 **
 ** Required input:
 ** Email, password, name
 */
function createNewStudent(email, password, name) {
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorMessage);
	});
	writeStudentData();
}

/*
 ** Function purpose:
 ** Login - authenticate existing user (student / professor)
 ** login.html
 **
 ** Required input:
 ** Email, password
 */
function signInExistingUser(email, password) {
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorMessage);
	});
}

/*
 ** Function purpose:
 ** Logout - sign out existing user (student / professor)
 **
 ** Output:
 ** Redirect to login.html?logged_out
 */
function signOutUser() {
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		// Redirect to login or main page.
		window.location.href = 'login.html?logged_out';
	}).catch(function(error) {
		// An error happened.
	});
}

/*
 ** Function purpose:
 ** Verification - send the user an email to verify their account
 **
 ** Output:
 ** Alert
 */
function sendEmailVerification() {
	firebase.auth().currentUser.sendEmailVerification().then(function() {
		// Email sent.
		alert('Verification email has been sent.');
	}).catch(function(error) {
		// An error happened.
	});
}

/*
 ** Function purpose:
 ** Reset password
 **
 ** Required input:
 ** Email
 **
 ** Output:
 ** Alert
 */
function sendPasswordReset(emailAddress) {
	firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
		// Email sent.
		alert('Password reset email has been sent.');
	}).catch(function(error) {
		// An error happened.
	});
}

/*
 ** Function purpose:
 ** User data - access information about the existing user
 ** i.e. email, name, uid (user ID)
 */
function getEmail() {
	return firebase.auth().currentUser.email;
}

function getName() {
	return firebase.auth().currentUser.displayName;
}

function getUID() {
	return firebase.auth().currentUser.uid;
}