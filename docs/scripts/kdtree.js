k = 2;

class Node {
    constructor(point, axis) {
        this.point = point;
        this.left = null;
        this.right = null;
        this.axis = axis;
    }
}

function getHeight(node) {
	if(node == null)   
		return 0;
	else   
		return 1 +(Math.max(getHeight(node.left),getHeight(node.right)));   
}

function generate_dot(node){
	var cad="";
	if(node==null)
		return "";

	if(node.left!=null)
	{
		cad=cad+'"'+node.point.toString()+"\"";
		cad=cad+" -> "+'"'+node.left.point.toString()+'"'+";"+"\n";
	}
	if(node.right!=null)
	{
		cad=cad+"\""+node.point.toString()+"\"";
		cad=cad+" -> "+'"'+node.right.point.toString()+'"'+";"+"\n";
	}
	return cad+generate_dot(node.left)+generate_dot(node.right);
}

function build_kdtree(points, depth = 0) {
    var n = points.length;
    var axis = depth % k;


    if (n <= 0) {
        return null;
    }
    if (n == 1) {
        return new Node(points[0], axis)
    }

    var median = Math.floor(points.length / 2);

    // sort by the axis
    points.sort(function (a, b) {
        return a[axis] - b[axis];
    });
    //console.log(points);

    var left = points.slice(0, median);
    var right = points.slice(median + 1);

    //console.log(right);

    var node = new Node(points[median].slice(0, k), axis);
    node.left = build_kdtree(left, depth + 1);
    node.right = build_kdtree(right, depth + 1);

    return node;

}

