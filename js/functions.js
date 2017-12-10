initialCheck();

$('#forgotpw').click(function(e) {
	e.preventDefault();
	sendPasswordReset(firebase.auth().currentUser.email);
});

$('#signout').click(function(e) {
	e.preventDefault();
	signOutUser();
});

$(document).on('click', '#allcourses-table tbody td.join_course button.join_course_button', function(e) {
	e.preventDefault();
	joinCourse($(this).closest('tr').attr('class'));
	$(this).parent().html('<button type="button" class="btn btn-danger btn-xs leave_course_button" style="text-align:center;">Leave</button>');
});

$(document).on('click', '#allcourses-table tbody td.join_course button.leave_course_button', function(e) {
	e.preventDefault();
	if (confirm('Are you sure you want to leave this course?')) {
		leaveCourse($(this).closest('tr').attr('class'));
		$(this).parent().html('<button type="button" class="btn btn-primary btn-xs join_course_button" style="text-align:center;">Join</button>');
	}
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
			getStudentCourses();

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

function retrieveFromSorted(path, sortBy, callback, after) {
	firebase.database().ref(path).orderByChild(sortBy).once('value', function(snap) {
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

dbResultSorted(path, sortBy, result, after) {
	retrieveFromSorted(path, sortBy, function(data) {
		$.each(data, function (index, item) {
			result(index, item);
		});
	}, function() {
		after();
	});
}

function getStudentCourses() {
	dbResult('/students/' + getUID() + '/courses/', function(key, value) {
		$('li#courses ul').append('<li class="' + key + '"><a href="courses.html?cid=' + key + '">' + key + '</li>');
		getStudentCourseInfo(key);
	}, function() {
		if ($('li#courses ul li').length > 0) {
			$('li#courses > a').append('<span class="fa arrow"></span>');
			$('li#courses > a').html($('li#courses > a').html().replace('Courses', 'Your Courses'));
			$('li#courses ul').prepend('<li><a href="courses.html">All Courses</a></li>');
		}
	});
}

function getAllCourses() {
	dbResult('/courses/', function(key, value) {
		getAllCoursesInfo();
	}, function() {
		// Callback to retrieving DB data
	});
}

/*
 ** Helper function to:
 ** getStudentCourses
 */
function getStudentCourseInfo(cid) {
	dbResult('/courses/' + cid, function(key, value) {
		if (key === 'title') {
			$('#side-menu #courses ul li.' + cid + ' a').html(value);
		}
	}, function() {
		// Callback to retrieving DB data
	});
}

/*function getCourseAnnouncements(cid) {
	var anouncements = {};
	dbResult('/courses/' + cid + '/announcements/', function(key, value) {
		anouncements[key] = true;
	}, function() {
		console.log(announcements);
		//getAnnouncements(announcements);
	});
}*/

function getAnnouncements(cid) {
	$('h1.page-header').text('Announcements');
	dbResultSorted('/announcements/', 'submittedDate', function(key, value) {
		if (value['course'] === cid) {
			$('#page-wrapper').append('<div class="row announcement"><div class="col-lg-12"><div class="panel panel-default"><div class="panel-heading">' + value['title'] + '<br />Submitted on <span class="announcement_date" style="font-size:smaller;">' + value['submittedDate'] + '</span></div><div class="panel-body">' + value['description'] + '</div></div></div>');
		}
		/*dbResult('/courses/' + value['course'] + '/announcements/', function(key2, value2) {
			if (key === key2) {
				$('#page-wrapper').append('<div class="row announcement"><div class="col-lg-12"><div class="panel panel-default"><div class="panel-heading">' + value['title'] + '<br />Submitted on <span class="announcement_date" style="font-size:smaller;">' + value['submittedDate'] + '</span></div><div class="panel-body">' + value['description'] + '</div></div></div>');
			}
		}, function() {
			var announcements = $('#page-wrapper div.announcement').detach();
			announcements.sort(function(a, b) {
				return new Date($(b).find('div.announcement_date').text()) - new Date($(a).find('div.announcement_date').text())
			});
			$('#page-wrapper').append(announcements.get().reverse());
		});*/
	}, function() {
		// Callback to retrieving DB data
		var announcements = $('#page-wrapper div.announcement').detach();
		announcements.sort(function(a, b) {
			return new Date($(b).find('div.announcement_date').text()) - new Date($(a).find('div.announcement_date').text())
		});
		$('#page-wrapper').append(announcements.get().reverse());
	});
}

/*
 ** Helper function to:
 ** getAllCourses
 */
function getAllCoursesInfo() {
	dbResult('/courses/', function(key, value) {
		var cid = key;
		if ($('#allcourses-table tbody tr.' + cid).length === 0) {
			$('#allcourses-table tbody').append('<tr class="' + cid + '"><td class="join_course" style="text-align:center;"><button type="button" class="btn btn-primary btn-xs join_course_button">Join</button></td><td class="ctitle"></td><td class="cloc"></td><td class="cdays"></td><td class="starttime"></td><td class="endtime"></td><td class="cdesc"></td></tr>');
			isStudentTakingCourse(cid);
		}

		$.each(value, function(courseAttr, val) {
			if (courseAttr === 'title') {
				$('#allcourses-table tbody tr.' + cid + ' td.ctitle').html('<a href="courses.html?cid=' + cid + '">' + val + '</a>');
				$('h1.page-header').text('All Courses');
			} else if (courseAttr === 'location') {
				$('#allcourses-table tbody tr.' + cid + ' td.cloc').text(val);
			} else if (courseAttr === 'days') {
				var $days = '';
				$.each(val, function(data) {
					$days += data.charAt(0).toUpperCase() + data.slice(1) + ', ';
				});
				$days = $days.substring(0, $days.length - 2);
				$('#allcourses-table tbody tr.' + cid + ' td.cdays').text($days);
			} else if (courseAttr === 'description') {
				$('#allcourses-table tbody tr.' + cid + ' td.cdesc').text(val);
			} else if (courseAttr === 'endTime') {
				$('#allcourses-table tbody tr.' + cid + ' td.endtime').text(val);
			} else if (courseAttr === 'startTime') {
				$('#allcourses-table tbody tr.' + cid + ' td.starttime').text(val);
			}
		});
	}, function() {
		// Callback to retrieving DB data
	});
}

function joinCourse(cid) {
	var uid = getUID();
	var updates = {};
	updates['/courses/' + cid + '/students/' + uid] = true;
	updates['/students/' + uid + '/courses/' + cid] = true;
	firebase.database().ref().update(updates);
}

function leaveCourse(cid) {
	var uid = getUID();
	var updates = {};
	updates['/courses/' + cid + '/students/' + uid] = null;
	updates['/students/' + uid + '/courses/' + cid] = null;
	firebase.database().ref().update(updates);
}

function createAssignment(cid, aid) {
	var updates = {};
	updates['courses/' + cid + '/assignments/' + aid] = true;
	updates['assignments/' + aid + '/courses/' + cid] = true;
	firebase.database().ref().update(updates);
}

/*
 ** Helper function to:
 ** getAllCoursesInfo
 */
function isStudentTakingCourse(cid) {
	var uid = getUID();
	dbResult('/courses/' + cid + '/students/', function(key, value) {
		if (key === uid) {
			$('#allcourses-table tbody tr.' + cid + ' td.join_course').html('<button type="button" class="btn btn-danger btn-xs leave_course_button" style="text-align:center;">Leave</button>');
		}
	}, function() {
		// Callback to retrieving DB data
	});
}

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