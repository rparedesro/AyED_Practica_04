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
        return 1 + (Math.max(getHeight(node.left), getHeight(node.right))); 
}
function generate_dot(node) { 
    var cad = '';
	if(node == null)
		return '';

	if(node.left!=null)
	{
		cad = cad + '"' + node.point.toString() + "\"";
		cad = cad + " -> " + '"' + node.left.point.toString() + '"' + ";" + "\n";
	}
	if(node.right!=null)
	{
		cad = cad + "\"" + node.point.toString() + "\"";
		cad = cad + " -> " + '"' + node.right.point.toString() + '"' + ";" + "\n";
	}
	return cad + generate_dot(node.left) + generate_dot(node.right);
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

function distanceSquared ( point1 , point2 ){
    var distance = 0;
    for (var i = 0; i < k; i ++)
    distance += Math.pow (( point1 [i] - point2 [i]) , 2) ;
    return Math.sqrt ( distance );
}

function closest_point_brute_force ( points , point ) {
    var PointCe = points[0];
	var DistanceMin = distanceSquared(points[0], point);
	for (var i = 1; i < points.length; i++) {
		var t = distanceSquared(points[i], point);
		if (DistanceMin > t) {
			PointCe = points[i];
			DistanceMin = t;
		}
	}
	return PointCe;
}

function naive_closest_point(node, point, depth = 0, best = null) {
	if (node != null) {
		var dis = distanceSquared(node.point, point);
		console.log(dis);
		if (best != null && distanceSquared(best, point) < dis) {
			return best;
		}
		else {
			if (node.point[node.axis] > point[node.axis]) {
				return naive_closest_point(node.left, point, depth + 1, node.point);
			}
			else {
				return naive_closest_point(node.right, point, depth + 1, node.point);
			}
		}
	}
	else {
		return best;
	}	
}

function closest_point(node, point, depth = 0) {
	if (node === null)
		return null;
	var axis = depth % k;
	var next_branch = null;
	var opposite_branch = null;
	if (point[axis] < node.point[axis]) {
		next_branch = node.left;
		opposite_branch = node.right;
	} else {
		next_branch = node.right;
		opposite_branch = node.left;
	}
	var best = closer_point(point, node, closest_point(next_branch, point, depth + 1));
	if (distanceSquared(point, best.point) > Math.abs(point[axis] - node.point[axis])) {
		best = closer_point(point, best, closest_point(opposite_branch, point, depth + 1));
	}

	return best;
}

function KNN(points, point, K)
{
	var PointCe = [];
	var Result = [];
	var pointm=points[0];
	for (var i = 0; i < points.length; i++) 
	{
		var aux=distanceSquared(points[i],point);
		PointCe.push([aux,points[i]])
		//console.log(PointCe[i])

		PointCe.sort(function (a,b){
			return a[0]-b[0];
		});
	}
	for(var i = 0; i < PointCe.length; i++){
		Result.push(PointCe[i].slice(1,2));
	}
	console.log(Result.slice(0, k))
}

var p = 0;
function range_query_circle(node, center, radio, queue, depth = 0) {
	if (node == null) {
		return null;
	}
	p += 1;
	console.log(p);
	var axis = node.axis;
	var next_branch = null;
	var opposite_branch = null;
	if (center[axis] < node.point[axis]) {
		next_branch = node.left;
		opposite_branch = node.right;
	} else {
		next_branch = node.right;
		opposite_branch = node.left;
	}
	var best = closer_point(center, node, range_query_circle(next_branch, center, radio, queue, depth + 1));
	if (Math.abs(center[axis] - node.point[axis]) <= radio || distanceSquared(center, best.point) > Math.abs(center[axis] - node.point[axis])) {
		if (distanceSquared(center, node.point) <= radio) {
			queue.push(node.point);
		}
		best = closer_point(center, best, range_query_circle(opposite_branch, center, radio, queue, depth + 1));
	}

	return best;
}


function range_query_rect(node, center, hug, queue, depth = 0) {
	if (node == null) {
		return null;
	}
	p += 1;
	console.log(p);
	var axis = node.axis;
	var next_branch = null;
	var opposite_branch = null;
	if (center[axis] < node.point[axis]) {
		next_branch = node.left;
		opposite_branch = node.right;
	} else {
		next_branch = node.right;
		opposite_branch = node.left;
	}
	var best = closer_point(center, node, range_query_rect(next_branch, center, hug, queue, depth + 1));
	if (Math.abs(center[axis] - node.point[axis]) <= hug[axis] * 2 || distanceSquared(center, best.point) > Math.abs(center[axis] - node.point[axis])) {
		if (Math.abs(center[0] - node.point[0]) <= hug[0] && Math.abs(center[1] - node.point[1]) <= hug[1]) {
			queue.push(node.point);
		}
		best = closer_point(center, best, range_query_rect(opposite_branch, center, hug, queue, depth + 1));
	}

	return best;
}

var data = [
    [40 ,70] ,
    [70 ,130] ,
    [90 ,40] ,
    [110 , 100] ,
    [140 ,110] ,
    [160 , 100]
];

var point = [140 ,90]; // query

closest_point_brute_force ( data , point )

