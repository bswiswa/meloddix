// get server
chrome.storage.local.get("server", function({ server }){
    // get attributes
    var selector = getSelectors(server);
    var title = selector.title();
    var price = selector.price();
    if (price.indexOf("$") != 0)
	price = "$" + price; 
    var quantity = selector.quantity();
    var image = selector.image();
    var size = selector.size();
    var color = selector.color();
    
    chrome.runtime.sendMessage({ message: "setTitle", payload: title });
    chrome.runtime.sendMessage({ message: "setPrice", payload: price });
    chrome.runtime.sendMessage({ message: "setQuantity", payload: quantity || "1" });
    chrome.runtime.sendMessage({ message: "setImage", payload: image });
    if (size != "")
        chrome.runtime.sendMessage({ message: "setSize", payload: size });
    if (color != "")
        chrome.runtime.sendMessage({ message: "setColor", payload: color });
});

function getSelectors(server){
    var selectors = {};
    switch(server){
        case "amazon":
            selectors = { 
                title: () => get("#productTitle"), 
                price: () => get("#priceblock_ourprice"), 
                quantity: () => get("#quantity"), 
                image: () => getImageSource("#landingImage"), 
                size: () => get("#dropdown_selected_size_name * span[class=a-dropdown-prompt]"),
                color: () => get("#variation_color_name * span") 
                };
            break;
        case "target":
            selectors = { 
                title: () => get("h1[data-test=product-title] > span"), 
                price: () => get("div[data-test=product-price]"), 
                quantity: () => get("button[data-test=custom-quantity-picker] > div > div > span"),
                image: () => getImageSource("a[data-test=carousel-image] * img"),
                size: () => get("div[data-test=variationTheme-size] > span"), 
                color: () => get("div[data-test=variationTheme-color] > span")
            };
            break;
        case "etsy":
            selectors = {
                title: () => get("h1[data-buy-box-listing-title=true]"),
                price: () => get("div[data-buy-box-region=price] * p"),
                quantity: () =>  get("#zNOSUCHELEMENT"), 
                image: () => getImageSource("li[data-palette-listing-image] > img"), 
                size: () => getText("#inventory-variation-select-0 > option[selected]"),
                color: () => getText("#inventory-variation-select-1 > option[selected]")
            };
            break;
        case "buybuybaby":
            selectors = {
                title: () =>  document.querySelector("#wmHostPdp").shadowRoot.querySelector("h1[class*=prodTitle]").innerText.trim(),
                price: () => document.querySelector("#wmHostPdp").shadowRoot.querySelector("div[class*=trackIsPrice]").textContent.trim(),
                quantity: () => { 
                    var num = document.querySelector("#wmHostPdp").shadowRoot.querySelector("button[id*=qtyList]").innerText;
                    return (num + "").trim();
                    },
                image: () => document.querySelector("#wmHostPdp").shadowRoot.querySelector("amp-img > img").src,
                size: () => { 
                    var el = document.querySelector("#wmHostPdp").shadowRoot.querySelector("div[id^=sizesWrap] * button[class*=active]");
                    if(el)
                        return el.innerText.trim();
                    return "";
                },
                color: () => { 
                    var el = document.querySelector("#wmHostPdp").shadowRoot.querySelector("div[id^=colorsWrap] * span[class*=facetLabelSelected][data-amp-bind-text]");
                    if(el)
                        return el.innerText.trim();
                    return "";
                 }
            };
            break;
        case "babylist":
            selectors = {
                title: () => get("h1[class*=productName] > span[itemprop=name]"),
                price: () => get("span[itemprop=price]"),
                quantity: () => get("input[name=quantity]"),
                image: () => getImageSource("div[class*=product-images] > img"),
                color: () => "batsi",
                size: () => {  
                    var el = document.querySelector("div[aria-label='size options'] > button[aria-checked=true]");
                    if(el)
                        return el.getAttribute("aria-label").trim();
                    return "";
                 },
                color: () => { 
                    var el = document.querySelector("div[aria-label='color options'] > button[aria-checked=true]");
                    if(el)
                        return el.getAttribute("aria-label").trim();
                    return "";
                }
            };
            break;
        case "potterybarnkids":
            selectors = {
                title: () => get("div[class=pip-summary] > h1"),
                price: () => get("div[class=pip-summary] * span[class=product-price] * span[class=currency-amount]"),
                quantity: () => get("input[aria-label=Quantity]"),
                image: () => getImageSource("img#hero"),
                size: () => get("div[class*=subset-attributes] > h4:not([class*=graphic]) > span[class*=selectedValue]"),
                color: () => get("div[class*=subset-attributes] > h4[class*=graphic] > span[class*=selectedValue]")
            };
            break;
        case "crateandbarrel":
            selectors = {
                title: () => get("h1[class*=product-name]"),
                price: () => get("span[class*=regPrice]"),
                quantity: () => get("div[class=compound-quantity] > input"),
                image: () => getImageSource("div[class=gallery-main-image] * img"),
                size: () => get("ul[class*=size] * div[class*=selected] * span"),
                color: () => get("ul[class*=color] * div[class*=selected] > input")
            };
            break;
        case "walmart":
            selectors = {
                title: () => get("h1[class*=prod-ProductTitle]"),
                price: () => get("span[class*=price] > span[class=visuallyhidden]"),
                quantity: () => get("select[aria-label=Quantity]"),
                image: () => getImageSource("img[class*=hover-zoom-hero-image]"),
                size: () => get("div[id='Clothing Size'] > span:last-of-type"),
                color: () => get("#Color > span:last-child")
            };
            break;
        default:
            selectors = {
                title: () => "",
                price: () => "",
                quantity: () => "",
                image: () => "",
                size: () => "",
                color: () => ""
            };
    }
    return selectors;
}


function get(cssSelector){
    var el = document.querySelector(cssSelector);
    if (el){
        if (el.value) return (el.value + "").trim();
        else return el.innerText.trim();
    }
    else return "";
}

function getText(cssSelector){
    var el = document.querySelector(cssSelector);
    if (el){
        return el.innerText.trim();
    }
    else return "";
}

function getImageSource(cssSelector){
    var img = document.querySelector(cssSelector);
    return img ? img.src : "";
}


