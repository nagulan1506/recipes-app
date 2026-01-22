require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// In-memory database
let recipes = [];
let recipeIdCounter = 1;

// Sample data for demonstration
const sampleRecipes = [
  {
    id: 1,
    title: "Classic Chocolate Chip Cookies",
    description:
      "Delicious homemade chocolate chip cookies that are crispy on the outside and chewy on the inside.",
    ingredients: [
      { name: "All-purpose flour", quantity: "2.25", unit: "cups" },
      { name: "Baking soda", quantity: "1", unit: "teaspoon" },
      { name: "Salt", quantity: "1", unit: "teaspoon" },
      { name: "Butter", quantity: "1", unit: "cup" },
      { name: "Brown sugar", quantity: "0.75", unit: "cup" },
      { name: "White sugar", quantity: "0.75", unit: "cup" },
      { name: "Eggs", quantity: "2", unit: "pieces" },
      { name: "Vanilla extract", quantity: "2", unit: "teaspoons" },
      { name: "Chocolate chips", quantity: "2", unit: "cups" },
    ],
    instructions: [
      { step: 1, description: "Preheat oven to 375°F (190°C)" },
      { step: 2, description: "Mix flour, baking soda, and salt in a bowl" },
      { step: 3, description: "Cream butter and sugars until fluffy" },
      { step: 4, description: "Beat in eggs and vanilla" },
      { step: 5, description: "Gradually blend in flour mixture" },
      { step: 6, description: "Stir in chocolate chips" },
      {
        step: 7,
        description: "Drop rounded tablespoons on ungreased cookie sheets",
      },
      { step: 8, description: "Bake 9-11 minutes until golden brown" },
    ],
    cookingTime: 10,
    preparationTime: 15,
    servings: 36,
    difficulty: "Easy",
    category: "Dessert",
    cuisine: "American",
    tags: ["cookies", "chocolate", "dessert", "baking"],
    nutritionInfo: {
      calories: 180,
      protein: 2,
      carbohydrates: 24,
      fat: 9,
    },
    rating: 4.8,
    reviews: [
      {
        user: "Sarah M.",
        comment: "Best cookies ever!",
        rating: 5,
        createdAt: new Date().toISOString(),
      },
      {
        user: "Mike L.",
        comment: "Perfect texture and taste",
        rating: 5,
        createdAt: new Date().toISOString(),
      },
    ],
    createdBy: "Chef Emily",
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Spaghetti Carbonara",
    description:
      "Authentic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
    ingredients: [
      { name: "Spaghetti", quantity: "400", unit: "grams" },
      { name: "Pancetta", quantity: "150", unit: "grams" },
      { name: "Large eggs", quantity: "3", unit: "pieces" },
      { name: "Parmigiano-Reggiano cheese", quantity: "100", unit: "grams" },
      { name: "Black pepper", quantity: "1", unit: "teaspoon" },
    ],
    instructions: [
      { step: 1, description: "Bring salted water to boil and cook spaghetti" },
      { step: 2, description: "Cook pancetta in large skillet until crispy" },
      { step: 3, description: "Whisk eggs, cheese, and pepper in bowl" },
      { step: 4, description: "Drain pasta, reserving 1 cup pasta water" },
      { step: 5, description: "Add hot pasta to pancetta" },
      {
        step: 6,
        description: "Remove from heat and add egg mixture, tossing quickly",
      },
    ],
    cookingTime: 15,
    preparationTime: 10,
    servings: 4,
    difficulty: "Medium",
    category: "Main Course",
    cuisine: "Italian",
    tags: ["pasta", "italian", "comfort food"],
    nutritionInfo: {
      calories: 520,
      protein: 25,
      carbohydrates: 65,
      fat: 18,
    },
    rating: 4.6,
    reviews: [
      {
        user: "Antonio R.",
        comment: "Autentico! Just like nonna made",
        rating: 5,
        createdAt: new Date().toISOString(),
      },
    ],
    createdBy: "Chef Marco",
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Avocado Toast",
    description:
      "Simple and nutritious breakfast with creamy avocado on toasted bread.",
    ingredients: [
      { name: "Whole grain bread", quantity: "2", unit: "slices" },
      { name: "Ripe avocado", quantity: "1", unit: "piece" },
      { name: "Lemon juice", quantity: "1", unit: "tablespoon" },
      { name: "Salt", quantity: "1/4", unit: "teaspoon" },
      { name: "Black pepper", quantity: "1/8", unit: "teaspoon" },
      { name: "Cherry tomatoes", quantity: "4", unit: "pieces" },
    ],
    instructions: [
      { step: 1, description: "Toast bread slices until golden" },
      {
        step: 2,
        description: "Mash avocado with lemon juice, salt, and pepper",
      },
      { step: 3, description: "Spread avocado mixture on toast" },
      { step: 4, description: "Top with sliced cherry tomatoes" },
    ],
    cookingTime: 5,
    preparationTime: 5,
    servings: 1,
    difficulty: "Easy",
    category: "Breakfast",
    cuisine: "Modern",
    tags: ["healthy", "breakfast", "vegetarian", "quick"],
    nutritionInfo: {
      calories: 320,
      protein: 12,
      carbohydrates: 35,
      fat: 18,
    },
    rating: 4.3,
    reviews: [],
    createdBy: "Health Coach Lisa",
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initialize recipes with sample data
recipes = [...sampleRecipes];
recipeIdCounter = Math.max(...recipes.map((r) => r.id)) + 1;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: "Too many requests",
    message: "Too many requests from this IP, please try again later.",
  },
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Helper functions
function validateRecipe(recipe) {
  const errors = [];

  if (!recipe.title || recipe.title.length < 3) {
    errors.push("Title must be at least 3 characters long");
  }

  if (!recipe.description) {
    errors.push("Description is required");
  }

  if (
    !recipe.ingredients ||
    !Array.isArray(recipe.ingredients) ||
    recipe.ingredients.length === 0
  ) {
    errors.push("At least one ingredient is required");
  }

  if (
    !recipe.instructions ||
    !Array.isArray(recipe.instructions) ||
    recipe.instructions.length === 0
  ) {
    errors.push("At least one instruction is required");
  }

  if (!recipe.cookingTime || recipe.cookingTime < 1) {
    errors.push("Cooking time must be at least 1 minute");
  }

  if (!recipe.preparationTime || recipe.preparationTime < 1) {
    errors.push("Preparation time must be at least 1 minute");
  }

  if (!recipe.servings || recipe.servings < 1) {
    errors.push("Servings must be at least 1");
  }

  if (!["Easy", "Medium", "Hard"].includes(recipe.difficulty)) {
    errors.push("Difficulty must be Easy, Medium, or Hard");
  }

  if (
    ![
      "Appetizer",
      "Main Course",
      "Dessert",
      "Breakfast",
      "Lunch",
      "Dinner",
      "Snack",
      "Beverage",
    ].includes(recipe.category)
  ) {
    errors.push("Invalid category");
  }

  if (!recipe.cuisine) {
    errors.push("Cuisine is required");
  }

  if (!recipe.createdBy) {
    errors.push("Created by is required");
  }

  return errors;
}

function isValidId(id) {
  return !isNaN(parseInt(id)) && parseInt(id) > 0;
}

// API Routes

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Recipes API is running successfully (In-Memory Mode)",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    database: "In-Memory",
    totalRecipes: recipes.length,
  });
});

