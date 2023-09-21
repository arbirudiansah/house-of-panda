Number.prototype.toMoney = function () {
    if(this === 0) return this.toString()
    return this.toLocaleString()
}

export { }