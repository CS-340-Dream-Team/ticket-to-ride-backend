import SegmentGraph from "../../src/utils/SegmentGraph";
import { Segment } from "../../src/model/Segment";
import { RouteCard } from "../../src/model/RouteCard";

const segments: Segment[] = <Segment[]>(<unknown>[
	{
		id: 1,
		start: {
			name: "Baseball Stadium",
			latLong: {
				lat: 40.254821,
				long: -111.651125,
			},
		},
		end: {
			name: "LaVell Edwards Stadium",
			latLong: {
				lat: 40.257536,
				long: -111.654664,
			},
		},
		length: 1,
		owner: null,
		pair: 2,
		color: "any",
	},
	{
		id: 2,
		start: {
			name: "Baseball Stadium",
			latLong: {
				lat: 40.254821,
				long: -111.651125,
			},
		},
		end: {
			name: "LaVell Edwards Stadium",
			latLong: {
				lat: 40.257536,
				long: -111.654664,
			},
		},
		length: 1,
		owner: null,
		pair: 1,
		color: "any",
	},
	{
		id: 3,
		start: {
			name: "Baseball Stadium",
			latLong: {
				lat: 40.254821,
				long: -111.651125,
			},
		},
		end: {
			name: "The Wilk",
			latLong: {
				lat: 40.248543,
				long: -111.647104,
			},
		},
		length: 3,
		owner: null,
		pair: 4,
		color: "green",
	},
	{
		id: 4,
		start: {
			name: "Baseball Stadium",
			latLong: {
				lat: 40.254821,
				long: -111.651125,
			},
		},
		end: {
			name: "The Wilk",
			latLong: {
				lat: 40.248543,
				long: -111.647104,
			},
		},
		length: 3,
		owner: null,
		pair: 3,
		color: "yellow",
	},
	{
		id: 82,
		start: {
			name: "The Wilk",
			latLong: {
				lat: 40.248543,
				long: -111.647104,
			},
		},
		end: {
			name: "BYU Independent Study",
			latLong: {
				lat: 40.253645,
				long: -111.644678,
			},
		},
		length: 2,
		owner: null,
		pair: null,
		color: "any",
	},
	{
		id: 45,
		start: {
			name: "Provo Temple",
			latLong: {
				lat: 40.263665,
				long: -111.639844,
			},
		},
		end: {
			name: "Day's Market",
			latLong: {
				lat: 40.275109,
				long: -111.652089,
			},
		},
		length: 3,
		owner: null,
		pair: null,
		color: "any",
	},
]);

const routeThatShouldBeComplete: RouteCard = <RouteCard>{
	name: "routeThatShouldBeComplete",
	points: 4,
	start: {
		name: "Baseball Stadium",
		latLong: {
			lat: 40.245433,
			long: -111.652399,
		},
	},
	end: {
		name: "BYU Independent Study",
		latLong: {
			lat: 40.240334,
			long: -111.642054,
		},
	},
};

const routeThatShouldNotBeComplete: RouteCard = <RouteCard>{
	name: "routeThatShouldNotBeComplete",
	points: 4,
	start: {
		name: "Baseball Stadium",
		latLong: {
			lat: 40.245433,
			long: -111.652399,
		},
	},
	end: {
		name: "Provo Temple",
		latLong: {
			lat: 40.240334,
			long: -111.642054,
		},
	},
};

const routeThatCanBeCompletedByAddingToMiddle = {
	route: <RouteCard>{
		name: "routeThatCanBeCompletedByAddingToMiddle",
		points: 4,
		start: {
			name: "Baseball Stadium",
			latLong: {
				lat: 40.245433,
				long: -111.652399,
			},
		},
		end: {
			name: "Provo Temple",
			latLong: {
				lat: 40.240334,
				long: -111.642054,
			},
		},
	},
	segmentToComplete: <Segment>(<unknown>{
		id: 7,
		start: {
			name: "BYU Independent Study",
			latLong: {
				lat: 40.253645,
				long: -111.644678,
			},
		},
		end: {
			name: "Provo Temple",
			latLong: {
				lat: 40.263665,
				long: -111.639844,
			},
		},
		length: 4,
		owner: null,
		pair: null,
		color: "red",
	}),
};

