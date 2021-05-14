// get attributes
var title = getTitle();
var image = getImage();
var price = getPrice();
// save in local storage
chrome.storage.local.set({ meloddiTitle: title });
chrome.storage.local.set({ meloddiImage: image });
chrome.storage.local.set({ meloddiPrice: price });


function getTitle(){
    var title = document.title;
    return title ? title : "";
}

function getImage(){
    var img = "";
    try {
        var imgMeta = document.querySelector("meta[property='og:image']");
        var imgsrc = imgMeta ? imgMeta.content : "";
        // sometimes the metadata is not a complete link. In that case need to use the src attribute of the image found later in doc
        if (imgsrc.indexOf("http") != 0){
            var actualImg = document.querySelector("img[src*='"+ imgsrc.substr(0, imgsrc.lastIndexOf("/")) + "']");
            img = actualImg ? actualImg.src : "";
        }
	else {
	    img = imgsrc;
	}
    }
    catch(e){
        console.log("unable to obtain images");
    }
    return img;
}

function getPrice(){
    var price = "";
    try {
        var priceMeta = document.querySelector("meta[property='product:price:amount']");
        var price = priceMeta ? priceMeta.content : "";
    }
    catch(e){
        console.log("unable to obtain price")
    }
    return price.indexOf("$") == 0 ? "$" + price : price;
}


/*var xpath = "//body//*[contains(text(),'$')]";
var matchingElements = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
var target = null;
try {
    var	el = matchingElements.iterateNext();
    while (el && (el.tagName == "SCRIPT" || el.tagName == "OPTION"))
    {
        el = matchingElements.iterateNext();
	alert(el.tagName);
    }
    target = el;


}
catch(e) {
    console.log("Unable to iterate over result set");
}

var price = target? target.innerText : null;
alert("price" + price);
*/
