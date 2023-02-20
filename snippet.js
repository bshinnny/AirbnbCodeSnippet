// GET route for functional search bar in Express backend.
// Later utilized in React frontend.
router.get('/search/:searchTerm', async (req, res, next) => {
    // Utilizing req.params in order to retrieve search term from parameters.
    const { searchTerm } = req.params;

    const searchSpots = await Spot.findAll({
        where: {
            // Using Op from Sequelize in order to make logic comparison.
            [Op.or]: [
                {name: {
                    [Op.like]: `%${searchTerm}%`
                }},
                {address: {
                    [Op.like]: `%${searchTerm}%`
                }},
                {city: {
                    [Op.like]: `%${searchTerm}%`
                }},
                {state: {
                    [Op.like]: `%${searchTerm}%`
                }},
                {description: {
                    [Op.like]: `%${searchTerm}%`
                }},
            ]
        },
        // Including relationships to other models to make query efficient.
        include: [
            { model: Review, attributes: [] },
            { model: SpotImage, where: { preview: true }, attributes: [], required: false }
        ],
        // Aggregating data using eager loading in Sequelize to improve query run time.
        attributes: {
            include: [
                [Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 1), 'avgRating'],
                [Sequelize.col('SpotImages.url'), 'previewImage']
            ]
        },
        group: ['Spot.id', 'previewImage'],
    });

    // Returning query in a JSON object for accessibility by React frontend.
    return res.json({ Spots: searchSpots });
})
