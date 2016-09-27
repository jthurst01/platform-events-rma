
if(!window.RichFaces)window.RichFaces={};var RichFaces_FF_Loaded=(RichFaces.navigatorType()==RichFaces.FF);RichFaces.panelTabs={};RichFaces.tabPanel={};RichFaces.createImage=function(src){var img=new Image();img.src=src;return img;}
RichFaces.setLabelImages=function(element,image,mouseoverimage){element=$(element);if(element){element._image=this.createImage(image);element._mouseoverimage=this.createImage(mouseoverimage);}}
RichFaces.isTabActive=function(tabId){var tab=$(tabId);if(tab){return Element.hasClassName(tab,"rich-tab-active");}
return false;}
RichFaces.switchTab=function(pane,tab,value){var labelSuffix="_lbl";var cellSuffix="_cell";var shiftedTableSuffix="_shifted";var contentSuffix="";var tabs=RichFaces.panelTabs[pane];var activeTab;var FF=RichFaces_FF_Loaded;if(tabs){for(var i=0;i<tabs.length;i++){var tabi=tabs[i];var tabId=tabi.id;var tabElement=$(tabId+contentSuffix);var tabLabelId=tabId+labelSuffix;var tabLabel=$(tabLabelId);var tabCellId=tabId+cellSuffix;var tabCell=$(tabCellId);var shiftedTable=$(tabId+shiftedTableSuffix);if(tabId==tab){if(tabElement){Element.show(tabElement);}
activeTab=tabi;if(!FF){if(tabLabel){tabLabel.className=tabi.activeClass;}
if(tabCell){tabCell.className=tabi.cellActiveClass;}}}else{if(tabElement){Element.hide(tabElement);}
if(tabLabel){tabLabel.className=tabi.inactiveClass;}
if(tabCell){tabCell.className=tabi.cellInactiveClass;}
if(shiftedTable){shiftedTable.style.top="0px";}}}}
if(FF&&activeTab){var tabLbl=$(activeTab.id+labelSuffix);var tabCell=$(activeTab.id+cellSuffix);if(!tabLbl||!tabLabel||!tabCell){return;}
var parentTable=RichFaces.findNestingTable(tabLbl);var par=parentTable.parentNode;var bro=parentTable.nextSibling;par.removeChild(parentTable);tabLbl.className=activeTab.activeClass;par.insertBefore(parentTable,bro);parentTable=RichFaces.findNestingTable(tabCell);par=parentTable.parentNode;bro=parentTable.nextSibling;par.removeChild(parentTable);tabCell.className=activeTab.cellActiveClass;par.insertBefore(parentTable,bro);}
$(tab+'_shifted').style.top="1px";$(pane+"_input").value=value;}
RichFaces.findNestingTable=function(tablabel){var parent=tablabel.parentNode;while(parent&&parent.nodeName.toLowerCase()!='table'){parent=parent.parentNode;}
return parent;}
RichFaces.overTab=function(tab){if(RichFaces._shouldHoverTab(tab)){Element.addClassName(tab,'rich-tbpnl-tb-sel');}}
RichFaces.outTab=function(tab){if(RichFaces._shouldHoverTab(tab)){Element.removeClassName(tab,'rich-tbpnl-tb-sel');}}
RichFaces._shouldHoverTab=function(tab){return(tab.className.indexOf('rich-tab-active')<0);}
RichFaces.onTabChange=function(event,pane,tab){var labelSuffix="_lbl";var tabs=RichFaces.panelTabs[pane];var lastActive,newActive;if(tabs){for(var i=0;i<tabs.length;i++){if(lastActive&&newActive)break;var tabId=tabs[i].id;if(tabId==tab)
newActive=tabs[i];if(RichFaces.isTabActive(tabId+labelSuffix))
lastActive=tabs[i];}}
if(lastActive&&newActive){if(event){event.leftTabName=lastActive.name;event.enteredTabName=newActive.name;}
if(lastActive.ontableave&&lastActive.ontableave!=""){var func=new Function("event",lastActive.ontableave);var result=func(event);if(typeof(result)=='boolean'&&!result)return false;}
if(newActive.ontabenter&&newActive.ontabenter!=""){var func=new Function("event",newActive.ontabenter);var result=func(event);if(typeof(result)=='boolean'&&!result)return false;}
try{var tabPanel=RichFaces.tabPanel[pane];if(tabPanel.ontabchange&&tabPanel.ontabchange!=""){var func=new Function("event",tabPanel.ontabchange);var result=func(event);if(typeof(result)=='boolean'&&!result)return false;}}catch(e){}}
return true;}