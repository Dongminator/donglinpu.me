
var testobj;

var AddInput; // $("#addInput").val();
var TodoIncompleteDiv; // $("#ToDoListIncomplete ul");
var TodoCompletedDiv; // $("#ToDoListCompleted ul");
var ShoppingDiv; // $("#ShoppingList ul");


var UserId;

var FbToken = "";

// jquery 3.0 recommended syntax
$(function() {
	// At this point, Facebook SDK may still be loading.
	// run page loading animation here. 
	console.log("page is loaded...");
//	$('#toggle').click(function() {
//		$('.circle-loader').toggleClass('load-complete');
//		$('.checkmark').toggle();
//	});

});

// After FB SDK is loaded, this is run. 
function CheckLogin () {
	console.log("checking login...");
	ToggleLoader (true, $(".fb-login-button"));
	FB.getLoginStatus(function(response) {
		console.log(response);
		if (response.status === 'connected') {
			FbToken = response.authResponse.accessToken;
			Authenticated ();
		} else {
			NotLoggedIn();
		}
	}, true);
}


// show/hide loader
function ToggleLoader (toEnable, selector, callback) {
	var loader = $('.circle-loader');
	var loaderParent = loader.parent();
	
	if (toEnable && loaderParent.hasClass("d-none")) {
		// show loading
		loaderParent.removeClass("d-none").addClass("d-flex");
		selector.addClass("d-none");
		loader.toggleClass('load-complete');
	} else if ( !toEnable && loaderParent.hasClass("d-flex")) {
		// hide loading bar
		loader.on('transitionend webkitTransitionEnd oTransitionEnd', function (e) {
			if (e.originalEvent.propertyName == "visibility") {
				loaderParent.removeClass("d-flex").addClass("d-none");
				selector.removeClass("d-none");
				if (callback) {
					callback();
				}
			}
		});
		loader.toggleClass('load-complete');
	}
}


function Authenticated () {
	console.log("authenticated.");
	// get data. once data is loaded, run callback.
	LoadList(function (data) {
		console.log("proceed with content.");
		// TODO: potential BUG: data emtpy.
		var todo = data.todo;
		
		var todoCompleted = $.grep(todo, function(n,i){ return n.done });
		var todoIncomplete = $.grep(todo, function(n,i){ return !n.done });

		var shopping = data.shopping;
		
		// create section for todo
		/*
			<ul class="list-group">
			  <li class="list-group-item">Cras justo odio</li>
			</ul>
		 */
		
		InitUi ();
		$(".fb-login-button").remove();
		$("#fb-logout-btn").removeClass("d-none").click(function(){
			FbLogout();
		});
		
		ToggleLoader (false, $(".content"), function(){
			$.each(todoIncomplete, function(i, item) {
				populateList (item.name, item.done, TodoIncompleteDiv);
			});
			
			$.each(todoCompleted, function(i, item) {
				populateList (item.name, item.done, TodoCompletedDiv);
			});
			
			// create section for shopping
		});
		
	});
}

function NotLoggedIn () {
	console.log("NOT logged in. Making login button visible...");
	ToggleLoader (false, $(".fb-login-button"), function(){
		$(".fb-login-button").addClass("d-flex");
	});
}

function FbLogout() {
	console.log("logging out fb...");
	FB.logout(function(response) {
		// Person is now logged out
		console.log(response);
		window.location.reload();
	});
}

function InitUi () {
	var mySVGsToInject = document.querySelectorAll('.iconic-sprite');
    SVGInjector(mySVGsToInject);
    
	AddInput = $("#addInput");
	TodoIncompleteDiv = $("#ToDoListIncomplete ul");
	TodoCompletedDiv = $("#ToDoListCompleted ul");
	ShoppingDiv = $("#ShoppingList ul");
}


/*
 * this method retrieves both todo list and shopping list from DB
 * After list is back from DB
 * - remove loading
 * - remove fb login button
 * - update FB Logout link action
 * - remove d-none on content
 */
function LoadList (callback) {
	// query {"user.id":1}
	getByUserId(UserId, function(data){
		UserId = data._id;
		callback(data);
	});
}

/*
 * Add an item to the list.
 */
