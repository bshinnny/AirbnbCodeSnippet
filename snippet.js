// GET route for functional search bar in Express backend.
// Later utilized in React frontend.
router.get('/search/:searchTerm', async (req, res, next) => {
    // Utilizing req.params in order to retrieve search term from parameters.
    const { searchTerm } = req.params;

    const searchSpots = await Spot.findAll({
        where: {
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
        include: [
            { model: Review, attributes: [] },
            { model: SpotImage, where: { preview: true }, attributes: [], required: false }
        ],
        attributes: {
            include: [
                [Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 1), 'avgRating'],
                [Sequelize.col('SpotImages.url'), 'previewImage']
            ]
        },
        group: ['Spot.id', 'previewImage'],
    });

    return res.json({ Spots: searchSpots });
})
