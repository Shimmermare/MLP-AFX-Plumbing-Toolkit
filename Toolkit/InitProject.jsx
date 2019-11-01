// MIT License
//
// Copyright (c) 2019 Shimmermare <shimmermare@gmail.com>
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

if (app.project.file == null)
{
	throw "Save project to file before initializing!";
}

var projectId = null;
for (var i = 1; i <= app.project.rootFolder.numItems; i++)
{
	var item = app.project.rootFolder.item(i);
	if (item.name.indexOf("__PROJECT_ID__:") != -1)
	{
		if (!confirm("Project is already initialized. Overwriting may break things. Do you want to continue?"))
		{
			throw "Cancelled";
		}
		projectId = item.name.substring("__PROJECT_ID__:".length);
	}
}

var flashPath = null;
if (projectId)
{
	flashPath = app.settings.getSetting("MLP-AFX-Plumbing-Toolkit_project_" + projectId, "flash_path")
}
var width = 3840;
var height = 2160;
var duration = 32008;
var framerate = 24;

function showDialog()
{
	var dialog = new Window("dialog");
	dialog.text = "Project settings";
	dialog.orientation = "column";
	dialog.alignChildren = ["center","top"];
	dialog.spacing = 10;
	dialog.margins = 16;

	var groupMain = dialog.add("group", undefined, {name: "groupMain"});
	groupMain.preferredSize.width = 228;
	groupMain.orientation = "row";
	groupMain.alignChildren = ["left","top"];
	groupMain.spacing = 10;
	groupMain.margins = 0;

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

	var groupFunc = groupMain.add("group", undefined, {name: "groupFunc"});
	groupFunc.orientation = "column";
	groupFunc.alignChildren = ["left","top"];
	groupFunc.spacing = 5;
	groupFunc.margins = 0;

	var groupFlash = groupFunc.add("group", undefined, {name: "groupFlash"});
	groupFlash.orientation = "row";
	groupFlash.alignChildren = ["left","center"];
	groupFlash.spacing = 13;
	groupFlash.margins = 0;

	var textFlash = groupFlash.add('edittext {properties: {name: "textFlash", readonly: true}}');
	textFlash.preferredSize.width = 65;
	if (flashPath)
	{
		textFlash.text = flashPath;
	}
	
	var buttonFlash = groupFlash.add("button", undefined, undefined, {name: "buttonFlash"});
	buttonFlash.text = "Open";
	buttonFlash.preferredSize.width = 65;
	buttonFlash.onClick = function()
	{
		var flashExec = File.openDialog("Specify Flash 8 executable", "Any:*.exe");
		if (flashExec === null) return;
		flashPath = flashExec.absoluteURI;
		textFlash.text = flashPath;
	}
	
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

	var divider1 = dialog.add("panel", undefined, undefined, {name: "divider1"});
	divider1.alignment = "fill";

	var buttonInit = dialog.add("button", undefined, undefined, {name: "buttonInit"});
	buttonInit.text = "Init project";
	buttonInit.preferredSize.width = 100;
	buttonInit.onClick = function()
	{
		if (!flashPath)
		{
			alert("Specify flash executable first!");
			return;
		}

		dialog.close();
		initProject();
	}

	dialog.center();
	dialog.show();
}

