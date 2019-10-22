// MIT License
//
// Copyright (c) 2019 Shimmermare
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var flashPath;
var width = 3840;
var height = 2160;
var duration = 32008;
var framerate = 24;

function checkAndRun()
{
	//debatable, but who gonna init twice anyway?
	if (new File(app.project.file.path + "/.flashPath").exists)
	{
		if (!confirm("Project is already initialized. Overwriting may break things. Do you want to continue?"))
		{
			return;
		}
	}
	showDialog();
}

function showDialog()
{
	// DIALOG
	// ======
	var dialog = new Window("dialog");
	dialog.text = "Project settings";
	dialog.orientation = "column";
	dialog.alignChildren = ["center","top"];
	dialog.spacing = 10;
	dialog.margins = 16;

	// GROUPMAIN
	// =========
	var groupMain = dialog.add("group", undefined, {name: "groupMain"});
	groupMain.preferredSize.width = 228;
	groupMain.orientation = "row";
	groupMain.alignChildren = ["left","top"];
	groupMain.spacing = 10;
	groupMain.margins = 0;

	// GROUP1
	// ======
	var group1 = groupMain.add("group", undefined, {name: "group1"});
	group1.orientation = "column";
	group1.alignChildren = ["left","top"];
	group1.spacing = 14;
	group1.margins = [0,5,0,0];

	var statictext1 = group1.add("statictext", undefined, undefined, {name: "statictext1"});
	statictext1.text = "Flash path:";

	var statictext2 = group1.add("statictext", undefined, undefined, {name: "statictext2"});
	statictext2.text = "Resolution:";

	var statictext3 = group1.add("statictext", undefined, undefined, {name: "statictext3"});
	statictext3.text = "Duration:";

	var statictext4 = group1.add("statictext", undefined, undefined, {name: "statictext4"});
	statictext4.text = "Framerate:";

	// GROUPFUNC
	// =========
	var groupFunc = groupMain.add("group", undefined, {name: "groupFunc"});
	groupFunc.orientation = "column";
	groupFunc.alignChildren = ["left","top"];
	groupFunc.spacing = 5;
	groupFunc.margins = 0;

	// GROUPFLASH
	// ==========
	var groupFlash = groupFunc.add("group", undefined, {name: "groupFlash"});
	groupFlash.orientation = "row";
	groupFlash.alignChildren = ["left","center"];
	groupFlash.spacing = 13;
	groupFlash.margins = 0;

	var textFlash = groupFlash.add('edittext {properties: {name: "textFlash", readonly: true}}');
	textFlash.preferredSize.width = 65;
	
	var buttonFlash = groupFlash.add("button", undefined, undefined, {name: "buttonFlash"});
	buttonFlash.text = "Open";
	buttonFlash.preferredSize.width = 65;
	buttonFlash.onClick = function()
	{
		var flashExec = File.openDialog("Specify Flash 8 executable", "Executable:Flash.exe");
		if (flashExec === null)
		{
			alert("Specify flash executable!");
			return;
		}
		flashPath = flashExec.absoluteURI;
		textFlash.text = flashPath;
	}
	
	// GROUPRES
	// ========
	var groupRes = groupFunc.add("group", undefined, {name: "groupRes"});
	groupRes.orientation = "row";
	groupRes.alignChildren = ["center","center"];
	groupRes.spacing = 3;
	groupRes.margins = 0;

	var textResWidth = groupRes.add('edittext {properties: {name: "textResWidth"}}');
	textResWidth.text = width;
	textResWidth.preferredSize.width = 65;
	textResWidth.onChange = function()
	{
		var t = textResWidth.text;
		if (isNaN(t) || t < 4 || t > 30000)
		{
			alert("Width must be a number between 4 and 30000!");
			textResWidth.text = width;
		}
		else
		{
			width = textResWidth.text;
		}
	}

	var statictext5 = groupRes.add("statictext", undefined, undefined, {name: "statictext5"});
	statictext5.enabled = false;
	statictext5.text = "x";
	statictext5.justify = "center";

	var textResHeight = groupRes.add('edittext {properties: {name: "textResHeight"}}');
	textResHeight.text = height;
	textResHeight.preferredSize.width = 65;
	textResHeight.onChange = function()
	{
		var t = textResHeight.text;
		if (isNaN(t) || t < 4 || t > 30000)
		{
			alert("Height must be a number between 4 and 30000!");
			textResHeight.text = height;
		}
		else
		{
			height = textResHeight.text;
		}
	}

	// GROUPFUNC
	// =========
	var textFramerate = groupFunc.add('edittext {properties: {name: "textFramerate"}}');
	textFramerate.text = framerate;
	textFramerate.preferredSize.width = 145;
	textFramerate.onChange = function()
	{
		var t = textFramerate.text;
		if (isNaN(t) || t < 1 || t > 999)
		{
			alert("Framerate must be a number between 1 and 999!");
			textFramerate.text = framerate;
		}
		else
		{
			framerate = textFramerate.text;
			//cap to 3hrs as AFX requires
			if (duration / framerate > 60 * 60 * 3)
			{
				textDuration.text = duration = 60 * 60 * 3 * framerate;
			}
		}
	}
	
	var textDuration = groupFunc.add('edittext {properties: {name: "textDuration"}}');
	textDuration.text = duration;
	textDuration.preferredSize.width = 145;
	textDuration.onChange = function()
	{
		var t = textDuration.text;
		if (isNaN(t) || t < 1)
		{
			alert("Duration must be a number greater than 1!");
			textDuration.text = duration;
		}
		else if (t / framerate > 60 * 60 * 3)
		{
			alert("Total duration can't be longer than 3 hours!");
			textDuration.text = duration = 60 * 60 * 3 * framerate;
		}
		else
		{
			duration = textDuration.text;
		}
	}

	// DIALOG
	// ======
	var divider1 = dialog.add("panel", undefined, undefined, {name: "divider1"});
	divider1.alignment = "fill";

	var buttonInit = dialog.add("button", undefined, undefined, {name: "buttonInit"});
	buttonInit.text = "Init project";
	buttonInit.preferredSize.width = 100;
	buttonInit.onClick = function()
	{
		if (flashPath === 'undefined')
		{
			alert("Specify flash location first!");
		}
		else
		{
			dialog.close();
			initProject();
		}
	}

	dialog.center();
	dialog.show();
}

