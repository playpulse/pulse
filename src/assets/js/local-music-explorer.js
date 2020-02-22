function switchToDirectory (dir, clicked) {
	scanFolder(dir);

	document.getElementsByClassName("folder-selected")[0].classList.remove("folder-selected");
	clicked.classList.add("folder-selected");
}