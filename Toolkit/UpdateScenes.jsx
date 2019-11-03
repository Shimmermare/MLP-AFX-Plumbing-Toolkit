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

var toolkitFolder = new Folder(new File($.fileName).path);

if (app.project.file == null)
{
	throw "Save and initialize project before updating scenes!";
}
var projectFolder = new Folder(app.project.file.path);

var projectId = null;
for (var i = 1; i <= app.project.rootFolder.numItems; i++)
{
	var item = app.project.rootFolder.item(i);
	if (item.name.indexOf("__PROJECT_ID__:") != -1)
	{
		projectId = item.name.substring("__PROJECT_ID__:".length);
	}
}
if (isNaN(projectId))
{
	throw "Can't find project ID! Initialize project first.";
}
var prefsSection = "MLP-AFX-Plumbing-Toolkit_project_" + projectId;
var flashAppFile = new File(app.settings.getSetting(prefsSection, "flash_path"));
if (!flashAppFile.exists)
{
	throw "Can't find Flash app file! Try to create a new project.";
}

var tempFolder = new Folder(projectFolder.fullName + "/Temp");
var sourceFolder = new Folder(projectFolder.fullName + "/ScenesFlash");
var renderedFolder = new Folder(projectFolder.fullName + "/ScenesPNG");
var removedFolder = new Folder(projectFolder.fullName + "/ScenesRemoved");

var scenesFolderItem = itemByIDSafe(app.settings.getSetting(prefsSection, "scenes_folder_id"));
var removedScenesFolderItem = itemByIDSafe(app.settings.getSetting(prefsSection, "removed_scenes_folder_id"));
var mainCompItem = itemByIDSafe(app.settings.getSetting(prefsSection, "main_comp_id"));

function main()
{
	tempFolder.create();
	
	var notRespondingReminder = new Window("palette", "Updating scenes...");
    notRespondingReminder.alignChildren = ["fill","center"];
	notRespondingReminder.preferredSize.width = 200;
    notRespondingReminder.spacing = 10;
    notRespondingReminder.margins = 16;
	notRespondingReminder.add("statictext", undefined, "'NOT RESPONDING' IS OKAY. JUST WAIT.", { name: "statictext1" });
	notRespondingReminder.center();
	notRespondingReminder.show();
	notRespondingReminder.update();
	
	var removedScenes = cleanScenes();
	var renderedScenes = renderScenes();
	var importedScenes = importScenes();

	fileRecursiveRemove(tempFolder);
	showResultWindow(removedScenes, renderedScenes, importedScenes);
}

//Check if .fla source of scene was removed and move rendered frames to (project dir)/ScenesRemoved/ and scene footage item to /ScenesRemoved/.
//Returns array of scene names with removed source.
function cleanScenes()
{
	var result = new Array();

	for (var i = 1; i <= scenesFolderItem.numItems; i++)
	{
		var sceneItem = scenesFolderItem.item(i);
		var sourceFile = new File(sourceFolder.fullName + "/" + sceneItem.name + ".fla");
		if (!sourceFile.exists)
		{
			var currentFrameFolder = new Folder(renderedFolder.fullName + "/" + sceneItem.name);
			if (currentFrameFolder.exists)
			{
				var newFrameFolder = new Folder(removedFolder.fullName + "/" + sceneItem.name);
				newFrameFolder.create();
				
				var frameFiles = currentFrameFolder.getFiles();
				for (var i = 0; i < frameFiles.length; i++)
				{
					var frame = frameFiles[i];
					frame.copy(new File(newFrameFolder.fullName + "/" + frame.name));
				}
				fileRecursiveRemove(currentFrameFolder);

				var firstFrameName = sceneItem.mainSource.file.name;
				sceneItem.replaceWithSequence(new File(newFrameFolder.fullName + "/" + firstFrameName), true);
			}

			sceneItem.parentFolder = removedScenesFolderItem;
			result.push(sceneItem.name);
		}
	}
	
	return result;
}

