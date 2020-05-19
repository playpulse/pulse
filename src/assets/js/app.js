applyConfig();

var currentBtnActive = "local";

function switchMenuBar (tomenu) {
	if (currentBtnActive == null) currentBtnActive = "local";
	
	const oldmenu = document.getElementById("menu-btn-" + currentBtnActive);
	oldmenu.classList.remove("selected");

	const newmenu = document.getElementById("menu-btn-" + tomenu);
	newmenu.classList.add("selected")

	document.getElementById("view-" + currentBtnActive).style.display = "none";
	document.getElementById("view-" + tomenu).style.display = "block";

	currentBtnActive = tomenu;
}