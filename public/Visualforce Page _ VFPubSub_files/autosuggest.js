function min(val1, val2){
    if (val1 > val2){
        return val2;
    } else {
        return val1;
    }
}

function max(val1, val2){
    if (val1 < val2){
        return val2;
    } else {
        return val1;
    }
}

var caretPosition = 0;
var theCode;
var token;

var Autosuggest = Class.create();
Autosuggest.prototype = Object.extend(new Autocompleter.Base(), {
  initialize: function(iframe, update, tagInfos, options) {
    element = (iframe.contentWindow) ? iframe.contentWindow.document : iframe.document;

    this.baseInitialize(element, update, options, iframe);
    this.options.tagInfos = tagInfos;
  },

  baseInitialize: function(element, update, options, editor) {
    this.element     = $(element);
    this.editor      = editor;
    this.update      = $(update);
    this.hasFocus    = false;
    this.changed     = false;
    this.active      = false;
    this.index       = 0;
    this.entryCount  = 0;

    /*Adding the effect.js functions manually for the autosuggest element*/
    this.update['forceRerendering'] = function(element) { Element.forceRerendering(this); };
    this.update['getInlineOpacity'] = function(element) { Element.getInlineOpacity(this); };

    if (this.setOptions)
      this.setOptions(options, this.editor);
    else
      this.options = options || {};

    this.options.paramName    = this.options.paramName || this.element.name;
    this.options.tokens       = this.options.tokens || [];
    this.options.frequency    = this.options.frequency || 0.2;
    this.options.minChars     = this.options.minChars || 0;
    this.options.onShow       = this.options.onShow ||
      function(element, update){
        Effect.Appear(update,{duration:0.15});
      };
    this.options.onHide = this.options.onHide ||
      function(element, update){ new Effect.Fade(update,{duration:0.15}) };

    if (typeof(this.options.tokens) == 'string')
      this.options.tokens = new Array(this.options.tokens);

    this.observer = null;

    Element.hide(this.update);

  Event.observe(this.element, "blur", this.onBlur.bindAsEventListener(this));
    Event.observe(this.element, "keydown", this.onKeyPress.bindAsEventListener(this));
    Event.observe(this.element, "click", this.hideIt.bindAsEventListener(this));

    var theAutoSuggestInstance = this;

    var EditArea_autosuggest= {

      init: function(){
    }

      ,onkeydown: function(e){
        if (e.keyCode == Event.KEY_RETURN) {
          if (theAutoSuggestInstance.active) {
            theAutoSuggestInstance.selectEntry();
             Event.stop(e);

             theAutoSuggestInstance.changed = true;
          theAutoSuggestInstance.hasFocus = true;

          if (theAutoSuggestInstance.observer) clearTimeout(theAutoSuggestInstance.observer);
            theAutoSuggestInstance.observer =
              setTimeout(theAutoSuggestInstance.onObserverEvent.bind(theAutoSuggestInstance), theAutoSuggestInstance.options.frequency*1000);
            theAutoSuggestInstance.active = false;
            theAutoSuggestInstance.hide();

            return false;
          }
        }
      return true;
    }
  };

    this.editor.editArea.add_plugin("autosuggest", EditArea_autosuggest);
  },

  onObserverEvent: function() {
    this.changed = false;
    if (this.getToken().length >= this.options.minChars) {
      this.startIndicator();
      this.getUpdatedChoices();
      this.positionTooltip();
    } else {
      this.active = false;
      this.hide();
    }
  },

  markPrevious: function() {
    if (this.index > 0) this.index--
    else {
      this.index = this.entryCount-1;
      this.update.scrollTop = this.update.scrollHeight;
    }

    selection = this.getEntry(this.index);
    selection_top = selection.offsetTop;
    if (selection_top < this.update.scrollTop){
      this.update.scrollTop = this.update.scrollTop - selection.offsetHeight;
    }
  },

  markNext: function() {
    if (this.index < this.entryCount-1) this.index++
    else {
      this.index = 0;
      this.update.scrollTop = 0;
    }

    selection = this.getEntry(this.index);
    selection_bottom = selection.offsetTop + selection.offsetHeight;
    if (selection_bottom > this.update.scrollTop + this.update.offsetHeight){
      this.update.scrollTop  = this.update.scrollTop + selection.offsetHeight;
    }
  },

  hideIt: function(event) {
    if (this.active) {
      this.hide();
      this.active = false;
      Event.stop(event);
      return;
    }
  },

  onClick: function(event) {
    var element = Event.findElement(event, 'LI');
    if (element.tagName != 'LI') {
      return;
    }
    this.index = element.autocompleteIndex;
    this.selectEntry();
    this.hide();
  },

  onKeyPress: function(event) {
    if (this.active)
      switch(event.keyCode) {
       case Event.KEY_RETURN:
          return;
       case 0: //IE return 0 for KEY_ESC
       case Event.KEY_ESC:
         this.hide();
         this.active = false;
         Event.stop(event);
         return;
       case Event.KEY_UP:
         this.markPrevious();
         this.render();
         Event.stop(event);
         if (navigator.appVersion.indexOf('AppleWebKit')>0) {
           Event.stop(event);
         }
         return;
       case Event.KEY_DOWN:
         this.markNext();
         this.render();
         Event.stop(event);
         if (navigator.appVersion.indexOf('AppleWebKit')>0) {
           Event.stop(event);
         }
         return;
      } else {
          if (event.keyCode==Event.KEY_TAB || event.keyCode==Event.KEY_RETURN ||
             (navigator.appVersion.indexOf('AppleWebKit') > 0 && event.keyCode == 0)) return;
    }

    this.changed = true;
    this.hasFocus = true;

    if (this.observer) clearTimeout(this.observer);
      this.observer =
        setTimeout(this.onObserverEvent.bind(this), this.options.frequency*1000);

    this.positionTooltip();
  },

  positionTooltip: function() {
    var infos = this.editor.editArea.get_selection_infos();
    var line = infos['line_start'];
    var col = infos['curr_pos'];

    var zone= this.element.getElementById("result");

    lineHeight = this.editor.editArea.lineHeight;
    charWidth = this.editor.editArea.charWidth;

  //prevent the flicking of autosuggest box, while the styling is changed
  var currentDisplay = this.update.style.display;
    this.update.style.display = 'none';

    this.update.style.height = '';
    this.update.style.overflowY = 'auto';
    this.update.style.overflowX = 'hidden';

    var dmPane = $('dmPane');
    var pageEditorTopOffset, linePositionOffset, entryHeightOffset;
    var topPadding, bottomPadding, leftPadding, rightPadding;

    //Offset for individual browser setting
    if (this.editor.parent.editAreaLoader.nav['isIE']) {
      pageEditorTopOffset= 0;
      entryHeightOffset = -1;
      linePositionOffset = dmPane ? 2 : -8;
      leftPadding = dmPane ? 44 : 53;
      topPadding = dmPane ? 52 : 45;
      bottomPadding = dmPane ? 5 : 16;
      rightPadding = dmPane ? 400 : 393;
    } else if (this.editor.parent.editAreaLoader.nav['isSafari']) {
        pageEditorTopOffset= 4;
        entryHeightOffset = -2;
        linePositionOffset = dmPane ? 6 : -23;
        leftPadding = dmPane ? 44 : 45;
        topPadding = dmPane ? 52 : 60;
        bottomPadding = dmPane ? 5 : 34;
        rightPadding = dmPane ? 400 : 393;
    } else {
      pageEditorTopOffset= 4;
      entryHeightOffset = 0;
      linePositionOffset = dmPane ? 6 : 0;
      leftPadding = dmPane ? 44 : 310;
      topPadding = dmPane ? 52 : 296;
      bottomPadding = dmPane ? 5 : 11;
      rightPadding = dmPane ? 400 : 129;
    }

    if (dmPane) {
      this.update.style.left = min(leftPadding  + (col * charWidth) - zone.scrollLeft, zone.clientWidth - rightPadding) + 'px';
    } else {
      this.update.style.left = min(leftPadding + (col * charWidth) - zone.scrollLeft, zone.clientWidth - rightPadding) + 'px';
    }

    if (this.entryCount > 0){
      //Entry Information and Setting
      var minNumberOfEntry = 5;
      var entryHeight = 20 + entryHeightOffset;
      var calculatedHeight = this.entryCount * entryHeight;
      var minEntryHeight = min(entryHeight * minNumberOfEntry, calculatedHeight);

      //Top and Bottom Limit of the EditArea
      var topLimit = topPadding + pageEditorTopOffset + 2;
      var bottomLimit = (topLimit + zone.clientHeight - bottomPadding);

      //Calculation the location of autosuggest box
      var calculatedTop = topPadding  + linePositionOffset + (line * lineHeight) - zone.scrollTop;
      var remainingSpace = bottomLimit - calculatedTop;

      if ( remainingSpace <= minEntryHeight ) {
        this.update.style.top = (bottomLimit - minEntryHeight) + 'px';
        this.update.style.height = minEntryHeight + 'px';
      }else{
        this.update.style.top =  calculatedTop + 'px';
        this.update.style.height = min (calculatedHeight, remainingSpace) + 'px';
      }
    }

    this.update.style.display = currentDisplay;
  },

  updateChoices: function(choices) {
      if(!this.changed && this.hasFocus) {
        this.update.innerHTML = choices;
        Element.cleanWhitespace(this.update);
        if (this.update.down()) {
            Element.cleanWhitespace(this.update.down());
        }

        if(this.update.firstChild && this.update.down() && this.update.down().childNodes) {
          this.entryCount =
            this.update.down().childNodes.length;
          for (var i = 0; i < this.entryCount; i++) {
            var entry = this.getEntry(i);
            entry.autocompleteIndex = i;
            this.addObservers(entry);
          }
        } else {
          this.entryCount = 0;
        }

        this.stopIndicator();
        this.update.scrollTop = 0;
        this.index = 0;

        if(this.entryCount==1 && this.options.autoSelect) {
          this.selectEntry();
          this.hide();
        } else {
          this.render();
        }
      }
    },

  getUpdatedChoices: function() {
    this.updateChoices(this.options.selector(this));
  },

  getEntry: function(index) {
    return this.update.firstChild.childNodes[index];
  },

  getCurrentEntry: function() {
    return this.getEntry(this.index);
  },

  selectEntry: function() {
    this.active = false;
    this.updateElement(this.getCurrentEntry());
  },

  getToken: function() {
    var infos = this.editor.editArea.get_selection_infos();
    var line = infos['line_start'];
    var col = infos['curr_pos'];
    theCode = infos['full_text'];
    caretPosition = infos['indexOfCursor'];
    var beforeToken; //everything before the caret
    var endToken; //everything after

  var beforeToken = theCode.substring(0, caretPosition);
  var endToken = theCode.substring(caretPosition);

  var beginPos = -1;
  for(var i = 0; i < this.options.tokens.length; i++) {
    beginPos = max(beforeToken.lastIndexOf(this.options.tokens[i]), beginPos);
  }
  /*if (theCode.charAt(beginPos) != '<') {
    return ''; //for now, we only return the token if it's a tag;
  }*/
  beginPos++; //if not found, we are at the beginning and want the position at 0
              //if found, we increment so that when we do a substring with the
              //beginning position, we don't include the delimiter

  var endPos = theCode.length;
  for(var i = 0; i < this.options.tokens.length; i++) {
    var tokenPos = endToken.indexOf(this.options.tokens[i]);
    if (tokenPos != -1) {
      endPos = min(tokenPos, endPos);
    }
  }

  var token = theCode.substring(beginPos, endPos + beforeToken.length).strip();
  this.token = token;
  return token;
  },

  updateElement: function(selectedElement) {
    var value = '';
    if (this.options.select) {
      var nodes = document.getElementsByClassName(this.options.select, selectedElement) || [];
      if (nodes.length>0) value = Element.collectTextNodes(nodes[0], this.options.select);
    } else {
      value = Element.collectTextNodesIgnoreClass(selectedElement, 'informal');
    }
  var type = selectedElement.id;

    var tagInfo = this.options.tagInfos[value];
  value = value.substring(this.token.length);
  var newText;
    var newPos;
  if (tagInfo) {//It's a tag
      newText = theCode.substring(0, caretPosition) + value;

    if (tagInfo.simple) {
      newText += "/>";
      newPos = caretPosition + value.length;
    }
    else {
      newText += '></' + this.token + value + '>';
      newPos = caretPosition + value.length + 1;
    }
  }else if(type === "val"){ // it's an attribute value
    newText = theCode.substring(0, caretPosition) + value;
    newPos = caretPosition + value.length+1;
    }else{//It's an attribute
      value = value.substring(0,value.indexOf(" "))
        newText = theCode.substring(0, caretPosition) + value + '=""';
    newPos = caretPosition + value.length+2;
  }

    newText += theCode.substring(caretPosition);

    this.editor.parent.editAreaLoader.setValueWithPos(this.editor.editArea.id, newText, newPos, newPos);
  },

  setOptions: function(options, editor) {
    this.options = Object.extend({
      choices: 500,
      partialSearch: true,
      partialChars: 2,
      ignoreCase: true,
      fullSearch: false,
      selector: function(instance) {
        var ret       = []; // Beginning matches
        var partial   = []; // Inside matches
        var entry     = instance.getToken();
        var count     = 0;

    var infos = editor.editArea.get_selection_infos();
    var theCode = infos['full_text'];
    var beginToken = theCode.substring(0, infos['indexOfCursor']);

    var lastTagOpening = beginToken.lastIndexOf('<');
    var lastTagClosing = beginToken.indexOf('>',lastTagOpening);
    var lastSpace = beginToken.indexOf(' ',lastTagOpening);


    var completions = [];
    var col = infos['curr_pos'];
    var index = infos['indexOfCursor'];
        theCode = infos['full_text'];

    var type;
        if( theCode.substring(theCode.lastIndexOf('"',index-1),index+1).match(new RegExp("\"\\s*\\w*\\s*\"") ) ){ //This may be an attrib value
            type = "val";
            var space = theCode.lastIndexOf(" " ,index-1);
            var eq = theCode.indexOf("=",space);
      if(eq != -1 && space < index-1 && eq < index){
        var attrib = theCode.substring(space+1,eq);
        var endOfTag = beginToken.indexOf(' ',lastTagOpening);
                var tag = beginToken.substring(lastTagOpening+1, endOfTag);
                var attribValues = instance.options.tagInfos[tag].attribs[attrib].values;
                if(attribValues){
                  for(var i=0;i<attribValues.length;i++){
                    completions.push(attribValues[i]);
                  }
                }

      }
        }

    if(!type){
      if(theCode.substring(index-1,index) !== '"' &&
           lastTagClosing < lastTagOpening &&
         lastSpace > lastTagOpening){ //Attributes
        var lastEq = max(beginToken.lastIndexOf('=\"'), beginToken.lastIndexOf('=\''));
          var lastQu = max(beginToken.lastIndexOf('\"'), beginToken.lastIndexOf('\''));
          if (lastEq > lastTagOpening && lastEq + 1 === lastQu)return;
        var endOfTag = beginToken.indexOf(' ',lastTagOpening);
        var tag = beginToken.substring(lastTagOpening+1, endOfTag);
        var tagInfo = instance.options.tagInfos[tag];
        if(tagInfo){
          type = "attrib";
          var attribs = tagInfo.attribs;
          for(var attribName in attribs){
            var attrib = attribs[attribName];
            completions.push(attribName + " ("+attrib.type+")");
          }
        }
      }else if(lastTagClosing == -1 && lastTagOpening > -1 && lastSpace == -1){ //Tag
          type = "tag";
        for (var elem in instance.options.tagInfos) {
          completions.push(elem);
        }
      }
      }

        for (var i=0;i < completions.length && ret.length < instance.options.choices;i++) {
            var elem = completions[i];

            var foundPos = instance.options.ignoreCase ?
                elem.toLowerCase().indexOf(entry.toLowerCase()) :
                elem.indexOf(entry);
            while (foundPos != -1) {
              if (foundPos == 0 && elem.length != entry.length) {
                    ret.push('<li id="'+type+'"><b>' + elem.substr(0, entry.length) + "</b>" +
                     elem.substr(entry.length) + "</li>");
                    break;
              } else if (entry.length >= instance.options.partialChars &&
                        instance.options.partialSearch && foundPos != -1) {
                    if (instance.options.fullSearch || /\s/.test(elem.substr(foundPos-1,1))) {
                        partial.push('<li id="'+type+'">' + elem.substr(0, foundPos) + "<b>" +
                            elem.substr(foundPos, entry.length) + "</b>" + elem.substr(
                            foundPos + entry.length) + "</li>");
                     break;
                    }
              }

              foundPos = instance.options.ignoreCase ?
                    elem.toLowerCase().indexOf(entry.toLowerCase(), foundPos + 1) :
                    elem.indexOf(entry, foundPos + 1);
            }
        }
        if (partial.length)
          ret = ret.concat(partial.slice(0, instance.options.choices - ret.length))
        return "<ul>" + ret.join('') + "</ul>";
      }
    }, options || {});
  }
});