//Render new or modified scenes to PNG frames.
//Returns array of rendered scene names.
function renderScenes()
{
	var result = new Array();
	
	tempFolder.create();

	//Template of jsfl script to render scene as png sequence
	//%projectDir% - project dir
	//%sceneName% - scene name (without .fla)
	//%askSettings% - bool open export settings window
	var renderSceneTemplateFile = new File(toolkitFolder.fullName + "/RenderScene.jsfl.template");
	renderSceneTemplateFile.open("r");
	var renderSceneTemplate = renderSceneTemplateFile.read();
	renderSceneTemplateFile.close();
	var renderSceneTempFile = new File(tempFolder.fullName + "/RenderScene.jsfl");
	
	function renderScene(sceneName, signalRenderingFile, askSettings)
	{
		var renderSceneScript = renderSceneTemplate
		.replace("%projectDir%", projectFolder.fullName)
		.replace("%sceneName%", sceneName)
		.replace("%askSettings%", askSettings);

		renderSceneTempFile.open("w");
		renderSceneTempFile.write(renderSceneScript);
		renderSceneTempFile.close();
		
		var sceneRenderedFolder = new Folder(renderedFolder.fullName + "/" + sceneName);
		fileRecursiveRemove(sceneRenderedFolder);

		system.callSystem("cmd.exe /c \"\"" + flashAppFile.fsName + "\" \"" + renderSceneTempFile.fsName + "\"\"");

		for (var timeout = 30000; true; timeout -= 1000)
		{
			$.sleep(1000);
			if (timeout <= 0)
			{
				fileRecursiveRemove(sceneRenderedFolder);
				fileRecursiveRemove(tempFolder);
				throw "Rendering of scene " + sceneName + " failed: scene opening takes longer than 30 seconds.";
			}
			if (!isFlashRunning())
			{
				fileRecursiveRemove(sceneRenderedFolder);
				fileRecursiveRemove(tempFolder);
				throw "Rendering of scene " + sceneName + " failed: Flash crashed while opening file.";
			}
			
			signalRenderingFile.open("r");
			var status = signalRenderingFile.read().split(":");
			signalRenderingFile.close();
			
			if (status[0] === "rendering") break;
			if (status[0] === "finished") return;
			if (status[0] === "failed")
			{
				fileRecursiveRemove(sceneRenderedFolder);
				fileRecursiveRemove(tempFolder);
				throw "Rendering of scene " + sceneName + " failed: can't open scene.";
			}
		}
		signalRenderingFile.open("r");
		var totalFrames = parseInt(signalRenderingFile.read().split(":")[1], 10);
		signalRenderingFile.close();
		
		//10 sec per frame limit + add 30 sec if this is first scene
		var timeout = 10000 * totalFrames;
		if (askSettings) timeout += 30000;
		for (; true; timeout -= 1000)
		{
			$.sleep(1000);
			
			if (timeout <= 0)
			{
				fileRecursiveRemove(sceneRenderedFolder);
				fileRecursiveRemove(tempFolder);
				throw "Rendering of scene " + sceneName + " failed: render takes longer than " + totalFrames + " seconds.";
			}
			if (!isFlashRunning())
			{
				fileRecursiveRemove(sceneRenderedFolder);
				fileRecursiveRemove(tempFolder);
				throw "Rendering of scene " + sceneName + " failed: Flash crashed while rendering.";
			}
			
			signalRenderingFile.open("r");
			var signal = signalRenderingFile.read().split(":");
			signalRenderingFile.close();
			
			if (signal[0] === "finished") break;
			//failed status isn't possible here for now
		}
		
		var renderedFrameFiles = sceneRenderedFolder.getFiles();
		if (renderedFrameFiles.length != totalFrames)
		{
			fileRecursiveRemove(sceneRenderedFolder);
			fileRecursiveRemove(tempFolder);
			throw "Rendering of scene " + sceneName + " failed (or canceled): only " + renderedFrameFiles.length + "/" + totalFrames + " rendered successfully.";
		}
	}
	
	var sourceFiles = sourceFolder.getFiles();
	for (var i = 0; i < sourceFiles.length; i++)
	{
		var sourceFile = sourceFiles[i];
		var sceneName = sourceFile.name.substring(0, sourceFile.name.lastIndexOf("."));
		var frameFolder = new Folder(renderedFolder.fullName + "/" + sceneName);
		
		var render = !frameFolder.exists;
		if (!render && frameFolder.modified < sourceFile.modified)
		{
			fileRecursiveRemove(frameFolder);
			render = true;
		}
		if (render)
		{
			var signalRenderingFile = new File(tempFolder.fullName + "/." + sceneName + ".rendering");			
			renderScene(sceneName, signalRenderingFile, (i == 0));
			result.push(sceneName);
		}
	}
	
	return result;
}

