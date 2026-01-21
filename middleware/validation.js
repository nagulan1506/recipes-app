const Joi = require('joi');

// Recipe validation schema
const recipeValidationSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Recipe title is required',
      'string.min': 'Recipe title must be at least 3 characters',
      'string.max': 'Recipe title cannot exceed 100 characters',
      'any.required': 'Recipe title is required'
    }),

  description: Joi.string()
    .trim()
    .max(500)
    .required()
    .messages({
      'string.empty': 'Recipe description is required',
      'string.max': 'Description cannot exceed 500 characters',
      'any.required': 'Recipe description is required'
    }),

  ingredients: Joi.array()
    .items(Joi.object({
      name: Joi.string().trim().required().messages({
        'string.empty': 'Ingredient name is required',
        'any.required': 'Ingredient name is required'
      }),
      quantity: Joi.string().trim().required().messages({
        'string.empty': 'Ingredient quantity is required',
        'any.required': 'Ingredient quantity is required'
      }),
      unit: Joi.string().trim().required().messages({
        'string.empty': 'Ingredient unit is required',
        'any.required': 'Ingredient unit is required'
      })
    }))
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one ingredient is required',
      'any.required': 'Ingredients are required'
    }),

  instructions: Joi.array()
    .items(Joi.object({
      step: Joi.number().integer().min(1).required().messages({
        'number.base': 'Step number must be a number',
        'number.min': 'Step number must be at least 1',
        'any.required': 'Step number is required'
      }),
      description: Joi.string().trim().required().messages({
        'string.empty': 'Step description is required',
        'any.required': 'Step description is required'
      })
    }))
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one instruction step is required',
      'any.required': 'Instructions are required'
    }),

  cookingTime: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'Cooking time must be a number',
      'number.min': 'Cooking time must be at least 1 minute',
      'any.required': 'Cooking time is required'
    }),

  preparationTime: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'Preparation time must be a number',
      'number.min': 'Preparation time must be at least 1 minute',
      'any.required': 'Preparation time is required'
    }),

  servings: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'Servings must be a number',
      'number.min': 'Servings must be at least 1',
      'any.required': 'Number of servings is required'
    }),

  difficulty: Joi.string()
    .valid('Easy', 'Medium', 'Hard')
    .required()
    .messages({
      'any.only': 'Difficulty must be Easy, Medium, or Hard',
      'any.required': 'Difficulty level is required'
    }),

  category: Joi.string()
    .valid('Appetizer', 'Main Course', 'Dessert', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverage')
    .required()
    .messages({
      'any.only': 'Please select a valid category',
      'any.required': 'Recipe category is required'
    }),

  cuisine: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Cuisine type is required',
      'any.required': 'Cuisine type is required'
    }),

  tags: Joi.array()
    .items(Joi.string().trim())
    .optional(),

  nutritionInfo: Joi.object({
    calories: Joi.number().min(0).messages({
      'number.min': 'Calories cannot be negative'
    }),
    protein: Joi.number().min(0).messages({
      'number.min': 'Protein cannot be negative'
    }),
    carbohydrates: Joi.number().min(0).messages({
      'number.min': 'Carbohydrates cannot be negative'
    }),
    fat: Joi.number().min(0).messages({
      'number.min': 'Fat cannot be negative'
    })
  }).optional(),

  imageUrl: Joi.string()
    .uri()
    .pattern(/\.(jpg|jpeg|png|gif|webp)$/i)
    .optional()
    .messages({
      'string.uri': 'Please provide a valid URL',
      'string.pattern.base': 'Image URL must end with .jpg, .jpeg, .png, .gif, or .webp'
    }),

  rating: Joi.number()
    .min(0)
    .max(5)
    .optional()
    .messages({
      'number.min': 'Rating cannot be less than 0',
      'number.max': 'Rating cannot be more than 5'
    }),

  reviews: Joi.array()
    .items(Joi.object({
      user: Joi.string().required().messages({
        'any.required': 'Review user is required'
      }),
      comment: Joi.string().max(200).required().messages({
        'string.max': 'Review comment cannot exceed 200 characters',
        'any.required': 'Review comment is required'
      }),
      rating: Joi.number().integer().min(1).max(5).required().messages({
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating cannot be more than 5',
        'any.required': 'Review rating is required'
      })
    }))
    .optional(),

  createdBy: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Recipe creator is required',
      'any.required': 'Recipe creator is required'
    }),

  isPublic: Joi.boolean().optional()
});

// Update recipe validation schema (all fields optional)
const updateRecipeValidationSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).optional(),
  description: Joi.string().trim().max(500).optional(),
  ingredients: Joi.array()
    .items(Joi.object({
      name: Joi.string().trim().required(),
      quantity: Joi.string().trim().required(),
      unit: Joi.string().trim().required()
    }))
    .min(1)
    .optional(),
  instructions: Joi.array()
    .items(Joi.object({
      step: Joi.number().integer().min(1).required(),
      description: Joi.string().trim().required()
    }))
    .min(1)
    .optional(),
  cookingTime: Joi.number().integer().min(1).optional(),
  preparationTime: Joi.number().integer().min(1).optional(),
  servings: Joi.number().integer().min(1).optional(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').optional(),
  category: Joi.string()
    .valid('Appetizer', 'Main Course', 'Dessert', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverage')
    .optional(),
  cuisine: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  nutritionInfo: Joi.object({
    calories: Joi.number().min(0),
    protein: Joi.number().min(0),
    carbohydrates: Joi.number().min(0),
    fat: Joi.number().min(0)
  }).optional(),
  imageUrl: Joi.string()
    .uri()
    .pattern(/\.(jpg|jpeg|png|gif|webp)$/i)
    .optional(),
  rating: Joi.number().min(0).max(5).optional(),
  reviews: Joi.array()
    .items(Joi.object({
      user: Joi.string().required(),
      comment: Joi.string().max(200).required(),
      rating: Joi.number().integer().min(1).max(5).required()
    }))
    .optional(),
  createdBy: Joi.string().trim().optional(),
  isPublic: Joi.boolean().optional()
});

// Validation middleware function
const validateRecipe = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Please check the provided data',
        details: errorMessages
      });
    }

    next();
  };
};

// MongoDB ObjectId validation
const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID',
      message: 'Please provide a valid recipe ID'
    });
  }

  next();
};

// Query parameter validation for filtering and pagination
const validateQueryParams = (req, res, next) => {
  const querySchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    category: Joi.string().valid('Appetizer', 'Main Course', 'Dessert', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverage').optional(),
    difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').optional(),
    cuisine: Joi.string().optional(),
    search: Joi.string().optional(),
    sortBy: Joi.string().valid('title', 'createdAt', 'rating', 'totalTime', 'difficulty').optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional(),
    minRating: Joi.number().min(0).max(5).optional(),
    maxCookingTime: Joi.number().integer().min(1).optional()
  });

  const { error } = querySchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      error: 'Query Parameter Validation Error',
      message: 'Please check the provided query parameters',
      details: errorMessages
    });
  }

  next();
};

module.exports = {
  validateRecipe,
  validateObjectId,
  validateQueryParams,
  recipeValidationSchema,
  updateRecipeValidationSchema
};
