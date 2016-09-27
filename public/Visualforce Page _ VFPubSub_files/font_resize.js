/**
 * Plugin designed for presenting the desired interface for increasing/decreasing font size vs. the picklist
 */
var EditArea_font_resize= {
	/**
	 * Get called once this file is loaded (editArea still not initialized)
	 *
	 * @return nothing
	 */
	init: function(){
		//	alert("test init: "+ this._someInternalFunction(2, 3));
		editArea.load_css(this.baseURL+"css/font_resize.css");
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
			case "font_resize":
				html = "<input type=\"hidden\" id=\"area_font_size\"/>";
                html+= this._get_resize_button_html('increase',true);
                html+= this._get_resize_button_html('decrease',true);
                return html;
        }
		return false;
	}
	/**
	 * Get called once EditArea is fully loaded and initialised
	 *
	 * @return nothing
	 */
	,onload: function(){
        $("area_font_size").value = 10;
    }

    /**
	 * Executes a specific command, this function handles plugin commands.
	 *
	 * @param {string} cmd: the name of the command being executed
	 * @param {unknown} param: the parameter of the command
	 * @return true - pass to next handler in chain, false - stop chain execution
	 * @type boolean
	 */
	,execCommand: function(cmd, param){
		// Handle commands
		switch(cmd){
			case "increase":
                var size=$("area_font_size").value;
                if (size == 14) {
                    return false;

                } else if(size == 13) {
                    var img         = $("increase_fontImg");
                    img.className   = 'increase_disabled_icon';
                    img.onmouseover = this._set_style_left;
                    img.onmouseup   = this._set_style_left;
                    img.title       = editArea.get_translation("maximum");

                } else if(size == 8) {
                    var img         = $("decrease_fontImg");
                    img.className   = 'decrease_icon';
                    img.onmouseover = this._set_style_right;
                    img.onmouseup   = this._set_style_right;
                    img.title       = editArea.get_translation("decrease");
                }
                $("area_font_size").value++;
                editArea.change_font_size();
                return false;
			case "decrease":
                var size=$("area_font_size").value;
                if(size == 8) {
                    return false;

                } else if (size == 9) {
                    var img         = $("decrease_fontImg");
                    img.className   = 'decrease_disabled_icon';
                    img.onmouseover = this._set_style_left;
                    img.onmouseup   = this._set_style_left;
                    img.title       = editArea.get_translation("minimum");
                    
                } else if(size == 14) {
                    var img         = $("increase_fontImg");
                    img.className   = 'increase_icon';
                    img.onmouseover = this._set_style_right;
                    img.onmouseup   = this._set_style_right;
                    img.title       = editArea.get_translation("increase");
                }
                $("area_font_size").value--;
                editArea.change_font_size();
                return false;
		}
		// Pass to next handler in chain
		return true;
	}

    ,_set_style_right: function(event) {
        this.style.backgroundPosition = "top right";
    }

    ,_set_style_left: function(event) {
        this.style.backgroundPosition = "top left";
    }


    ,_get_resize_button_html: function(id, isFileSpecific) {
        var cmd = 'editArea.execCommand(\'' + id + '\')';
		html= '<a id="a_'+ id +'" href="javascript:' + cmd + '" onclick="' + cmd + ';return false;" onmousedown="return false;" target="_self" fileSpecific="'+ (isFileSpecific?'yes':'no') +'">';
		html+= '<img id="' + id + '_fontImg" src="/s.gif" title="{$' + id + '}" class="' + id + '_icon" onmouseover="this.style.backgroundPosition=\'top right\'" onmouseup="this.style.backgroundPosition=\'top right\'" onmouseout="this.style.backgroundPosition=\'top left\'" onmousedown="this.style.backgroundPosition=\'top left\'" /></a>';
		return html;
	}
  
};

// Adds the plugin class to the list of available EditArea plugins
editArea.add_plugin("font_resize", EditArea_font_resize);
