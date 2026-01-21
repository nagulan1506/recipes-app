# API Testing Guide - Recipes App

This guide provides step-by-step instructions for testing the Recipes API using various methods including Postman, curl commands, and browser testing.

## 🚀 Quick Start

### Prerequisites
1. Ensure MongoDB is running on your system
2. Start the API server: `npm start`
3. Verify the server is running at: `http://localhost:3000`

### Initial Setup
```bash
# Install dependencies
npm install

# Setup sample data (optional)
npm run setup

# Start the server
npm start
```

## 🧪 Testing Methods

### Method 1: Browser Testing (GET Requests Only)

#### 1. Health Check
Open in browser: `http://localhost:3000/api/health`

**Expected Response:**
```json
{
  "success": true,
  "message": "Recipes API is running successfully",
  "timestamp": "2023-12-01T10:30:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

#### 2. API Documentation
Open in browser: `http://localhost:3000/api`

#### 3. Get All Recipes
Open in browser: `http://localhost:3000/api/v1/recipes`

#### 4. Filter Recipes
- By category: `http://localhost:3000/api/v1/recipes?category=Dessert`
- By difficulty: `http://localhost:3000/api/v1/recipes?difficulty=Easy`
- Search: `http://localhost:3000/api/v1/recipes?search=chocolate`
- With pagination: `http://localhost:3000/api/v1/recipes?page=1&limit=5`

### Method 2: cURL Commands

#### 1. Health Check
```bash
curl -X GET http://localhost:3000/api/health
```

#### 2. Get All Recipes
```bash
curl -X GET http://localhost:3000/api/v1/recipes
```

#### 3. Create a New Recipe
```bash
curl -X POST http://localhost:3000/api/v1/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Simple Pancakes",
    "description": "Fluffy and delicious pancakes perfect for breakfast",
    "ingredients": [
      {"name": "All-purpose flour", "quantity": "1", "unit": "cup"},
      {"name": "Milk", "quantity": "1", "unit": "cup"},
      {"name": "Egg", "quantity": "1", "unit": "piece"},
      {"name": "Sugar", "quantity": "2", "unit": "tablespoons"},
      {"name": "Baking powder", "quantity": "2", "unit": "teaspoons"},
      {"name": "Salt", "quantity": "0.5", "unit": "teaspoon"}
    ],
    "instructions": [
      {"step": 1, "description": "Mix dry ingredients in a bowl"},
      {"step": 2, "description": "Combine wet ingredients separately"},
      {"step": 3, "description": "Mix wet and dry ingredients until just combined"},
      {"step": 4, "description": "Cook on griddle until golden brown"}
    ],
    "cookingTime": 10,
    "preparationTime": 5,
    "servings": 4,
    "difficulty": "Easy",
    "category": "Breakfast",
    "cuisine": "American",
    "createdBy": "Test Chef"
  }'
```

#### 4. Get Recipe by ID
```bash
# Replace RECIPE_ID with actual ID from create response
curl -X GET http://localhost:3000/api/v1/recipes/RECIPE_ID
```

#### 5. Update Recipe
```bash
curl -X PUT http://localhost:3000/api/v1/recipes/RECIPE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Simple Pancakes",
    "rating": 4.5
  }'
```

#### 6. Add Review to Recipe
```bash
curl -X POST http://localhost:3000/api/v1/recipes/RECIPE_ID/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "user": "John Doe",
    "comment": "Great recipe! Easy to follow.",
    "rating": 5
  }'
```

#### 7. Delete Recipe
```bash
curl -X DELETE http://localhost:3000/api/v1/recipes/RECIPE_ID
```

#### 8. Get Recipe Statistics
```bash
curl -X GET http://localhost:3000/api/v1/recipes/stats
```

### Method 3: Postman Testing

#### Collection Setup
1. **Create Collection**: Name it "Recipes API"
2. **Set Variables**:
   - `baseURL`: `http://localhost:3000/api/v1`
   - `healthURL`: `http://localhost:3000/api/health`

#### Request Templates

##### 1. Health Check
- **Method**: GET
- **URL**: `{{healthURL}}`

