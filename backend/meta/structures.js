module.exports = {
	house : {
		levels : [
			{	// initial purchase
				name : "hut",
				cost : 40,
				capacity : 3
			},
			{	// level 1
				name : "small cottage",
				cost : 65,
				capacity : 6
			},
			{	// level 2
				name : "cottage",
				cost : 85,
				capacity : 10
			},
			{	// level 3
				name : "house",
				cost : 95,
				capacity : 15
			},
			{ // level 4
				name : "longhouse",
				cost : 240,
				capacity : 25
			}
		]
	},
	farm : {
		levels : [
			{	// initial purchase
				name : "sad cluster of plants",
				cost : 20,
				rate : .01	// generated per tick
			},
			{	// initial purchase
				name : "small garden",
				cost : 25,
				rate : .1	// generated per tick
			},
			{	// level 1
				name : "garden",
				cost : 45,
				rate : 1
			}
		]
	}
};
