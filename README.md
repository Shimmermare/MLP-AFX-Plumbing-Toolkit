## MLP AFX Plumbing Toolkit ##
A few Flash and After Effects scripts to make live of a *plumber* easier.  

This toolkit, roughly speaking, replicates Flash-AFX pipeline that was used by DHX Media during production of My Little Pony: Friendship is Magic.  

### How to install ###
1. Get Macromedia Flash 8. **Only Flash 8 is supported at the moment because MLP itself was created in it (at least first seasons).**  
2. Create After Effects project in a separate folder anywhere you like.  
3. Download toolkit and place it in project folder.  
4. To open toolkit, `File -> Scripts -> Run Script File...` and select `MLP-AFX-Plumbing-Toolkit.jsx`.  
5. Click `Init project` button. You'll need to specify flash executable location.  
  
### How to use ###  

#### Import scenes ####  
To import flash scenes, place them into **`ScenesFlash/`** folder inside project directory, that should be created after project initialization. If doesn't exist - please report as bug. Use button **`Import scenes`** to import. That will automatically compile every .fla as SWF into **`ScenesSWF/`** folder and add them to timeline. Operation is lazy: no unnecessary work will be done, i.e. if scene wasn't modified since last time it won't be compiled again. Use every time new scene is added.  
  
If scene can't be compiled or rendered for whatever reason (for example scene `MLP214_085`), you can add SWF file or PNG sequence (in folder) into **`ScenesManual/`** folder and scene will be imported normally.  

#### Render scenes ####  
Use button **`Render scenes`** to render already imported scenes to PNG sequences at composition's resolution and replace SWFs. Timeline won't be affected. Lazy operation. Rendered images can be found in **`ScenesPNG/`**.

#### Rescale ####  
Use button **`Rescale`** to rescale project.  
  
#### Magic FX ####  
Use button **`Add Magic FX`** to add horn magic FX to layer.  
TODO  
  
#### Sun FX ####  
Use button **`Sun FX`** to add sun FX.  
TODO   