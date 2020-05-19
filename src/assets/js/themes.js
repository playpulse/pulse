var currentThemeId = 0;
var themes = ["default"];

function setTheme (id) {
	const theme = getTheme(id);
	const styles = theme.styles;

	const DOMStyles = document.getElementById("user-styles");
	DOMStyles.innerHTML = "";

	for (var i = 0; i < styles.length; i++)
		DOMStyles.innerHTML += `<link type="text/css" rel="stylesheet" href="${theme.path}/${styles[i]}"/>`
}

function getTheme (themeId) {
	const themeFolder = themes[themeId];
	const themePath = __dirname + "../../themes/" + themeFolder + "/";
	const themeFile = themePath + "theme.json";
	const themeData = require(themeFile);

	themeData.path = themePath;
	console.log(themeData);
	return themeData;
}

setTheme(0);