function initProject()
{	
	app.project.timeDisplayType = TimeDisplayType.FRAMES;
	app.project.bitsPerChannel = 16;//idk why 16 bit colors but DHX says so...

	new Folder(app.project.file.path + "/ScenesFlash").create();
	new Folder(app.project.file.path + "/ScenesPNG").create();
	new Folder(app.project.file.path + "/ScenesRemoved").create();

	var solidsFolderItem;
	for (var i = 1; i <= app.project.rootFolder.numItems; i++)
	{
		var item = app.project.rootFolder.item(i);
		if (item.name == "Solids")
		{
			solidsFolderItem = item;
			break;
		}
	}
	if (!solidsFolderItem)
	{
		solidsFolderItem = app.project.items.addFolder("Solids");
	}
	
	var tempComp = app.project.items.addComp("temp", 4, 4, 1, 1, 1);

	if (!projectId)
	{
		projectId = Math.floor(Math.random() * 100000000);
		tempComp.layers.addSolid([1, 0.792156863, 0.329411765], "__PROJECT_ID__:" + projectId, 4, 4, 1, 1)
			.source.parentFolder = app.project.rootFolder;
	}
	
	app.settings.saveSetting("MLP-AFX-Plumbing-Toolkit_project_" + projectId, "flash_path", flashPath);
	
	var section = "MLP-AFX-Plumbing-Toolkit_project_" + projectId;
	if (!app.settings.haveSetting(section, "scenes_folder_id") || !itemByIDSafe(app.settings.getSetting(section, "scenes_folder_id")))
	{
		var item = app.project.items.addFolder("Scenes");
		app.settings.saveSetting(section, "scenes_folder_id", item.id);
	}
	if (!app.settings.haveSetting(section, "removed_scenes_folder_id") || !itemByIDSafe(app.settings.getSetting(section, "removed_scenes_folder_id")))
	{
		var item = app.project.items.addFolder("ScenesRemoved");
		app.settings.saveSetting(section, "removed_scenes_folder_id", item.id);
	}
	
	var mainComp;
	if (!app.settings.haveSetting(section, "main_comp_id")
		|| !itemByIDSafe(app.settings.getSetting(section, "main_comp_id")))
	{
		var projectName = unescape(app.project.file.name);
		projectName = projectName.substring(0, projectName.lastIndexOf("."));
		mainComp = app.project.items.addComp(projectName, width, height, 1, duration / framerate, framerate);
		app.settings.saveSetting("MLP-AFX-Plumbing-Toolkit_project_" + projectId, "main_comp_id", item.id);
	}
	else
	{
		mainComp = itemByIDSafe(app.settings.getSetting(section, "main_comp_id"));
		alert("Main composition already exists! If you want to change resolution, use Rescale script from toolkit.");
	}

	var skipMagic = false;
	for (var i = 1; i <= solidsFolderItem.numItems; i++)
	{
		if (solidsFolderItem.item(i).name == "MagicReferences")
		{
			skipMagic = true;
			break;
		}
	}
	if (!skipMagic)
	{
		var magicFolderItem = solidsFolderItem.items.addFolder("MagicReferences");
		
		function addRef(name, color)
		{
			tempComp.layers.addSolid(color, name, mainComp.width, mainComp.height, 1).source.parentFolder = magicFolderItem;
		}
		
		addRef("Cadence", [0.52156901359558,0.83921599388123,0.89411801099777]);
		addRef("Celestia", [0.93725597858429,0.93725597858429,0.60000598430634]);
		addRef("FlimFlam", [0.23529399931431,0.83137297630310,0.31372600793839]);
		addRef("Flurry", [0.94902002811432,0.88235300779343,0.44705900549889]);
		addRef("Luna", [0.36470600962639,0.55686300992966,0.89411801099777]);
		addRef("Rarity", [0.50048440694809,0.77280682325363,0.88627451658249]);
		addRef("Starlight", [0.34902998805046,0.85882598161697,0.75686597824097]);
		addRef("Starswirl", [0.96470588445663,0.95686274766922,0.92156863212585]);
		addRef("Sunburst", [0.95294100046158,0.93725502490997,0.58039200305939]);
		addRef("Trixy", [0.87843102216721,0.75686299800873,0.88627499341965]);
		addRef("Twilight", [0.92941176891327,0.26274511218071,0.55294120311737]);
	}
	tempComp.remove();
	
	alert("Project initialized.");
}

function itemByIDSafe(id)
{
	id = parseInt(id, 10);
	try
	{
		return app.project.itemByID(id);
	}
	catch (e)
	{
		return null;
	}
}

showDialog();