//Search for and import new scenes.
//Returns array of imported scene names.
function importScenes()
{
	var result = new Array();
	
	var currentScenes = {};
	for (var i = 1; i <= scenesFolderItem.numItems; i++)
	{
		var sceneItem = scenesFolderItem.item(i);
		currentScenes[sceneItem.name] = sceneItem;
	}
	
	function importScene(sceneFrameFolder)
	{
		var importOptions = new ImportOptions();
		//TODO more reliable way to get first frame
		var firstFrame = new File(sceneFrameFolder.fullName + "/0001.png");
		if (!firstFrame.exists)
		{
			throw "Can't import scene: first frame is missing (0001.png).";
		}
		importOptions.file = firstFrame;
		importOptions.forceAlphabetical = true;
		importOptions.importAs = ImportAsType.FOOTAGE;
		importOptions.sequence = true;
		
		var imported = app.project.importFile(importOptions);
		imported.mainSource.conformFrameRate = mainCompItem.frameRate;
		imported.parentFolder = scenesFolderItem;
	}
	
	var sceneFrameFolders = renderedFolder.getFiles();
	for (var i = 0; i < sceneFrameFolders.length; i++)
	{
		var sceneFrameFolder = sceneFrameFolders[i];
		if (!currentScenes[sceneFrameFolder.name])
		{
			importScene(sceneFrameFolder);
			result.push(sceneFrameFolder.name);
		}
	}
	return result;
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

function fileRecursiveRemove(file)
{
	if ((file instanceof Folder) && file.exists)
	{
		var files = file.getFiles();
		for (var i = 0; i < files.length; i++)
		{
			fileRecursiveRemove(files[i]);
		}
	}
	file.remove();
}

function isFlashRunning()
{
	var tasksCSV = system.callSystem("tasklist /fo csv /fi \"imagename eq " + flashAppFile.name + "\"");
	return tasksCSV.split("\n").length >= 2;
}

function showResultWindow(removedScenes, renderedScenes, importedScenes)
{
	var resultWindow = new Window("dialog", "Update results");
	resultWindow.preferredSize.height = 300;
	resultWindow.orientation = "column";
	resultWindow.alignChildren = ["center","top"];
	resultWindow.spacing = 10;
	resultWindow.margins = 16;

	var treeview1 = resultWindow.add("treeview", [0,0,219,142], undefined, {name: "treeview1"});
	treeview1.alignment = ["fill","fill"];

	var removedScenesNode = treeview1.add("node", "Removed scenes (" + removedScenes.length + ")");
	for (var i = 0; i < removedScenes.length; i++)
	{
		removedScenesNode.add("item", removedScenes[i]);
	}
	
	var renderedScenesNode = treeview1.add("node", "Rendered succesfully (" + renderedScenes.length + ")");
	for (var i = 0; i < renderedScenes.length; i++)
	{
		renderedScenesNode.add("item", renderedScenes[i]);
	}
	
	var importedScenesNode = treeview1.add("node", "Imported new scenes (" + importedScenes.length + ")");
	for (var i = 0; i < importedScenes.length; i++)
	{
		importedScenesNode.add("item", importedScenes[i]);
	}
	
	resultWindow.center();
	resultWindow.show();
}

main();