##### 2. Create Recipe
- **Method**: POST
- **URL**: `{{baseURL}}/recipes`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "title": "Chocolate Brownies",
  "description": "Rich and fudgy chocolate brownies",
  "ingredients": [
    {"name": "Dark chocolate", "quantity": "200", "unit": "grams"},
    {"name": "Butter", "quantity": "100", "unit": "grams"},
    {"name": "Sugar", "quantity": "150", "unit": "grams"},
    {"name": "Eggs", "quantity": "2", "unit": "pieces"},
    {"name": "Flour", "quantity": "50", "unit": "grams"}
  ],
  "instructions": [
    {"step": 1, "description": "Melt chocolate and butter together"},
    {"step": 2, "description": "Mix in sugar and eggs"},
    {"step": 3, "description": "Fold in flour"},
    {"step": 4, "description": "Bake at 180°C for 25 minutes"}
  ],
  "cookingTime": 25,
  "preparationTime": 15,
  "servings": 12,
  "difficulty": "Easy",
  "category": "Dessert",
  "cuisine": "American",
  "tags": ["chocolate", "dessert", "brownies"],
  "createdBy": "Baker Bob"
}
```

##### 3. Get All Recipes with Filters
- **Method**: GET
- **URL**: `{{baseURL}}/recipes`
- **Params**:
  - `page`: 1
  - `limit`: 10
  - `category`: Dessert
  - `difficulty`: Easy
  - `sortBy`: rating
  - `sortOrder`: desc

##### 4. Search Recipes
- **Method**: GET
- **URL**: `{{baseURL}}/recipes`
- **Params**:
  - `search`: chocolate
  - `minRating`: 4

## 📊 Test Scenarios

### Scenario 1: Complete CRUD Flow
1. **Create** a new recipe
2. **Read** the created recipe by ID
3. **Update** the recipe
4. **Delete** the recipe
5. **Verify** deletion (should return 404)

### Scenario 2: Filtering and Search
1. Create recipes in different categories
2. Test category filtering
3. Test difficulty filtering
4. Test search functionality
5. Test pagination with different limits

### Scenario 3: Review System
1. Create a recipe
2. Add multiple reviews
3. Verify rating calculation
4. Check updated recipe data

### Scenario 4: Error Handling
1. Test invalid recipe ID format
2. Test missing required fields
3. Test invalid enum values
4. Test non-existent recipe access

## ✅ Expected Results

### Successful Responses

#### Create Recipe (201)
```json
{
  "success": true,
  "message": "Recipe created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Chocolate Brownies",
    "description": "Rich and fudgy chocolate brownies",
    "ingredients": [...],
    "instructions": [...],
    "cookingTime": 25,
    "preparationTime": 15,
    "totalTime": 40,
    "servings": 12,
    "difficulty": "Easy",
    "category": "Dessert",
    "cuisine": "American",
    "createdAt": "2023-12-01T10:30:00.000Z",
    "updatedAt": "2023-12-01T10:30:00.000Z"
  }
}
```

#### Get All Recipes (200)
```json
{
  "success": true,
  "message": "Recipes retrieved successfully",
  "count": 10,
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "total": 25,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "data": [...]
}
```

#### Recipe Statistics (200)
```json
{
  "success": true,
  "message": "Recipe statistics retrieved successfully",
  "data": {
    "overview": {
      "totalRecipes": 25,
      "avgRating": 4.2,
      "avgCookingTime": 30.5,
      "avgPreparationTime": 15.2,
      "totalReviews": 48
    },
    "byCategory": [
      {"_id": "Dessert", "count": 8},
      {"_id": "Main Course", "count": 10},
      {"_id": "Breakfast", "count": 4}
    ],
    "byDifficulty": [
      {"_id": "Easy", "count": 12},
      {"_id": "Medium", "count": 8},
      {"_id": "Hard", "count": 5}
    ]
  }
}
```

### Error Responses

#### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Please check the provided data",
  "details": [
    {
      "field": "title",
      "message": "Recipe title is required"
    },
    {
      "field": "cookingTime",
      "message": "Cooking time must be at least 1 minute"
    }
  ]
}
```

