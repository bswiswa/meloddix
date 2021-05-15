// reset local storage
chrome.storage.local.set({meloddiTitle: ""});
chrome.storage.local.set({meloddiImage: ""});
chrome.storage.local.set({meloddiPrice: ""});

var titleElement = document.getElementById("productTitle");
var priceElement = document.getElementById("productPrice");
var quantityElement = document.getElementById("productQuantity");
var imageElement = document.getElementById("productImage");
var urlElement = document.getElementById("productURL");

// get attributes and update popup
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ["bookmarkLoader.js"] }, function() {
	var title = "", image = "", price = "", url = tabs[0].url;
	new Promise(
	    function(resolve, reject){
		chrome.storage.local.get(["meloddiTitle", "meloddiImage", "meloddiPrice"], function(data){
		    title = data.meloddiTitle;
		    image = data.meloddiImage;
		    price = data.meloddiPrice;
		    resolve({ title, image, price });
		});
	    }).then(function(data) {
		titleElement.value = data.title;
		priceElement.value = data.price;
		imageElement.src = data.image;
		quantityElement.value = 1; // qty defaults to 1
		urlElement.value = url;
		
	    });
    });
});
