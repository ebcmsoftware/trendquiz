function DataPoints(name, data) {
    this.name = name;
    this.data = data;
}
DataPoints.prototype.getName = function() {
   return this.name;
}
DataPoints.prototype.getData = function() {
   return this.data;
}

topicsArray = [];

