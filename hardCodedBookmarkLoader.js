// dictionary of hard coded css selectors
var HARD_CODED_CSS_SELECTORS = {
    amazon: ["#productTitle", "#priceblock_ourprice", "#quantity", "#landingImage"],
    target: ["h1[data-test=product-title] > span", "div[data-test=product-price]", "butt\
on[data-test=custom-quantity-picker] > div > div > span", "a[data-test=carousel-image] *\
 img"],
    buybuybaby: ["h1[data-locator=pdp-productnametext]", "span[data-locator=pdp-pricetext]", "button[id=qtySelect-button] > span", "div[class*=ProductMediaCarouselStyle] > img"],
    babylist: ["h1[class*=productName] > span[itemprop=name]", "span[itemprop=price]", "input[name=quantity]", "div[class*=product-images] > img"],
    etsy: ["h1[data-buy-box-listing-title=true]", "div[data-buy-box-region=price] * p", "#zNOSUCHELEMENT", "li[data-palette-listing-image] > img"],
    potterybarnkids: ["div[class=pip-summary] > h1", "span[class=product-price] * span[class=price-amount]", "input[aria-label=Quantity]", "img#hero"],
    crateandbarrel: ["h1[class*=product-name]", "span[class*=regPrice]", "div[class=compound-quantity] > input", "div[class=gallery-main-image] * img"],
    walmart: ["h1[class*=prod-ProductTitle]", "span[class*=price] > span[class=visuallyhidden]", "select[aria-label=Quantity]", "img[data-tl-id=ProcuctPage-primary-image]"]
};

// get server
chrome.storage.local.get("server", function({ server }){
    // get attributes
    var cssSelectors = HARD_CODED_CSS_SELECTORS[server];
    var title = getValue(cssSelectors[0]);
    var price = getValue(cssSelectors[1]);
    if (price.indexOf("$") != 0)
	price = "$" + price; 
    var quantity = getValue(cssSelectors[2]);
    var image = getImageSource(cssSelectors[3]);
    
    chrome.runtime.sendMessage({ message: "setTitle", payload: title });
    chrome.runtime.sendMessage({ message: "setPrice", payload: price });
    chrome.runtime.sendMessage({ message: "setQuantity", payload: quantity || "1" });
    chrome.runtime.sendMessage({ message: "setImage", payload: image });
});

function getValue(cssSelector){
    el = document.querySelector(cssSelector);
    if (el){
        if (el.value) return (el.value + "").trim();
        else return el.innerText.trim();
    }
    else return "";
}

function getImageSource(cssSelector){
    var img = document.querySelector(cssSelector);
    return img ? img.src : "";
}


