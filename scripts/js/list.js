

var GlobalList = 
{
		"todo": [{
			"name": "buy something",
			"done": "false"
		},{
			"name": "something else",
			"done": "false"
		},{
			"name": "yes",
			"done": "true"
		},{
			"name": "no",
			"done": "false"
		}],

		"shopping": {
			"curr": [1,2,3,4],
			"all": {
				"1": "apple",
				"2": "milk"
			}
		}
};

var AddInput; // $("#addInput").val();

var UserId = 1;

// jquery 3.0 recommended syntax
$(function() {
	console.log("ready");
	
	initUi ()
	
	loadList();
});

function initUi () {
	var mySVGsToInject = document.querySelectorAll('.iconic-sprite');
    SVGInjector(mySVGsToInject);
    
	AddInput = $("#addInput");
}


/*
 * this method retrieves both todo list and shopping list from DB
 */
function loadList () {
	
	// query {"user.id":1}
	getByUserId(UserId, function(data){
		console.log(data);
		
		// todo: chec3k [0]
		// TODO: potential BUG: data emtpy.
		var todo = data[0].todo;
		var shopping = data[0].shopping;
		
		// create section for todo
		/*
	<ul class="list-group">
	  <li class="list-group-item">Cras justo odio</li>
	  <li class="list-group-item">Dapibus ac facilisis in</li>
	  <li class="list-group-item">Morbi leo risus</li>
	  <li class="list-group-item">Porta ac consectetur ac</li>
	  <li class="list-group-item">Vestibulum at eros</li>
	</ul>
		 */

		var todoDiv = $("#ToDoList ul");
		var shoppingDiv = $("#ShoppingList ul");
		
		$.each(todo, function(i, item) {
			populateList (item.name, item.done, todoDiv);
		});
		
		// create section for shopping
		
	});
}

/*
 * Add an item to the list.
 */
function populateList (name, status, div) {
	var li = $("<li>").addClass("list-group-item d-flex justify-content-between align-items-center").text(name);
	
	var button = $("<button>").addClass("btn");
	button.click(function (e) {
		ToggleListItem(e);
	});
	
	var img = $("<img>").addClass("iconic-sprite").attr("src","/static/open-iconic/svg/circle-check.svg");
	
	button.append(img);
	li.append(button);
	
	if (status == true) {
		img.addClass("icon-circle-check-true");
		li.addClass("disabled");
	} else {
		img.addClass("icon-circle-check-false");
	}

	div.append(li);
	
	// inject only after dom has this item.
	SVGInjector(img);
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
		populateList(AddInput.val(), false, $("#ToDoList ul"));
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
		console.log("clicked DONE");
		DbUpdateStatus (itemName, false, function(){
			parentLi.removeClass("disabled");
			parentSvg.removeClass("icon-circle-check-true");
			parentSvg.addClass("icon-circle-check-false");
		}, function () {
			console.log("failed to update in DB");
		});
		
	} else {
		// not done
		console.log("clicked TO DO");
		DbUpdateStatus (itemName, true, function(){
			parentLi.addClass("disabled");
			parentSvg.removeClass("icon-circle-check-false");
			parentSvg.addClass("icon-circle-check-true");
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

function getTest() {
	$.get( "getItems", function(data) {
		console.log(data);
	});
}

function getAll() {
	$.get( "getAll", function(data) {
		console.log(data);
	});
}

function getByUserId (id, callback) {
	$.get( "getByUserId/" + id, function(data) {
		console.log(data);
		callback(data);
	});
}

