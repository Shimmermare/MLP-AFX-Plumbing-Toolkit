## MLP AFX Plumbing Toolkit ##
A few Flash and After Effects scripts to make live of a *plumber* easier.  

This toolkit, roughly speaking, replicates Flash-AFX pipeline that was used by DHX Media during production of My Little Pony: Friendship is Magic.  

### How to install ###
1. Get Flash (*not Flash Player*). **For MLP, use Macromedia Flash 8 for seasons 1-4, Adobe Flash CS4 for seasons 5-6 and Adobe Flash CC for seasons 7-9.**  
2. Create After Effects project in a separate folder anywhere you like. Save that project at least once.  
3. Download toolkit and place it in project folder (only for convenience, should work from anywhere).  
4. Install toolkit: **`File -> Scripts -> Install ScriptUI Panel...`** and select **`MLP-AFX-Plumbing-Toolkit.jsx`**.  
5. Reload After Effects.  
6. `Window -> MLP-AFX-Plumbing-Toolkit.jsx` to open toolkit window. You can add it to main UI by simple drag-and-drop.
7. Click **`Init project`** button to initialize project. Type in flash executable location and other parameters.
8. **Don't delete any created files (`.flashPath`, `ScenesFlash`, `ScenesPNG`)and project items (`Scenes`, composition with the name of project).**
  
### How to use ###  

#### Scenes ####
Flash source folder is **`(project dir)/ScenesFlash/`**. When you add, modify or delete flash scenes, use **`Update scenes`** button in toolkit. It will automatically render new scenes, re-render modified (*only modified!*) scenes, and move deleted scenes to **`(project dir)/ScenesManual/`** for rendered files and to **`ScenesManual`** for project items.  
  
Video files, SWFs and even FLAs can be added as scenes too: just drop it into **`ScenesManual/`**. After **`Update scenes`** they'll be added to **`ScenesManual`** project folder as footage items.  

#### Rescale ####  
Use **`Rescale`** button to rescale project.  
  
#### Magic FX ####  
Magic FX is a few simple effects on a layer.  
  
To get this result:  
![Final effect look](MagicFX_Example_Final.png)  
  
You need to render affected object as PNG frame sequence or use AFX mask. **Regardless of method, only the object should be in the scene.** That looks like this:  
![Levitated object only](MagicFX_Example_Layer.png)  
  
Use **`Add Magic FX`** button to add magic FX to **currently selected layer**.  

##### Main Parameters #####  
* **Color**: magic color in hex.  
* **Underlay**: the farthest tint of magic. Lower values means bigger size.  
* **Overlay outer edge**: the size of brightest part of effect.  
* **Overlay inner edge**: this size of inner, smooth edge of effect.  
  
Values of `#ED438D`, `-20.5`, `-20.9`, `-7.8` give this effect:  
![Effect only](MagicFX_Example_EffectOnly.png)  
  
To easily modify effect, select layer and use **`Edit magic FX`** function from toolkit.  