import { Segment } from "../model/Segment";
import { RouteCard } from "../model/RouteCard";

class GraphNode {
	private connections: GraphNode[] = [];
	private name: string;

	constructor(name: string) {
		this.name = name;
	}

	public getName() {
		return this.name;
	}

	public addConnection(node: GraphNode) {
		this.connections.push(node);
	}

	public getConnections() {
		return this.connections;
	}
}

class RouteFinder {
	private visited: GraphNode[] = [];
	private toVisit: GraphNode[] = [];

	private isVisited(node: GraphNode) {
		return this.visited.indexOf(node) !== -1;
	}

	private visit(node: GraphNode) {
		return this.visited.push(node);
	}

	public canReach(start: GraphNode, lookingFor: string): boolean {
		let reachable = false;
		this.toVisit.push(...start.getConnections());
		this.visit(start);

		while (this.toVisit.length) {
			let node = <GraphNode>this.toVisit.pop();
			this.visit(node);

			if (node.getName() === lookingFor) {
				reachable = true;
				break;
			} else {
				node.getConnections().forEach(connection => {
					if (!this.isVisited(connection)) {
						this.toVisit.push(connection);
					}
				});
			}
		}
		return reachable;
	}
}

export default class SegmentGraph {
	private graph: GraphNode[] = [];

	constructor(segments: Segment[]) {
		this.constructGraph(segments);
	}

	public addSegment(segment: Segment) {
		const n1 = this.getOrCreateNode(segment.start.name);
		const n2 = this.getOrCreateNode(segment.end.name);
		n1.addConnection(n2);
		n2.addConnection(n1);
	}

	private constructGraph(segments: Segment[]) {
		segments.forEach(segment => {
			this.addSegment(segment);
		});
	}

	private getNodeByName(name: string) {
		let existingNode;
		for (let node of this.graph) {
			if (node.getName() === name) {
				existingNode = node;
			}
		}

		return existingNode;
	}

	private getOrCreateNode(name: string): GraphNode {
		let existingNode = this.getNodeByName(name);

		if (!existingNode) {
			existingNode = new GraphNode(name);
			this.graph.push(existingNode);
		}

		return existingNode;
	}

	public isRouteComplete(route: RouteCard): boolean {
		if (!this.getNodeByName(route.start.name)) {
			return false;
		}

		return new RouteFinder().canReach(
			<GraphNode>this.getNodeByName(route.start.name),
			route.end.name
		);
	}

	public toString() {
		let str = "";
		this.graph.forEach(node => {
			node.getConnections().forEach(connectedNode => {
				str += `${node.getName()} ----------------- ${connectedNode.getName()}\n`;
			});
		});
		return str;
	}
}
