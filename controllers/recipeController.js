const Recipe = require('../models/Recipe');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Create a new recipe
 * @route   POST /api/v1/recipes
 * @access  Public
 */
const createRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Recipe created successfully',
    data: recipe
  });
});

/**
 * @desc    Get all recipes with filtering, sorting, and pagination
 * @route   GET /api/v1/recipes
 * @access  Public
 */
const getAllRecipes = asyncHandler(async (req, res) => {
  // Build query object
  let queryObj = { ...req.query };

  // Remove pagination and sorting fields from query
  const excludeFields = ['page', 'limit', 'sortBy', 'sortOrder', 'search'];
  excludeFields.forEach(field => delete queryObj[field]);

  // Handle search functionality
  if (req.query.search) {
    queryObj.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { cuisine: { $regex: req.query.search, $options: 'i' } },
      { tags: { $in: [new RegExp(req.query.search, 'i')] } }
    ];
  }

  // Handle rating filter
  if (req.query.minRating) {
    queryObj.rating = { $gte: parseInt(req.query.minRating) };
  }

  // Handle cooking time filter
  if (req.query.maxCookingTime) {
    queryObj.cookingTime = { $lte: parseInt(req.query.maxCookingTime) };
  }

  // Build query
  let query = Recipe.find(queryObj);

  // Sorting
  if (req.query.sortBy) {
    const sortOrder = req.query.sortOrder === 'desc' ? '-' : '';
    query = query.sort(`${sortOrder}${req.query.sortBy}`);
  } else {
    query = query.sort('-createdAt'); // Default sort by creation date
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Execute query
  const recipes = await query;
  const total = await Recipe.countDocuments(queryObj);

  // Calculate pagination info
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.status(200).json({
    success: true,
    message: 'Recipes retrieved successfully',
    count: recipes.length,
    pagination: {
      currentPage: page,
      totalPages,
      total,
      limit,
      hasNextPage,
      hasPrevPage
    },
    data: recipes
  });
});

/**
 * @desc    Get single recipe by ID
 * @route   GET /api/v1/recipes/:id
 * @access  Public
 */
const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({
      success: false,
      error: 'Recipe not found',
      message: `Recipe with ID ${req.params.id} not found`
    });
  }

  res.status(200).json({
    success: true,
    message: 'Recipe retrieved successfully',
    data: recipe
  });
});

/**
 * @desc    Update recipe by ID
 * @route   PUT /api/v1/recipes/:id
 * @access  Public
 */
const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!recipe) {
    return res.status(404).json({
      success: false,
      error: 'Recipe not found',
      message: `Recipe with ID ${req.params.id} not found`
    });
  }

  res.status(200).json({
    success: true,
    message: 'Recipe updated successfully',
    data: recipe
  });
});

/**
 * @desc    Delete recipe by ID
 * @route   DELETE /api/v1/recipes/:id
 * @access  Public
 */
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({
      success: false,
      error: 'Recipe not found',
      message: `Recipe with ID ${req.params.id} not found`
    });
  }

  await Recipe.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Recipe deleted successfully',
    data: {}
  });
});

/**
 * @desc    Get recipes by category
 * @route   GET /api/v1/recipes/category/:category
 * @access  Public
 */
const getRecipesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const validCategories = ['Appetizer', 'Main Course', 'Dessert', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverage'];

  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid category',
      message: 'Please provide a valid category',
      validCategories
    });
  }

  const recipes = await Recipe.find({ category })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Recipe.countDocuments({ category });
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    message: `Recipes in ${category} category retrieved successfully`,
    count: recipes.length,
    pagination: {
      currentPage: page,
      totalPages,
      total,
      limit
    },
    data: recipes
  });
});

/**
 * @desc    Get recipes by difficulty
 * @route   GET /api/v1/recipes/difficulty/:difficulty
 * @access  Public
 */
const getRecipesByDifficulty = asyncHandler(async (req, res) => {
  const { difficulty } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const validDifficulties = ['Easy', 'Medium', 'Hard'];

  if (!validDifficulties.includes(difficulty)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid difficulty',
      message: 'Please provide a valid difficulty level',
      validDifficulties
    });
  }

  const recipes = await Recipe.find({ difficulty })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Recipe.countDocuments({ difficulty });
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    message: `${difficulty} recipes retrieved successfully`,
    count: recipes.length,
    pagination: {
      currentPage: page,
      totalPages,
      total,
      limit
    },
    data: recipes
  });
});

/**
 * @desc    Add review to recipe
 * @route   POST /api/v1/recipes/:id/reviews
 * @access  Public
 */
const addReview = asyncHandler(async (req, res) => {
  const { user, comment, rating } = req.body;

  if (!user || !comment || !rating) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      message: 'Please provide user, comment, and rating'
    });
  }

  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({
      success: false,
      error: 'Recipe not found',
      message: `Recipe with ID ${req.params.id} not found`
    });
  }

  // Check if user already reviewed this recipe
  const existingReview = recipe.reviews.find(review => review.user === user);

  if (existingReview) {
    return res.status(400).json({
      success: false,
      error: 'Review already exists',
      message: 'You have already reviewed this recipe'
    });
  }

  recipe.reviews.push({ user, comment, rating });

  // Update average rating
  const totalRating = recipe.reviews.reduce((sum, review) => sum + review.rating, 0);
  recipe.rating = (totalRating / recipe.reviews.length).toFixed(1);

  await recipe.save();

  res.status(201).json({
    success: true,
    message: 'Review added successfully',
    data: recipe
  });
});

/**
 * @desc    Get recipe statistics
 * @route   GET /api/v1/recipes/stats
 * @access  Public
 */
const getRecipeStats = asyncHandler(async (req, res) => {
  const stats = await Recipe.aggregate([
    {
      $group: {
        _id: null,
        totalRecipes: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        avgCookingTime: { $avg: '$cookingTime' },
        avgPreparationTime: { $avg: '$preparationTime' },
        totalReviews: { $sum: { $size: '$reviews' } }
      }
    }
  ]);

  const categoryStats = await Recipe.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  const difficultyStats = await Recipe.aggregate([
    {
      $group: {
        _id: '$difficulty',
        count: { $sum: 1 }
      }
    }
  ]);

  const cuisineStats = await Recipe.aggregate([
    {
      $group: {
        _id: '$cuisine',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 10
    }
  ]);

  res.status(200).json({
    success: true,
    message: 'Recipe statistics retrieved successfully',
    data: {
      overview: stats[0] || {},
      byCategory: categoryStats,
      byDifficulty: difficultyStats,
      topCuisines: cuisineStats
    }
  });
});

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getRecipesByCategory,
  getRecipesByDifficulty,
  addReview,
  getRecipeStats
};
