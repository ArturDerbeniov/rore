document.addEventListener('DOMContentLoaded', eventDomLoaded);
document.addEventListener("click", eventDocClick, false);
window.addEventListener("load", eventWindowLoad, false);
window.addEventListener("resize", function () { fnDelay(function () { eventWindowResize() }, 300) }, false);

gsap.registerPlugin(ScrollTrigger);

function eventDomLoaded() {

}
function eventWindowLoad() {
	patchesFooter.init();
}
function eventWindowResize() {	
	
}
function eventDocClick(e) {
    var targ = e.target;
    var clickedEl = e.target;

    while (targ && targ != this) {
    	if(targ.classList.contains("headerMain__menu__bar")) {
    		targ.classList.toggle("active");
    		if(targ.classList.contains("active")) {
    			document.body.classList.add("headerMainMenuActive");
    		}
    		else {
    			document.body.classList.remove("headerMainMenuActive");	
    		}
    	}

        targ = targ.parentNode;
    }
}

var fnDelay = function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
}();
var loadJS = function(url, callback, locToInsert){
    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = callback;
    scriptTag.onreadystatechange = callback;

    locToInsert.appendChild(scriptTag);
};
function getRndArr(collectionLen) {
    var arr = [];
    for (var i = collectionLen - 1; i >= 0; i--) {
        var num = Math.floor(Math.random() * collectionLen);
        if (arr.length > 0) {
            while (isValInArr(num, arr)) {
                num = Math.floor(Math.random() * collectionLen);
            }
            arr.push(num);
        }
        else {
            arr.push(num);
        }
    }
    return arr;

    function isValInArr(val, arr) {
        var inArray = false;
        for (var x = 0, y = arr.length; x < y; x++) {
            if (val == arr[x]) {
                inArray = true;
            }
        }
        return inArray;
    }
}
var ColorsPatches = ["rgba(146, 173, 170, 0.88)","#0E375F","#92ADAA","#8F6068","#D0D3D6","#FCEAF6"];
var patchesFooter = {
	patches: undefined,
	init: function() {
		if(document.querySelectorAll(".patchwork__footer")) {			
		    this.patches = document.querySelectorAll(".patchwork__footer .patch");		    

			gsap.set(this.patches, {
				backgroundColor: () => { return gsap.utils.random(ColorsPatches)}
			});
			this.show();
		}
	},
	show: function() {
		var placesRndArr = [],
	    	patchesLen = 18;

		if(window.innerWidth >= 768) {
			patchesLen = 14;
		}

		placesRndArr = getRndArr(patchesLen);

		ScrollTrigger.create({
			trigger: document.querySelector(".patchwork__footer"),
			start: "top 100%",
			end: "bottom top",
			onToggle: self => {
				if(self.isActive) {
					showPatches();
				}
				else {
					resetPathces()
				}
			}
		});

		function showPatches() {
			var tl = gsap.timeline({});

			for(let i = 0; i < placesRndArr.length; i++) {
				let patch = document.querySelector(".patchwork__footer .patch[data-place='"+(placesRndArr[i])+"']");
				tl.to(patch, {
					opacity:1,
					scale:1,
					duration:0.01,
				}, "<0.1");				
			}
		}

		function resetPathces() {
			let patches = patchesFooter.patches;
			gsap.set(patches, {
				opacity:0,
				scale:.85,
				backgroundColor: () => { return gsap.utils.random(ColorsPatches)}
			});
		}
	}
};
var vld = {
    keyupTimerId: 0,
    keyupDelay: 300,

    init: function (currForm) {
        document.addEventListener("keyup", vldKeyup, false);
        document.addEventListener("input", vldInput, false);
        document.addEventListener("change", vldChange, false);

        function vldKeyup(e) {
            if (e.target.classList.contains("vld-input")) {
                if (e.target.getAttribute("type") == "tel") {
                    e.target.classList.add("vld-field-activated")
                    vld.checkForm(e.target.closest(".vld-form")[0], e.target);
                }
                else {

                    // работа с input autocomplete
                    if (
                        (e.target.getAttribute("data-required") && (e.target.getAttribute("data-required") === "true"))
                        &&
                        e.target.getAttribute("data-autocomplete")
                    ) {
                        function f() {
                            // нахожу ul связанный с input[data-autocomplete]
                            // и проверяю ul на видимость
                            if (document.querySelector("ul.ui-autocomplete." + e.target.getAttribute("name"))) {
                                if ((document.querySelector("ul.ui-autocomplete." + e.target.getAttribute("name")).clientHeight == 0)) {
                                    if (e.target.classList.contains("vld-field-autocompleted")) {
                                        e.target.value = "";
                                        e.target.classList.remove("vld-field-valid");
                                        e.target.classList.remove("vld-field-autocompleted");
                                        e.target.parentNode.querySelector("[type='hidden']").value = "";
                                        vld.checkForm(e.target.closest(".vld-form")[0], e.target);
                                    }
                                }
                            }
                        }
                        function wrapper() {
                            f();
                        }
                        (function (wrapper, ms) {
                            clearTimeout(vld.keyupTimerId);
                            vld.keyupTimerId = setTimeout(wrapper, ms);
                        })(wrapper, vld.keyupDelay);


                    }
                }
            }

        }
        function vldInput(e) {
            if (e.target.classList.contains("vld-input")) {
                e.target.classList.add("vld-field-activated")
                vld.checkForm(e.target.closest(".vld-form"), e.target);
            }

        }
        function vldChange(e) {
            if (e.target.classList.contains("vld-select")) {
                e.target.classList.add("vld-field-activated")
                vld.checkForm(e.target.closest(".vld-form"), e.target);
            }
            else {
                vld.checkForm(e.target.closest(".vld-form"));
            }
        }
    },
    onload: function () {
        var forms = document.getElementsByClassName("vld-form");
        if (forms.length) {
            for (var i = 0, k = forms.length; i < k; i++) {
                if (forms[i].getAttribute("data-validate-onload") && forms[i].getAttribute("data-validate-onload") == "false") continue;
                (function (form) {
                    setTimeout(function () {
                        window.vld.checkForm(form);
                    }, 600);
                })(forms[i]);
            }
        }
    },
    checkForm: function (currForm, field) {
        if (!currForm) return;
        if (typeof currForm == "string") {
            if (document.querySelector(currForm)) {
                var currForm = document.querySelector(currForm);
            }
        }
        var form = currForm,
            fields = currForm.getElementsByClassName("vld-field");

        if (fields.length) {
            for (var i = 0, k = fields.length; i < k; i++) {

                if (
                    (!fields[i].closest(".targetChecked"))
                    ||
                    ((fields[i].closest(".targetChecked")) && (fields[i].closest(".targetChecked").clientHeight >= 24))
                ) {
                    (function (f) {
                        f.removeAttribute("readonly");
                    })(fields[i])

                    this.checkField(fields[i]);
                }
                if (i == k - 1) {
                    setTimeout(function () {
                        vld.isValidForm(currForm);
                    }, 100);
                }
            }
        }
    },
    checkField: function (f) {
        var isValid = false;
        if (f.parentNode.clientHeight <= 0) {
            f.classList.remove("vld-field-invalid");
            return;
        }

        if ((f.type != "hidden") && (f.tagName.toLowerCase() == "input" || f.tagName.toLowerCase() == "textarea")) {
            if (f.getAttribute("data-required") && f.getAttribute("data-required") == "true") {
                if (!f.value) f.value = "";
                var v = f.value;

                if (f.getAttribute("pattern")) {
                    var re = new RegExp(f.getAttribute("pattern"));
                    if (f.getAttribute("data-uppercase") && f.getAttribute("data-uppercase") == "true") {
                        v = v.toUpperCase();
                    }
                    // if(f.checkValidity()) {
                    if (re.test(v)) {
                        this.statusField(f, "valid");
                        isValid = true;
                    }
                    else {
                        this.statusField(f, "invalid");
                        isValid = false;
                    }
                }
                else {
                    if (f.type == "checkbox") {
                        if (f.checked) {
                            this.statusField(f, "valid");
                            isValid = true;
                        }
                        else {
                            this.statusField(f, "invalid");
                            isValid = false;
                        }
                    }
                    else {
                        if (!!v) {
                            this.statusField(f, "valid");
                            isValid = true;
                        }
                        else {
                            this.statusField(f, "invalid");
                            isValid = false;
                        }
                    }
                }
            }
        }
        else if (f.tagName.toLowerCase() == "select") {
            // if(!f.classList.contains("vld-activeted")) return;

            if (f.getAttribute("data-required") && f.getAttribute("data-required") == "true") {
                if (f.options[f.selectedIndex] && f.options[f.selectedIndex].getAttribute("value") && f.options[f.selectedIndex].getAttribute("value") !== "0") {
                    this.statusField(f, "valid");
                    isValid = true;
                }
                else {
                    this.statusField(f, "invalid");
                    isValid = false;
                }
            }
        }
        return isValid;
    },
    isValidForm: function (currForm) {
        var isValid = true;
        var btn = currForm.querySelector(currForm.getAttribute("data-btnLinked"));
        if (!btn) return;

        var allFields = currForm.querySelectorAll(".vld-field[data-required='true']"),
            fieldsToCheck = 0,
            fieldsExcluded = 0;

        for (var i = 0, k = allFields.length; i < k; i++) {
            if (
                ((allFields[i].closest(".targetChecked")) && (allFields[i].closest(".targetChecked").clientHeight < 24))
                ||
                allFields[i].getAttribute("disabled") == "disabled"
            ) {
                fieldsExcluded++;
            }
            else if (
                (!allFields[i].closest(".targetChecked"))
                ||
                ((allFields[i].closest(".targetChecked")) && (allFields[i].closest(".targetChecked").clientHeight >= 24))
            ) {
                fieldsToCheck++;
                if (
                    allFields[i].classList.contains("vld-field-invalid")
                ) {
                    isValid = false;
                    btn.classList.add("disabled");
                }
            }
            if (fieldsExcluded + fieldsToCheck == k) {
                if (isValid) {
                    btn.classList.remove("disabled");
                }
            }
        }

        return isValid;
    },
    statusField: function (field, status) {
        if (status == "valid") {
            field.classList.add("vld-field-valid");
            field.classList.remove("vld-field-invalid");
        }
        else {
            field.classList.remove("vld-field-valid");
            field.classList.add("vld-field-invalid");
        }
    },
};
vld.init();
