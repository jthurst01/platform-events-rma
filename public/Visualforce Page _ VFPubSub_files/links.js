/**
 * Plugin designed for adding links to the toolbar to help oriented information
 */
var EditArea_links= {
	/**
	 * Get called once this file is loaded (editArea still not initialized)
	 *
	 * @return nothing
	 */
	init: function(){
		editArea.load_css(this.baseURL+"css/links.css");
		editArea.load_script("/js/functions.js");
        editArea.load_script(this.baseURL+"link_functions.js");
    }
	/**
	 * Returns the HTML code for a specific control string or false if this plugin doesn't have that control.
	 * A control can be a button, select list or any other HTML item to present in the EditArea user interface.
	 * Language variables such as {$lang_somekey} will also be replaced with contents from
	 * the language packs.
	 *
	 * @param {string} ctrl_name: the name of the control to add
	 * @return HTML code for a specific control or false.
	 * @type string	or boolean
	 */
	,get_control_html: function(ctrl_name){
		switch(ctrl_name){
			case "component_reference":
			    if (!window.parent) return false;
			    var href = window.parent.componentReferenceUrl;
			    if (!href) return false;
				html = "<a class=\"devmodeLink\" href=\"" + href + "\">{$comp_ref}</a>";
                return html;
            case "where_is_this_used":
            	if (!window.parent) return false;
            	var href = window.parent.whereIsThisUsedUrl;
            	if (!href) return false;
				html = "<a class=\"devmodeLink\" href=\"" + href + "\">{$where_used}</a>";
				return html;
            case "show_viewstate":
                html = "<a class=\"devmodeLink\" href=\"javascript:showViewstate('" + editArea.settings['viewstateHrefUri'] + "')\" onmouseover=\"this.title = getViewstateSize('" + editArea.settings['sfdc_name'] + "')\">";
			    html+= "<img src=\"/img/apexpages/editor/magglass.gif\" width=\"16\" height=\"16\"/>";
			    html+= "</a>";
                return html;
        }
		return false;
	}
};

// Adds the plugin class to the list of available EditArea plugins
editArea.add_plugin("links", EditArea_links);