#### Recipe Not Found (404)
```json
{
  "success": false,
  "error": "Recipe not found",
  "message": "Recipe with ID 507f1f77bcf86cd799439011 not found"
}
```

#### Invalid ID Format (400)
```json
{
  "success": false,
  "error": "Invalid ID",
  "message": "Please provide a valid recipe ID"
}
```

## 🔍 Advanced Testing

### Query Parameter Testing

#### Pagination
```bash
# Page 1, 5 items per page
curl "http://localhost:3000/api/v1/recipes?page=1&limit=5"

# Page 2, 3 items per page
curl "http://localhost:3000/api/v1/recipes?page=2&limit=3"
```

#### Filtering
```bash
# Filter by category
curl "http://localhost:3000/api/v1/recipes?category=Dessert"

# Filter by difficulty
curl "http://localhost:3000/api/v1/recipes?difficulty=Easy"

# Multiple filters
curl "http://localhost:3000/api/v1/recipes?category=Dessert&difficulty=Easy&minRating=4"
```

#### Sorting
```bash
# Sort by rating (descending)
curl "http://localhost:3000/api/v1/recipes?sortBy=rating&sortOrder=desc"

# Sort by cooking time (ascending)
curl "http://localhost:3000/api/v1/recipes?sortBy=cookingTime&sortOrder=asc"
```

#### Search
```bash
# Text search
curl "http://localhost:3000/api/v1/recipes?search=chocolate"

# Search with filters
curl "http://localhost:3000/api/v1/recipes?search=pasta&category=Main%20Course"
```

### Category and Difficulty Endpoints
```bash
# Get recipes by category
curl "http://localhost:3000/api/v1/recipes/category/Dessert"

# Get recipes by difficulty
curl "http://localhost:3000/api/v1/recipes/difficulty/Easy"
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Connection Refused
**Problem**: `ECONNREFUSED` error
**Solution**: 
- Ensure server is running (`npm start`)
- Check port 3000 is available
- Verify MongoDB is running

#### 2. Validation Errors
**Problem**: 400 status with validation details
**Solution**:
- Check all required fields are provided
- Verify data types match schema requirements
- Ensure enum values are valid

#### 3. Database Connection Issues
**Problem**: MongoDB connection errors
**Solution**:
- Start MongoDB service
- Check MongoDB URI in `.env` file
- Verify database permissions

#### 4. Rate Limiting
**Problem**: 429 Too Many Requests
**Solution**:
- Wait for rate limit window to reset
- Adjust rate limiting in environment variables

### Debug Commands

#### Check Server Status
```bash
curl -v http://localhost:3000/api/health
```

#### Test with Verbose Output
```bash
curl -v -X POST http://localhost:3000/api/v1/recipes \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Recipe"}'
```

#### Check Database Connection
```bash
# In MongoDB shell
use recipes-app
db.recipes.find().count()
```

## 📝 Testing Checklist

### Basic Functionality
- [ ] Server starts successfully
- [ ] MongoDB connection established
- [ ] Health check returns 200
- [ ] API documentation accessible

### CRUD Operations
- [ ] Create recipe with valid data
- [ ] Get all recipes with pagination
- [ ] Get single recipe by ID
- [ ] Update recipe with partial data
- [ ] Delete recipe successfully

### Filtering and Search
- [ ] Category filtering works
- [ ] Difficulty filtering works
- [ ] Text search returns relevant results
- [ ] Pagination works correctly
- [ ] Sorting works for different fields

### Error Handling
- [ ] Invalid ID returns 400
- [ ] Missing required fields return validation errors
- [ ] Non-existent recipe returns 404
- [ ] Rate limiting works (if testing with many requests)

### Review System
- [ ] Add review to recipe
- [ ] Recipe rating updates correctly
- [ ] Cannot add duplicate reviews from same user

### Statistics
- [ ] Recipe statistics endpoint works
- [ ] Statistics show correct counts
- [ ] Aggregation data is accurate

This comprehensive testing guide ensures your Recipes API is fully functional and handles all expected use cases and edge cases properly.