let graph: SegmentGraph;

test("constructor", () => {
	graph = new SegmentGraph(segments);
	expect(true);
});

test("should correctly recognize if route is complete", () => {
	expect(graph.isRouteComplete(routeThatShouldBeComplete)).toBe(true);
});

test("should correctly recognize if route is incomplete", () => {
	expect(graph.isRouteComplete(routeThatShouldNotBeComplete)).toBe(false);
});

test("can claim middle segment to complete route", () => {
	expect(graph.isRouteComplete(routeThatCanBeCompletedByAddingToMiddle.route)).toBe(false);
	graph.addSegment(routeThatCanBeCompletedByAddingToMiddle.segmentToComplete);
	expect(graph.isRouteComplete(routeThatCanBeCompletedByAddingToMiddle.route)).toBe(true);
});

test("can claim starting segment to complete route", () => {
	const route = <RouteCard>(<unknown>{
		name: "routeThatCanBeCompletedByAddingToBeginning",
		points: 4,
		start: {
			name: "Baseball Stadium",
			latLong: {
				lat: 40.245433,
				long: -111.652399,
			},
		},
		end: {
			name: "BYU Independent Study",
			latLong: {
				lat: 40.240334,
				long: -111.642054,
			},
		},
	});

	graph = new SegmentGraph(<Segment[]>(<unknown>[
		{
			id: 82,
			start: {
				name: "The Wilk",
				latLong: {
					lat: 40.248543,
					long: -111.647104,
				},
			},
			end: {
				name: "BYU Independent Study",
				latLong: {
					lat: 40.253645,
					long: -111.644678,
				},
			},
			length: 2,
			owner: null,
			pair: null,
			color: "any",
		},
	]));

	const firstSegment = <Segment>(<unknown>{
		id: 4,
		start: {
			name: "Baseball Stadium",
			latLong: {
				lat: 40.254821,
				long: -111.651125,
			},
		},
		end: {
			name: "The Wilk",
			latLong: {
				lat: 40.248543,
				long: -111.647104,
			},
		},
		length: 3,
		owner: null,
		pair: 3,
		color: "yellow",
	});
	expect(graph.isRouteComplete(route)).toBe(false);
	graph.addSegment(firstSegment);
	expect(graph.isRouteComplete(route)).toBe(true);
});

test("can claim end segment to complete route", () => {
	const route = <RouteCard>(<unknown>{
		name: "routeThatCanBeCompletedByAddingToBeginning",
		points: 4,
		start: {
			name: "Baseball Stadium",
			latLong: {
				lat: 40.245433,
				long: -111.652399,
			},
		},
		end: {
			name: "BYU Independent Study",
			latLong: {
				lat: 40.240334,
				long: -111.642054,
			},
		},
	});

	graph = new SegmentGraph(<Segment[]>(<unknown>[
		{
			id: 4,
			start: {
				name: "Baseball Stadium",
				latLong: {
					lat: 40.254821,
					long: -111.651125,
				},
			},
			end: {
				name: "The Wilk",
				latLong: {
					lat: 40.248543,
					long: -111.647104,
				},
			},
			length: 3,
			owner: null,
			pair: 3,
			color: "yellow",
		},
	]));

	const lastSegment = <Segment>(<unknown>{
		id: 82,
		start: {
			name: "The Wilk",
			latLong: {
				lat: 40.248543,
				long: -111.647104,
			},
		},
		end: {
			name: "BYU Independent Study",
			latLong: {
				lat: 40.253645,
				long: -111.644678,
			},
		},
		length: 2,
		owner: null,
		pair: null,
		color: "any",
	});
	expect(graph.isRouteComplete(route)).toBe(false);
	graph.addSegment(lastSegment);
	expect(graph.isRouteComplete(route)).toBe(true);
});
