module.exports = username => {
	if (!username) {
		return false;
	}

	if (username.length < 8 && username.length > 100) {
		return false;
	}
	
	if (!isAlpha(username)) {
		return false;
	}
	
	return true;
}

const isAlpha = (str) => {
	//starting from beginning ^
	//to the end $
	//check first letter is alpha or underscore [A-Za-z_]
	//check the remaining 0 or more (*) letters are alpha, numeric or underscore [A-Za-z0-9_]
	return /^[A-Za-z_][A-Za-z0-9_]*$/.test(str);
}
