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

function buildUI(thisObj)
{
	var panel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "MLP AFX Plumbing Toolkit", undefined, {resizeable:true});

	res = "group\
	{\
		panel: Panel\
		{\
			text:'v1.0 by Shimmermare', orientation:'row', alignment:['fill','fill'], \
				column1: Group\
				{\
					orientation:'column', alignChildren:['fill','center'],\
					initProject: Button{text: 'Init project'},\
					importScenes: Button{text: 'Import scenes'},\
					renderScenes: Button{text: 'Render scenes'}\
				},\
				column2: Group\
				{\
					orientation:'column', alignChildren:['fill','center'],\
					rescale: Button{text: 'Rescale'},\
					addMagicFX: Button{text: 'Add magic FX'},\
					addSunFX: Button{text: 'Add sun FX'}\
				}\
		}\
	}";
	
	panel.group = panel.add(res);
	
	panel.group.panel.column1.initProject.onClick = function()
	{
		$.evalFile(new File($.fileName).path + "/AFX/InitProject.jsx");
	}
	panel.group.panel.column1.importScenes.onClick = function()
	{
		$.evalFile(new File($.fileName).path + "/AFX/ImportScenes.jsx");
	}
	panel.group.panel.column1.renderScenes.onClick = function()
	{
		$.evalFile(new File($.fileName).path + "/AFX/RenderScenes.jsx");
	}
	panel.group.panel.column2.rescale.onClick = function()
	{
		$.evalFile(new File($.fileName).path + "/AFX/Rescale.jsx");
	}
	panel.group.panel.column2.addMagicFX.onClick = function()
	{
		$.evalFile(new File($.fileName).path + "/AFX/AddMagicFX.jsx");
	}
	panel.group.panel.column2.addSunFX.onClick = function()
	{
		$.evalFile(new File($.fileName).path + "/AFX/AddSunFX.jsx");
	}
	
	panel.layout.layout(true);
	return panel;
}

var ui = buildUI(this);
if((ui != null) && (ui instanceof Window))
{
	ui.center();
	ui.show();
}