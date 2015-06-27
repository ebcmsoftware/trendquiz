function DataPoints(name, data, america) {
    this.name = name; //string
    this.data = data; //array of [str, float]
    this.america = america; //boolean
}
DataPoints.prototype.getName = function() {
   return this.name;
}
DataPoints.prototype.getData = function() {
   return this.data;
}
DataPoints.prototype.isAmerican = function() {
   return this.america;
}

topicsArray = [];

