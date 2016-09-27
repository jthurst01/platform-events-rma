function showViewstate(page) {
	openPopupFocusEscapePounds('/apexpages/viewstateinfo.apexp?page=' + page, 'Help', 700, 600, 'width=700,height=600,resizable=yes,toolbar=yes,status=no,scrollbars=yes,menubar=yes,directories=no,location=no,dependant=no', false, false);
}

function getViewstateSize(pageName) {
	var contentDoc = window.parent.$('contentPane').contentWindow.document;
	var e = contentDoc.getElementsByName('com.salesforce.visualforce.ViewState');
	if (!e) {
		return 'No view state defined in ' + pageName;
	}

	var total = 0;
	for (n = 0; n < e.length; n++) {
		total += e[n].value.length;
	}
	
	var viewstate = 'Total viewstate ' + (Math.round((total / 1024) * 100) / 100) + 'K';
	if (e.length > 1) {
		viewstate += " (" + e.length + "X redundancy)";
	}
	
	return viewstate;
}
