module.exports = {
	gameData : {
		// ****** POPULATION
		// to start:
		basePopulationCount : 4,
		// how many people can be sustained in a town with no houses:
		basePopulationCap : 8,
		// how many people come into town per tick when there's room:
		basePopulationGrowth : 0,
		// how much coin is in reserves at the start of the game:

		// ****** COIN
		// to start:
		baseCoinCount : 50,
		// how much coin comes in per capita/tick:
		baseTaxRevenue : 0.0,

		// ***** FOOD
		// how much food is in reserves at the start of the game:
		baseFoodCount : 1000,
		// how much food is generated per tick in a town with no farms:
		baseFoodProduction : 0,
		// how much food is eaten per capita/tick:
		baseFoodConsumption : 0.01
	}
};
