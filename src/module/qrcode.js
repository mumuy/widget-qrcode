// https://github.com/davidshimjs/qrcodejs

import QRErrorCorrectLevel from './method/QRErrorCorrectLevel.js';
import QRCodeLimitLength from './method/QRCodeLimitLength.js';
import QRCodeModel from './method/QRCodeModel.js';

function _getTypeNumber(sText, nCorrectLevel) {
	var nType = 1;
	var length = _getUTF8Length(sText);
	for (var i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
		var nLimit = 0;
		switch (nCorrectLevel) {
			case QRErrorCorrectLevel.L:
				nLimit = QRCodeLimitLength[i][0];
				break;
			case QRErrorCorrectLevel.M:
				nLimit = QRCodeLimitLength[i][1];
				break;
			case QRErrorCorrectLevel.Q:
				nLimit = QRCodeLimitLength[i][2];
				break;
			case QRErrorCorrectLevel.H:
				nLimit = QRCodeLimitLength[i][3];
				break;
		}
		if (length <= nLimit) {
			break;
		} else {
			nType++;
		}
	}
	if (nType > QRCodeLimitLength.length) {
		throw new Error("Too long data");
	}
	return nType;
}

function _getUTF8Length(sText) {
	var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
	return replacedText.length + (replacedText.length != sText ? 3 : 0);
}

export default function(text = 'https://passer-by.com/', level= 'H') {
	let qrcode  = new QRCodeModel(_getTypeNumber(text, QRErrorCorrectLevel[level]), QRErrorCorrectLevel[level]);
	qrcode.addData(text);
	qrcode.make();
	return qrcode.modules;
};