function populateList (name, status, div) {
	var li = $("<li>").addClass("list-group-item d-flex justify-content-between align-items-center").text(name);
	var buttonDiv = $("<div>");
	
	// change status button
	var statusButton = $("<button>").addClass("btn pt-0 pb-0");
	statusButton.click(function (e) {
		ToggleListItem(e);
	});
	
	var statusImg = $("<img>").addClass("iconic-sprite").attr("src","/static/open-iconic/svg/circle-check.svg");
	statusButton.append(statusImg);
	buttonDiv.append(statusButton);
	
	if (status == true) {
		statusImg.addClass("icon-circle-check-true");
		li.addClass("disabled");
	} else {
		statusImg.addClass("icon-circle-check-false");
	}

	// delete button
	var deleteButton = $("<button>").addClass("btn pt-0 pb-0");
	deleteButton.click(function (e) {
		DeleteListItem(e);
	});

	var deleteImg = $("<img>").addClass("iconic-sprite").attr("src","/static/open-iconic/svg/trash.svg");
	deleteButton.append(deleteImg);
	buttonDiv.append(deleteButton);
	
	li.append(buttonDiv);
	div.append(li);
	
	// inject only after dom has this item.
	SVGInjector(statusImg);
	SVGInjector(deleteImg);
}

/*
 * save data in db,
 * once save is confirmed, add item to list in ui, clear text in input
 */
function addClicked() {
	var addText = AddInput.val();
	// add to database
	InsertToList(addText, InsertToListSuccess, InsertToListFail);
}

function InsertToList(dataToSave, callBackSuccess, callBackFail) {
	var postReqData = {
			user:UserId, 
			name:dataToSave,
			done:false
	};
	
	$.post(
			"saveItem",
			postReqData,
			function(data){
				callBackSuccess(data);
			}
	)
	.fail(function() {
		callBackFail();
	});
}


function InsertToListSuccess (data) {
	console.log("InsertToListSuccess");
	
	if (data == "successfully inserted") {
		populateList(AddInput.val(), false, TodoIncompleteDiv);
		AddInput.val("");
	} else {
		console.log("failed, see error:");
		console.log(data);
	}
}

function InsertToListFail () {
	console.log("InsertToListFailed");
}

function ToggleListItem(e) {
	var target = $( e.target );
	
	var parentLi = target.closest("li");
	var parentSvg = target.closest("svg");
	var itemName = parentLi.text().trim();
	
	if (target.is("button")) {
		parentSvg = target.find("svg");
	} else if (target.is("svg")) {
		parentSvg = target;
	}
	
	// done
	if (parentSvg.hasClass("icon-circle-check-true")) {
		DbUpdateStatus (itemName, false, function(){
			
			parentLi.removeClass("disabled"); // text style
			
			// Set Icon Style
			parentSvg.removeClass("icon-circle-check-true");
			parentSvg.addClass("icon-circle-check-false");
			
			// move <li> to NOT DONE
			parentLi.detach().appendTo(TodoIncompleteDiv);
			
		}, function () {
			console.log("failed to update in DB");
		});
		
	} else {
		// not done
		DbUpdateStatus (itemName, true, function(){
			
			parentLi.addClass("disabled");  // text style
			
			// Set Icon Style
			parentSvg.removeClass("icon-circle-check-false");
			parentSvg.addClass("icon-circle-check-true");
			
			// move <li> to DONE
			parentLi.detach().appendTo(TodoCompletedDiv);
			
		}, function () {
			console.log("failed to update in DB");
		});
		
	}
}


function DbUpdateStatus (item, status, callBackSuccess, callBackFail) {
	var postReqData = {
			user:UserId, 
			name:item,
			done:status
	};
	$.post(
			"updateStatus",
			postReqData,
			function(data){
				callBackSuccess(data);
			}
	)
	.fail(function() {
		callBackFail();
	});
}

function DeleteListItem (e) {
	var target = $( e.target );
	
	var parentLi = target.closest("li");
	
	// get the name of the item to be deleted
	var itemName = parentLi.text().trim();
	
	DbDeleteItem (itemName, function(data){
		// remove item from UL
		parentLi.remove();
		console.log(data);
	}, function () {
		console.log("failed to delete item in DB");
	});
}

function DbDeleteItem (item, callBackSuccess, callBackFail) {
	var postReqData = {
			user:UserId, 
			name:item
	};
	
	$.post(
			"deleteItem",
			postReqData,
			function(data){
				callBackSuccess(data);
			}
	)
	.fail(function() {
		callBackFail();
	});
}


function getByUserId (id, callback) {
	var postReqData = {
			userId: id,
			token:FbToken
	};

	$.post( 
			"getByUserId", 
			postReqData,
			function(data) {
				callback(data);
			});
}

