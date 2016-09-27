	// determine if the selected text if a comment or a quoted text
	EditArea.prototype.comment_or_quote= function(){
		var new_class="";
		var close_tag="";
		for(var i in parent.editAreaLoader.syntax[editArea.current_code_lang]["quotes"]){
			if(EditArea.prototype.comment_or_quote.arguments[0].indexOf(i)==0){
				new_class="quotesmarks";
				close_tag=parent.editAreaLoader.syntax[editArea.current_code_lang]["quotes"][i];
			}
		}
		if(new_class.length==0)
		{
			for(var i in parent.editAreaLoader.syntax[editArea.current_code_lang]["comments"]){
				if(EditArea.prototype.comment_or_quote.arguments[0].indexOf(i)==0){
					new_class="comments";
					close_tag=parent.editAreaLoader.syntax[editArea.current_code_lang]["comments"][i];
				}
			}
		}
		// for single line comment the \n must not be included in the span tags
		if(close_tag=="\n"){
			return "µ__"+ new_class +"__µ"+EditArea.prototype.comment_or_quote.arguments[0].replace(/(\r?\n)?$/m, "µ_END_µ$1");
		}else{
			// the closing tag must be set only if the comment or quotes is closed 
			reg= new RegExp(parent.editAreaLoader.get_escaped_regexp(close_tag)+"$", "m");
			if(EditArea.prototype.comment_or_quote.arguments[0].search(reg)!=-1)
				return "µ__"+ new_class +"__µ"+EditArea.prototype.comment_or_quote.arguments[0]+"µ_END_µ";
			else
				return "µ__"+ new_class +"__µ"+EditArea.prototype.comment_or_quote.arguments[0];
		}
	};

	// return identication that allow to know if revalidating only the text line won't make the syntax go mad
	EditArea.prototype.get_syntax_trace= function(text){
		if(this.settings["syntax"].length>0 && parent.editAreaLoader.syntax[this.settings["syntax"]]["syntax_trace_regexp"])
			return text.replace(parent.editAreaLoader.syntax[this.settings["syntax"]]["syntax_trace_regexp"], "$3");
	};
	
		
	EditArea.prototype.colorize_text= function(text){
		text= " "+text; // for easier regExp
		
		if(this.settings["syntax"].length>0)
			text= this.apply_syntax(text, this.settings["syntax"]);

			// remove the first space added
		var ret =  text.substr(1).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/µ_END_µ/g,"</span>").replace(/µ__([a-zA-Z0-9]+)__µ/g,"<span class='$1'>");
		
		return ret;
		
	};
	
	EditArea.prototype.apply_syntax= function(text, lang){
		this.current_code_lang=lang;
	
		if(!parent.editAreaLoader.syntax[lang])
			return text;

		if(parent.editAreaLoader.syntax[lang]["custom_regexp"]['before']){
			for( var i in parent.editAreaLoader.syntax[lang]["custom_regexp"]['before']){
				var convert="$1µ__"+ parent.editAreaLoader.syntax[lang]["custom_regexp"]['before'][i]['class'] +"__µ$2µ_END_µ$3";
				text= text.replace(parent.editAreaLoader.syntax[lang]["custom_regexp"]['before'][i]['regexp'], convert);
			}
		}
		
		if(parent.editAreaLoader.syntax[lang]["comment_or_quote_reg_exp"]){
			text= text.replace(parent.editAreaLoader.syntax[lang]["comment_or_quote_reg_exp"], this.comment_or_quote);
		}
		
		if(parent.editAreaLoader.syntax[lang]["keywords_reg_exp"]){
			for(var i in parent.editAreaLoader.syntax[lang]["keywords_reg_exp"]){	
				text= text.replace(parent.editAreaLoader.syntax[lang]["keywords_reg_exp"][i], 'µ__'+i+'__µ$2µ_END_µ');
			}			
		}
		
		if(parent.editAreaLoader.syntax[lang]["delimiters_reg_exp"]){
			text= text.replace(parent.editAreaLoader.syntax[lang]["delimiters_reg_exp"], 'µ__delimiters__µ$1µ_END_µ');
		}		
		
		if(parent.editAreaLoader.syntax[lang]["operators_reg_exp"]){
			text= text.replace(parent.editAreaLoader.syntax[lang]["operators_reg_exp"], 'µ__operators__µ$1µ_END_µ');
		}
		
		if(parent.editAreaLoader.syntax[lang]["custom_regexp"]['after']){
			for( var i in parent.editAreaLoader.syntax[lang]["custom_regexp"]['after']){
				var convert="$1µ__"+ parent.editAreaLoader.syntax[lang]["custom_regexp"]['after'][i]['class'] +"__µ$2µ_END_µ$3";
				text= text.replace(parent.editAreaLoader.syntax[lang]["custom_regexp"]['after'][i]['regexp'], convert);			
			}
		}
			
		return text;
	};