// API info endpoint
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Recipes API (In-Memory Mode)",
    version: "1.0.0",
    database: "In-Memory Database",
    totalRecipes: recipes.length,
    documentation: {
      baseUrl: `${req.protocol}://${req.get("host")}/api/v1`,
      endpoints: {
        recipes: {
          getAll: "GET /recipes",
          getById: "GET /recipes/:id",
          create: "POST /recipes",
          update: "PUT /recipes/:id",
          delete: "DELETE /recipes/:id",
          getByCategory: "GET /recipes/category/:category",
          getByDifficulty: "GET /recipes/difficulty/:difficulty",
          addReview: "POST /recipes/:id/reviews",
          getStats: "GET /recipes/stats",
        },
      },
    },
  });
});

// Get recipe statistics
app.get("/api/v1/recipes/stats", (req, res) => {
  try {
    const totalRecipes = recipes.length;
    const avgRating =
      totalRecipes > 0
        ? recipes.reduce((sum, r) => sum + (r.rating || 0), 0) / totalRecipes
        : 0;
    const avgCookingTime =
      totalRecipes > 0
        ? recipes.reduce((sum, r) => sum + r.cookingTime, 0) / totalRecipes
        : 0;
    const avgPreparationTime =
      totalRecipes > 0
        ? recipes.reduce((sum, r) => sum + r.preparationTime, 0) / totalRecipes
        : 0;
    const totalReviews = recipes.reduce(
      (sum, r) => sum + (r.reviews ? r.reviews.length : 0),
      0,
    );

    // Category stats
    const categoryStats = recipes.reduce((acc, recipe) => {
      acc[recipe.category] = (acc[recipe.category] || 0) + 1;
      return acc;
    }, {});

    const categoriesArray = Object.entries(categoryStats)
      .map(([category, count]) => ({
        _id: category,
        count: count,
      }))
      .sort((a, b) => b.count - a.count);

    // Difficulty stats
    const difficultyStats = recipes.reduce((acc, recipe) => {
      acc[recipe.difficulty] = (acc[recipe.difficulty] || 0) + 1;
      return acc;
    }, {});

    const difficultiesArray = Object.entries(difficultyStats).map(
      ([difficulty, count]) => ({
        _id: difficulty,
        count: count,
      }),
    );

    // Cuisine stats
    const cuisineStats = recipes.reduce((acc, recipe) => {
      acc[recipe.cuisine] = (acc[recipe.cuisine] || 0) + 1;
      return acc;
    }, {});

    const cuisinesArray = Object.entries(cuisineStats)
      .map(([cuisine, count]) => ({
        _id: cuisine,
        count: count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      message: "Recipe statistics retrieved successfully",
      data: {
        overview: {
          totalRecipes,
          avgRating: parseFloat(avgRating.toFixed(1)),
          avgCookingTime: parseFloat(avgCookingTime.toFixed(1)),
          avgPreparationTime: parseFloat(avgPreparationTime.toFixed(1)),
          totalReviews,
        },
        byCategory: categoriesArray,
        byDifficulty: difficultiesArray,
        topCuisines: cuisinesArray,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Error retrieving statistics",
    });
  }
});

// Get recipes by category
app.get("/api/v1/recipes/category/:category", (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const validCategories = [
      "Appetizer",
      "Main Course",
      "Dessert",
      "Breakfast",
      "Lunch",
      "Dinner",
      "Snack",
      "Beverage",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: "Invalid category",
        message: "Please provide a valid category",
        validCategories,
      });
    }

    const filteredRecipes = recipes.filter(
      (recipe) => recipe.category === category,
    );
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredRecipes.length / limit);

    res.status(200).json({
      success: true,
      message: `Recipes in ${category} category retrieved successfully`,
      count: paginatedRecipes.length,
      pagination: {
        currentPage: page,
        totalPages,
        total: filteredRecipes.length,
        limit,
      },
      data: paginatedRecipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Error retrieving recipes by category",
    });
  }
});

