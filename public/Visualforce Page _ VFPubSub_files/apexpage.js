editAreaLoader.load_syntax["apexpage"] = {
	'COMMENT_SINGLE' : {}
	,'COMMENT_MULTI' : {'<!--' : '-->'}
	,'QUOTEMARKS' : {1: "'", 2: '"'}
	,'KEYWORD_CASE_SENSITIVE' : false
	,'KEYWORDS' : {
	}
	,'OPERATORS' :[
	]
	,'DELIMITERS' :[
	]
	,'REGEXPS' : {
		'doctype' : {
			'search' : '()(<!DOCTYPE[^>]*>)()'
			,'class' : 'doctype'
			,'modifiers' : ''
			,'execute' : 'before' // before or after
		}
		,'tags' : {
			'search' : '()(</?[a-z][^ \r\n\t>]*)()'
			,'class' : 'tags'
			,'modifiers' : 'gi'
			,'execute' : 'before' // before or after
		}
		,'vftags' : {
			'search' : '()(</?[a-z0-9]*:[a-z0-9][^ \r\n\t>]*)()'
			,'class' : 'vftags'
			,'modifiers' : 'gi'
			,'execute' : 'before' // before or after
		}
		,'formulas' : {
			'search' : '()({![^}]*?})()'
			,'class' : 'formulas'
			,'modifiers' : 'gi'
			,'execute' : 'before' // before or after
		}
		,'attributes' : {
			'search' : '( |\n|\r|\t)([^ \r\n\t=]+)(=)'
			,'class' : 'attributes'
			,'modifiers' : 'g'
			,'execute' : 'before' // before or after
		}
	}
	,'STYLES' : {
		'COMMENTS': 'color: #AAAAAA;'
		,'QUOTESMARKS': 'color: green;'
		,'KEYWORDS' : {
			}
		,'OPERATORS' : 'color: #E775F0;'
		,'DELIMITERS' : ''
		,'REGEXPS' : {
			'attributes': 'color: #0000FF;'
			,'formulas': ''
			,'vftags': 'color: #000099;'
			,'tags': 'color: #000099;'
			,'doctype': 'color: #8DCFB5;'
		}	
	}		
};
