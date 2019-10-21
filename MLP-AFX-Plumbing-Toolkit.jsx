function mlpAfxPlumbingToolkit(thisObj)
{
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
}

mlpAfxPlumbingToolkit(this);