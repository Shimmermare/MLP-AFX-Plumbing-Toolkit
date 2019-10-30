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

if (!(this instanceof Panel))
{
	throw "You can't use toolkit UI as portable script! Use actual scripts instead.";
}

var toolkitFolder = new Folder(Folder.userData.fullName + "/Adobe/After Effects/" + app.version.match("([0-9]+\.[0-9]+)")[0] + "/Scripts/MLP-AFX-Plumbing-Toolkit");
	
function showUI(thisObj)
{
	thisObj.preferredSize.width = 300;
	thisObj.preferredSize.height = 150;
	
	var groupMain = thisObj.add("group", undefined, {name: "groupMain"});
	groupMain.preferredSize.width = 300;
	groupMain.orientation = "row";
	groupMain.alignChildren = ["fill","center"];
	groupMain.spacing = 10;
	groupMain.margins = 0;

	var group1 = groupMain.add("group", undefined, {name: "group1"});
	group1.orientation = "row";
	group1.alignChildren = ["left","center"];
	group1.spacing = 10;
	group1.margins = 0;

	var sunnie = new File(toolkitFolder.fullName + "/Sunnie.png");
	var image1 = group1.add("image", undefined, sunnie, {name: "image1"});

	var panelPipeline = groupMain.add("panel", undefined, undefined, {name: "panelPipeline"});
	panelPipeline.text = "Pipeline";
	panelPipeline.orientation = "column";
	panelPipeline.alignChildren = ["fill","top"];
	panelPipeline.spacing = 10;
	panelPipeline.margins = 10;

	var buttonInitProject = panelPipeline.add("button", undefined, undefined, {name: "buttonInitProject"});
	buttonInitProject.text = "Init project";
	buttonInitProject.onClick = function()
	{
		$.evalFile(toolkitFolder.fullName + "/InitProject.jsx");
	}
	
	var buttonUpdateScenes = panelPipeline.add("button", undefined, undefined, {name: "buttonUpdateScenes"});
	buttonUpdateScenes.text = "Update scenes";
	buttonUpdateScenes.onClick = function()
	{
		$.evalFile(toolkitFolder.fullName + "/UpdateScenes.jsx");
	}
	
	var panelTools = groupMain.add("panel", undefined, undefined, {name: "panelTools"});
	panelTools.text = "Tools";
	panelTools.orientation = "column";
	panelTools.alignChildren = ["fill","top"];
	panelTools.spacing = 10;
	panelTools.margins = 10;

	var buttonRescale = panelTools.add("button", undefined, undefined, {name: "buttonRescale"});
	buttonRescale.text = "Rescale";
	buttonRescale.onClick = function()
	{
		$.evalFile(toolkitFolder.fullName + "/Rescale.jsx");
	}
	
	var buttonAddMagicFX = panelTools.add("button", undefined, undefined, {name: "buttonAddMagicFX"});
	buttonAddMagicFX.text = "Add magic FX";
	buttonAddMagicFX.onClick = function()
	{
		$.evalFile(toolkitFolder.fullName + "/AddMagicFX.jsx");
	}
	
	thisObj.layout.layout(true);
}

showUI(this);