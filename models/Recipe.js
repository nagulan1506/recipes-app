const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Recipe title cannot exceed 100 characters'],
    minlength: [3, 'Recipe title must be at least 3 characters']
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  ingredients: [{
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true
    },
    quantity: {
      type: String,
      required: [true, 'Ingredient quantity is required'],
      trim: true
    },
    unit: {
      type: String,
      required: [true, 'Ingredient unit is required'],
      trim: true
    }
  }],
  instructions: [{
    step: {
      type: Number,
      required: [true, 'Step number is required']
    },
    description: {
      type: String,
      required: [true, 'Step description is required'],
      trim: true
    }
  }],
  cookingTime: {
    type: Number,
    required: [true, 'Cooking time is required'],
    min: [1, 'Cooking time must be at least 1 minute']
  },
  preparationTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [1, 'Preparation time must be at least 1 minute']
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: [1, 'Servings must be at least 1']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: {
      values: ['Easy', 'Medium', 'Hard'],
      message: 'Difficulty must be Easy, Medium, or Hard'
    }
  },
  category: {
    type: String,
    required: [true, 'Recipe category is required'],
    enum: {
      values: ['Appetizer', 'Main Course', 'Dessert', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverage'],
      message: 'Please select a valid category'
    }
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  nutritionInfo: {
    calories: {
      type: Number,
      min: [0, 'Calories cannot be negative']
    },
    protein: {
      type: Number,
      min: [0, 'Protein cannot be negative']
    },
    carbohydrates: {
      type: Number,
      min: [0, 'Carbohydrates cannot be negative']
    },
    fat: {
      type: Number,
      min: [0, 'Fat cannot be negative']
    }
  },
  imageUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviews: [{
    user: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true,
      maxlength: [200, 'Review comment cannot exceed 200 characters']
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: String,
    required: [true, 'Recipe creator is required'],
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for total time
recipeSchema.virtual('totalTime').get(function() {
  return this.cookingTime + this.preparationTime;
});

// Virtual for average rating
recipeSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / this.reviews.length).toFixed(1);
});

// Update the updatedAt field before saving
recipeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update the updatedAt field before updating
recipeSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Index for better query performance
recipeSchema.index({ title: 'text', description: 'text', cuisine: 'text' });
recipeSchema.index({ category: 1 });
recipeSchema.index({ difficulty: 1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ rating: -1 });

// Ensure virtual fields are serialized
recipeSchema.set('toJSON', { virtuals: true });
recipeSchema.set('toObject', { virtuals: true });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
