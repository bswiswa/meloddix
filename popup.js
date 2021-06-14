var titleElement = document.getElementById("productTitle");
var priceElement = document.getElementById("productPrice");
var quantityElement = document.getElementById("productQuantity");
var imageElement = document.getElementById("productImage");
var urlElement = document.getElementById("productURL");
var colorElement = document.getElementById("productColor");
var sizeElement = document.getElementById("productSize");
var notesElement = document.getElementById("productNotes");

// create custom event that we can manually dispatch when we update popup values via JS
const inputChangeEvent = new Event('inputchange');
// add event handlers to the title input that checks for existence
titleElement.addEventListener('inputchange', validateTitle, false);
titleElement.addEventListener('input', validateTitle, false);
// add event handlers to the price input that keeps the $ and checks for valid numbers
priceElement.addEventListener('inputchange', validatePrice, false);
priceElement.addEventListener('input', validatePrice, false);
// add event handlers to the quantity input that check for valid numbers
quantityElement.addEventListener('inputchange', validateQuantity, false);
quantityElement.addEventListener('input', validateQuantity, false);

//clean up local storage
cleanUpLocalStorage();

/* Create a set for special sites - frequently visited by customers so that we can guarantee performance and results
   This is also because not all sites provide product details in the meta data
   Each entry in the dictionary contains the css selectors for the different attributes in an array: [0 - productTitle, 1 - productPrice, 2 - productQuantity, 3 - productImage]
*/
var HARD_CODED_URLS = new Set([
    "amazon", "target", "buybuybaby",
    "babylist", "etsy", "potterybarnkids",
    "crateandbarrel", "walmart"
]);

// listen for messages between popup and tab
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse){
    if (request.message == "setTitle"){
        titleElement.value = request.payload;
        titleElement.dispatchEvent(inputChangeEvent);
    }
    if (request.message == "setPrice"){
        priceElement.value = request.payload;
        priceElement.dispatchEvent(inputChangeEvent);
    }
    if (request.message == "setQuantity")
    {
        quantityElement.value = request.payload;
        quantityElement.dispatchEvent(inputChangeEvent);
    }   
    if (request.message == "setImage")
	    imageElement.src = request.payload;
    if (request.message == "setSize")
	    sizeElement.value = request.payload;
    if (request.message == "setColor")
	    colorElement.value = request.payload;
});

// get attributes and update popup
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var title = "", image = "", price = "", url = tabs[0].url;
    urlElement.value = url;
    /*
      get name of server -> it is in the second position after splitting the url 
      eg https://www.amazon.com => get 'amazon'
    */
    var server = url.split(".")[1];

    if(HARD_CODED_URLS.has(server)){
	// store server in local storage
	chrome.storage.local.set({ server: server }, function(){
	    // get product attributes. The popup will be updated by the listeners above in response
	    chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ["hardCodedBookmarkLoader.js"] });
	});
    }
    else {
	// get product attributes using metadata. The popup will be updated by the listeners above in response
	chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ["metadataBookmarkLoader.js"] });
    }
});

async function cleanUpLocalStorage(){
    // reset local storage
    await chrome.storage.local.clear();

}

function validateTitle(e){
    let text = e.target.value;
    // test if valid title (not just spaces or empty)
    let re = /[a-zA-Z0-9]+/
    if (re.test(text) == false)
        e.target.classList.add("invalid");
    else
        e.target.classList.remove("invalid");
}

function validatePrice(e){
    let text = e.target.value;
    // force price to start with $
    if(text.charAt(0) != '$')
    {
        text = "$" + text;
        e.target.value = text;
    }
    // test if valid price
    let re = /^\$\d+\.*\d*$/
    if (re.test(text) == false)
        e.target.classList.add("invalid");
    else
        e.target.classList.remove("invalid");
}

function validateQuantity(e){
    let text = e.target.value;
    // test if valid quantity (number)
    let re = /^\d+$/
    if (re.test(text) == false)
        e.target.classList.add("invalid");
    else
        e.target.classList.remove("invalid");
}