const express = require('express');
const router = express.Router();

const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getRecipesByCategory,
  getRecipesByDifficulty,
  addReview,
  getRecipeStats
} = require('../controllers/recipeController');

const {
  validateRecipe,
  validateObjectId,
  validateQueryParams,
  recipeValidationSchema,
  updateRecipeValidationSchema
} = require('../middleware/validation');

// Recipe statistics (must be before /:id route)
router.get('/stats', getRecipeStats);

// Get recipes by category
router.get('/category/:category', validateQueryParams, getRecipesByCategory);

// Get recipes by difficulty
router.get('/difficulty/:difficulty', validateQueryParams, getRecipesByDifficulty);

// Main CRUD routes
router.route('/')
  .get(validateQueryParams, getAllRecipes)
  .post(validateRecipe(recipeValidationSchema), createRecipe);

router.route('/:id')
  .get(validateObjectId, getRecipeById)
  .put(validateObjectId, validateRecipe(updateRecipeValidationSchema), updateRecipe)
  .delete(validateObjectId, deleteRecipe);

// Review routes
router.post('/:id/reviews', validateObjectId, addReview);

module.exports = router;