function initProject()
{
	app.beginUndoGroup("Init project");
	
	app.project.timeDisplayType = TimeDisplayType.FRAMES;
	app.project.bitsPerChannel = 16;//idk why 16 bit colors but DHX says so...

	var flashPathFile = new File(app.project.file.path + "/.flashPath");
	flashPathFile.open("w");
	flashPathFile.write(flashPath);

	new Folder(app.project.file.path + "/ScenesFlash").create();
	new Folder(app.project.file.path + "/ScenesSWF").create();
	new Folder(app.project.file.path + "/ScenesPNG").create();
	new Folder(app.project.file.path + "/ScenesManual").create();

	var scenesFolderExists = false;
	for (var i = 1; i <= app.project.rootFolder.numItems; i++)
	{
		var item = app.project.rootFolder.item(i);
		if (item.name === "Scenes" && item instanceof FolderItem)
		{
			scenesFolderExists = true;
			break;
		}
	}
	if (!scenesFolderExists)
	{
		app.project.items.addFolder("Scenes");
	}

	var projectName = unescape(app.project.file.name);
	projectName = projectName.substring(0, projectName.lastIndexOf("."));
	
	var compExists = false;
	for (var i = 1; i <= app.project.numItems; i++)
	{
		var item = app.project.item(i);
		if (item.name === projectName && item instanceof CompItem)
		{
			alert("Scenes composition found! If you want to change it's resolution, use Rescale button from toolkit. Framerate and duration can be changed from Composition Settings.");
			compExists = true;
			break;
		}
	}
	if (!compExists)
	{
		app.project.items.addComp(projectName, width, height, 1, duration / framerate, framerate);
	}
	
	app.endUndoGroup();
	alert("Project initialized.");
}

checkAndRun();