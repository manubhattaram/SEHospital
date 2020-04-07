const presc = (x, y) => {
	m = "monthly"
	w = "weekly"
	if(x.localeCompare(m)==0){
		return y*30
	}
	else if(x.localeCompare(w)==0){
		return y*7
	}
}

module.exports = { presc }
