// the recipe database. recipes unlock in order as your lifetime study
// minutes cross each "minutes" threshold. keep this sorted by minutes.
// "simple: true" drinks skip the ingredients/steps layout on the card.
//
// to add a drink: copy an entry, give it a unique id, and pick a
// threshold. to add pastries later, add a "category" field and filter.

export const recipes = [
  {
    id: 'espresso',
    name: 'Espresso',
    minutes: 15,
    tagline: 'The single shot everything else is built on.',
    simple: true,
    ingredients: ['18 g finely ground coffee', 'Filtered water'],
    steps: [
      'Pull a 25-30 second shot for roughly 36 g of liquid espresso.',
      'Drink within a minute, while the crema is still bright.'
    ]
  },
  {
    id: 'americano',
    name: 'Americano',
    minutes: 45,
    tagline: 'Espresso, opened up with hot water.',
    simple: true,
    ingredients: ['1 shot espresso (36 g)', '120-180 ml hot water'],
    steps: [
      'Add the hot water to the cup first.',
      'Pour the espresso on top to keep the crema intact.'
    ]
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    minutes: 90,
    tagline: 'Equal parts espresso, steamed milk, and foam.',
    simple: false,
    ingredients: [
      '1 shot espresso (36 g)',
      '120 ml whole milk',
      'Cocoa or cinnamon to finish (optional)'
    ],
    steps: [
      'Pull the espresso into a 6 oz cup.',
      'Steam the milk to a thick, glossy microfoam at about 60 C / 140 F.',
      'Pour so you get roughly one third milk and a deep foam cap.',
      'Dust with cocoa or cinnamon if you like.'
    ]
  },
  {
    id: 'latte',
    name: 'Caffe Latte',
    minutes: 150,
    tagline: 'Silky steamed milk, a thin layer of foam.',
    simple: false,
    ingredients: [
      '1 shot espresso (36 g)',
      '200 ml whole milk',
      'Vanilla syrup, 1 pump (optional)'
    ],
    steps: [
      'Pull the espresso into a large cup, add syrup now if using.',
      'Steam the milk to a smooth, paint-like texture with only a thin foam.',
      'Pour steadily from a height, then close in low to lay a small dot or heart.'
    ]
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    minutes: 240,
    tagline: 'A double ristretto under velvet microfoam.',
    simple: false,
    ingredients: [
      '2 ristretto shots (about 40 g)',
      '130 ml whole milk'
    ],
    steps: [
      'Pull two short ristretto shots for a sweeter, denser base.',
      'Steam the milk to a very fine, wet microfoam, thinner than a cappuccino.',
      'Pour to fill, keeping the foam layer under 0.5 cm.'
    ]
  },
  {
    id: 'iced-latte',
    name: 'Iced Latte',
    minutes: 360,
    tagline: 'Cold milk, ice, and a slow espresso pour.',
    simple: false,
    ingredients: [
      '2 shots espresso (72 g)',
      '180 ml cold milk',
      '1 cup ice',
      'Simple syrup to taste (optional)'
    ],
    steps: [
      'Fill a tall glass with ice and pour in the cold milk.',
      'Stir in syrup if using.',
      'Pour the fresh espresso slowly over the back of a spoon for a layered look.'
    ]
  },
  {
    id: 'caramel-macchiato',
    name: 'Caramel Macchiato',
    minutes: 500,
    tagline: 'Vanilla milk, marked with espresso and caramel.',
    simple: false,
    ingredients: [
      '2 shots espresso (72 g)',
      '220 ml steamed milk',
      '2 pumps vanilla syrup',
      'Caramel sauce to finish'
    ],
    steps: [
      'Add vanilla syrup to the cup, then the steamed milk with a light foam.',
      'Pour the espresso through the foam so it marks the milk.',
      'Cross the top with a caramel drizzle.'
    ]
  },
  {
    id: 'mocha',
    name: 'Cafe Mocha',
    minutes: 660,
    tagline: 'Chocolate and espresso under steamed milk.',
    simple: false,
    ingredients: [
      '2 shots espresso (72 g)',
      '20 g dark chocolate or 1 tbsp cocoa',
      '200 ml steamed milk',
      'Whipped cream (optional)'
    ],
    steps: [
      'Melt the chocolate into the hot espresso and stir until smooth.',
      'Steam the milk and pour it in, stirring once to combine.',
      'Top with whipped cream and a little grated chocolate if you like.'
    ]
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    minutes: 840,
    tagline: 'Slow-steeped overnight, smooth and low-acid.',
    simple: false,
    ingredients: [
      '100 g coarsely ground coffee',
      '1 litre cold filtered water'
    ],
    steps: [
      'Stir the grounds into the water in a large jar.',
      'Cover and steep in the fridge for 14-18 hours.',
      'Strain through a paper filter, then serve over ice, diluted to taste.'
    ]
  },
  {
    id: 'affogato',
    name: 'Affogato',
    minutes: 1050,
    tagline: 'A hot shot poured over cold gelato.',
    simple: false,
    ingredients: [
      '1 scoop vanilla gelato or ice cream',
      '1 shot hot espresso (36 g)',
      'Crushed cocoa nibs (optional)'
    ],
    steps: [
      'Place the scoop in a small chilled glass.',
      'Pull the espresso and pour it over the top at the table.',
      'Eat right away as it melts into the espresso.'
    ]
  },
  {
    id: 'spanish-latte',
    name: 'Spanish Latte',
    minutes: 1300,
    tagline: 'A latte sweetened with condensed milk.',
    simple: false,
    ingredients: [
      '2 shots espresso (72 g)',
      '30 ml sweetened condensed milk',
      '180 ml whole milk'
    ],
    steps: [
      'Stir the condensed milk into the hot espresso until dissolved.',
      'Steam the whole milk and pour it in.',
      'Serve hot, or pour over ice for an iced version.'
    ]
  },
  {
    id: 'house-pour-over',
    name: 'House Pour-Over',
    minutes: 1600,
    tagline: 'Your signature single-origin, brewed by hand.',
    simple: false,
    ingredients: [
      '22 g single-origin coffee, medium grind',
      '360 g water at 96 C / 205 F',
      'A cone dripper and paper filter'
    ],
    steps: [
      'Rinse the filter and discard the water to remove any paper taste.',
      'Add the grounds, then pour 50 g of water and wait 30 seconds for the bloom.',
      'Pour in slow spirals in three stages up to 360 g total.',
      'Aim for a total brew time of about three minutes.'
    ]
  }
]