// Get recipes by difficulty
app.get("/api/v1/recipes/difficulty/:difficulty", (req, res) => {
  try {
    const { difficulty } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const validDifficulties = ["Easy", "Medium", "Hard"];

    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        error: "Invalid difficulty",
        message: "Please provide a valid difficulty level",
        validDifficulties,
      });
    }

    const filteredRecipes = recipes.filter(
      (recipe) => recipe.difficulty === difficulty,
    );
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredRecipes.length / limit);

    res.status(200).json({
      success: true,
      message: `${difficulty} recipes retrieved successfully`,
      count: paginatedRecipes.length,
      pagination: {
        currentPage: page,
        totalPages,
        total: filteredRecipes.length,
        limit,
      },
      data: paginatedRecipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Error retrieving recipes by difficulty",
    });
  }
});

// Get all recipes
app.get("/api/v1/recipes", (req, res) => {
  try {
    let filteredRecipes = [...recipes];

    // Search functionality
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      filteredRecipes = filteredRecipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchTerm) ||
          recipe.description.toLowerCase().includes(searchTerm) ||
          recipe.cuisine.toLowerCase().includes(searchTerm) ||
          (recipe.tags &&
            recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm))),
      );
    }

    // Category filter
    if (req.query.category) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.category === req.query.category,
      );
    }

    // Difficulty filter
    if (req.query.difficulty) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.difficulty === req.query.difficulty,
      );
    }

    // Cuisine filter
    if (req.query.cuisine) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.cuisine.toLowerCase().includes(req.query.cuisine.toLowerCase()),
      );
    }

    // Rating filter
    if (req.query.minRating) {
      const minRating = parseFloat(req.query.minRating);
      filteredRecipes = filteredRecipes.filter(
        (recipe) => (recipe.rating || 0) >= minRating,
      );
    }

    // Cooking time filter
    if (req.query.maxCookingTime) {
      const maxTime = parseInt(req.query.maxCookingTime);
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.cookingTime <= maxTime,
      );
    }

    // Sorting
    if (req.query.sortBy) {
      const sortBy = req.query.sortBy;
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

      filteredRecipes.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        if (sortBy === "totalTime") {
          aVal = a.cookingTime + a.preparationTime;
          bVal = b.cookingTime + b.preparationTime;
        }

        if (typeof aVal === "string") {
          return sortOrder * aVal.localeCompare(bVal);
        }

        return sortOrder * (aVal - bVal);
      });
    } else {
      // Default sort by creation date (newest first)
      filteredRecipes.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredRecipes.length / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      message: "Recipes retrieved successfully",
      count: paginatedRecipes.length,
      pagination: {
        currentPage: page,
        totalPages,
        total: filteredRecipes.length,
        limit,
        hasNextPage,
        hasPrevPage,
      },
      data: paginatedRecipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Error retrieving recipes",
    });
  }
});

