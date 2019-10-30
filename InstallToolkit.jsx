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

function installToolkit()
{
	var scriptsFolder = new Folder(Folder.userData.fullName + "/Adobe/After Effects/" + app.version.match("([0-9]+\.[0-9]+)")[0] + "/Scripts");
	if (!scriptsFolder.exists)
	{
		throw "Unexpected: Scripts folder doesn't exists. Toolkit can't be installed.";
	}
	
	var toolkitFolder = new Folder(scriptsFolder.fullName + "/MLP-AFX-Plumbing-Toolkit");
	var scriptUIFile = new File(scriptsFolder.fullName + "/ScriptUI Panels/MLP-AFX-Plumbing-Toolkit.jsx");

	if (app.settings.haveSetting("MLP-AFX-Plumbing-Toolkit", "installed"))
	{
		if (!confirm("You are already have toolkit installed. Do you want to re-install it?"))
		{
			return;
		}
		toolkitFolder.remove();
		scriptUIFile.remove();
	}

	var tempFolder = new Folder(new File($.fileName).path);
	var tempToolkitFolder = new Folder(tempFolder.fullName + "/Toolkit");
	var tempScriptUIFile = new File(tempFolder.fullName + "/MLP-AFX-Plumbing-Toolkit.jsx");

	toolkitFolder.create();
	var tempToolkitFiles = tempToolkitFolder.getFiles();
	for (var i = 0; i < tempToolkitFiles.length; i++)
	{
		var file = tempToolkitFiles[i];
		file.copy(new File(toolkitFolder.fullName + "/" + file.name));
	}

	tempScriptUIFile.copy(scriptUIFile);

	app.settings.saveSetting("MLP-AFX-Plumbing-Toolkit", "installed", "true");

	alert("Toolkit installed successfully. Now you can remove downloaded files. To open toolkit, reload After Effects.");
}

installToolkit();