// Get recipe by ID
app.get("/api/v1/recipes/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid ID",
        message: "Please provide a valid recipe ID",
      });
    }

    const recipe = recipes.find((r) => r.id === id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: "Recipe not found",
        message: `Recipe with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Recipe retrieved successfully",
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Error retrieving recipe",
    });
  }
});

// Create new recipe
app.post("/api/v1/recipes", (req, res) => {
  try {
    const validationErrors = validateRecipe(req.body);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: "Please check the provided data",
        details: validationErrors.map((error) => ({ message: error })),
      });
    }

    const newRecipe = {
      id: recipeIdCounter++,
      ...req.body,
      rating: req.body.rating || 0,
      reviews: req.body.reviews || [],
      tags: req.body.tags || [],
      nutritionInfo: req.body.nutritionInfo || {},
      isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    recipes.push(newRecipe);

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      data: newRecipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Error creating recipe",
    });
  }
});

// Update recipe
app.put("/api/v1/recipes/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid ID",
        message: "Please provide a valid recipe ID",
      });
    }

    const recipeIndex = recipes.findIndex((r) => r.id === id);

    if (recipeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Recipe not found",
        message: `Recipe with ID ${id} not found`,
      });
    }

    // Validate only provided fields
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;

    // Update recipe
    recipes[recipeIndex] = {
      ...recipes[recipeIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      data: recipes[recipeIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Error updating recipe",
    });
  }
});

// Delete recipe
app.delete("/api/v1/recipes/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid ID",
        message: "Please provide a valid recipe ID",
      });
    }

    const recipeIndex = recipes.findIndex((r) => r.id === id);

    if (recipeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Recipe not found",
        message: `Recipe with ID ${id} not found`,
      });
    }

    recipes.splice(recipeIndex, 1);

    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Error deleting recipe",
    });
  }
});

// Add review to recipe
app.post("/api/v1/recipes/:id/reviews", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { user, comment, rating } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid ID",
        message: "Please provide a valid recipe ID",
      });
    }

    if (!user || !comment || !rating) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "Please provide user, comment, and rating",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Invalid rating",
        message: "Rating must be between 1 and 5",
      });
    }

    const recipeIndex = recipes.findIndex((r) => r.id === id);

    if (recipeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Recipe not found",
        message: `Recipe with ID ${id} not found`,
      });
    }

    // Check if user already reviewed
    if (recipes[recipeIndex].reviews.some((review) => review.user === user)) {
      return res.status(400).json({
        success: false,
        error: "Review already exists",
        message: "You have already reviewed this recipe",
      });
    }

    // Add review
    const newReview = {
      user,
      comment,
      rating: parseInt(rating),
      createdAt: new Date().toISOString(),
    };

    recipes[recipeIndex].reviews.push(newReview);

    // Update average rating
    const totalRating = recipes[recipeIndex].reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    recipes[recipeIndex].rating = parseFloat(
      (totalRating / recipes[recipeIndex].reviews.length).toFixed(1),
    );
    recipes[recipeIndex].updatedAt = new Date().toISOString();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: recipes[recipeIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Error adding review",
    });
  }
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Recipes API (In-Memory Mode)",
    documentation: `/api`,
    health: `/api/health`,
    version: "1.0.0",
    database: "In-Memory",
    totalRecipes: recipes.length,
  });
});

// Handle 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Not found",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Server Error",
    message: "Something went wrong!",
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `\n🚀 Recipes API Server (In-Memory Mode) running on port ${PORT}`,
  );
  console.log(`📋 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(
    `💾 Database: In-Memory (${recipes.length} sample recipes loaded)`,
  );

  console.log(`\n📝 Available endpoints:`);
  console.log(`   GET    /api/v1/recipes                    - Get all recipes`);
  console.log(
    `   POST   /api/v1/recipes                    - Create new recipe`,
  );
  console.log(
    `   GET    /api/v1/recipes/:id                - Get recipe by ID`,
  );
  console.log(
    `   PUT    /api/v1/recipes/:id                - Update recipe by ID`,
  );
  console.log(
    `   DELETE /api/v1/recipes/:id                - Delete recipe by ID`,
  );
  console.log(
    `   GET    /api/v1/recipes/category/:category - Get recipes by category`,
  );
  console.log(
    `   GET    /api/v1/recipes/difficulty/:level  - Get recipes by difficulty`,
  );
  console.log(
    `   POST   /api/v1/recipes/:id/reviews        - Add review to recipe`,
  );
  console.log(
    `   GET    /api/v1/recipes/stats              - Get recipe statistics`,
  );

  console.log(`\n🧪 Test commands:`);
  console.log(`   curl http://localhost:${PORT}/api/health`);
  console.log(`   curl http://localhost:${PORT}/api/v1/recipes`);
  console.log(`   curl http://localhost:${PORT}/api/v1/recipes/1`);

  console.log(`\n✨ Server ready for testing!`);
});
