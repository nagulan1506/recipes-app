# Recipes API - Postman Collection Guide

This guide provides comprehensive instructions for testing the Recipes API using Postman, including sample requests, responses, and test scripts.

## 📋 Collection Setup

### 1. Create New Collection
1. Open Postman
2. Click "New" → "Collection"
3. Name it "Recipes API"
4. Add description: "Complete CRUD API for managing recipes"

### 2. Set Environment Variables
Create a new environment with the following variables:

```
baseURL: http://localhost:3000/api/v1
healthURL: http://localhost:3000/api/health
recipeId: (will be set dynamically)
```

## 🧪 API Endpoints Testing

### 1. Health Check
**Purpose**: Verify API is running

```
Method: GET
URL: {{healthURL}}
Headers: (none required)
```

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "Recipes API is running successfully",
  "timestamp": "2023-12-01T10:30:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

**Test Script**:
```javascript
pm.test("Health check successful", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.message).to.include("running successfully");
});
```

### 2. Create Recipe
**Purpose**: Add a new recipe to the database

```
Method: POST
URL: {{baseURL}}/recipes
Headers: 
  Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Chocolate Chip Cookies",
  "description": "Classic homemade chocolate chip cookies that are soft and chewy",
  "ingredients": [
    {
      "name": "All-purpose flour",
      "quantity": "2.25",
      "unit": "cups"
    },
    {
      "name": "Baking soda",
      "quantity": "1",
      "unit": "teaspoon"
    },
    {
      "name": "Salt",
      "quantity": "1",
      "unit": "teaspoon"
    },
    {
      "name": "Unsalted butter",
      "quantity": "1",
      "unit": "cup"
    },
    {
      "name": "Brown sugar",
      "quantity": "0.75",
      "unit": "cup"
    },
    {
      "name": "White sugar",
      "quantity": "0.75",
      "unit": "cup"
    },
    {
      "name": "Large eggs",
      "quantity": "2",
      "unit": "pieces"
    },
    {
      "name": "Vanilla extract",
      "quantity": "2",
      "unit": "teaspoons"
    },
    {
      "name": "Chocolate chips",
      "quantity": "2",
      "unit": "cups"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "description": "Preheat oven to 375°F (190°C). Line baking sheets with parchment paper."
    },
    {
      "step": 2,
      "description": "In a medium bowl, whisk together flour, baking soda, and salt. Set aside."
    },
    {
      "step": 3,
      "description": "In a large bowl, cream together butter and both sugars until light and fluffy."
    },
    {
      "step": 4,
      "description": "Beat in eggs one at a time, then add vanilla extract."
    },
    {
      "step": 5,
      "description": "Gradually mix in the flour mixture until just combined."
    },
    {
      "step": 6,
      "description": "Fold in chocolate chips evenly throughout the dough."
    },
    {
      "step": 7,
      "description": "Drop rounded tablespoons of dough onto prepared baking sheets, spacing 2 inches apart."
    },
    {
      "step": 8,
      "description": "Bake for 9-11 minutes or until edges are golden brown. Cool on baking sheet for 5 minutes before transferring to wire rack."
    }
  ],
  "cookingTime": 10,
  "preparationTime": 15,
  "servings": 36,
  "difficulty": "Easy",
  "category": "Dessert",
  "cuisine": "American",
  "tags": ["cookies", "chocolate", "dessert", "baking", "sweet"],
  "nutritionInfo": {
    "calories": 180,
    "protein": 2,
    "carbohydrates": 24,
    "fat": 9
  },
  "imageUrl": "https://example.com/chocolate-chip-cookies.jpg",
  "createdBy": "Chef Emily",
  "isPublic": true
}
```

**Test Script**:
```javascript
pm.test("Recipe created successfully", function () {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.have.property('_id');
    
    // Store recipe ID for future tests
    pm.environment.set("recipeId", response.data._id);
});

pm.test("Response contains required fields", function () {
    const response = pm.response.json();
    pm.expect(response.data).to.have.property('title', 'Chocolate Chip Cookies');
    pm.expect(response.data).to.have.property('difficulty', 'Easy');
    pm.expect(response.data.ingredients).to.be.an('array');
    pm.expect(response.data.instructions).to.be.an('array');
});
```

### 3. Get All Recipes
**Purpose**: Retrieve all recipes with pagination and filtering

```
Method: GET
URL: {{baseURL}}/recipes
Query Parameters:
  page: 1
  limit: 10
  sortBy: createdAt
  sortOrder: desc
```

**Test Script**:
```javascript
pm.test("Get all recipes successful", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.be.an('array');
    pm.expect(response).to.have.property('pagination');
});

pm.test("Pagination info is correct", function () {
    const response = pm.response.json();
    const pagination = response.pagination;
    pm.expect(pagination).to.have.property('currentPage');
    pm.expect(pagination).to.have.property('totalPages');
    pm.expect(pagination).to.have.property('total');
    pm.expect(pagination).to.have.property('limit');
});
```

### 4. Get Recipe by ID
**Purpose**: Retrieve a specific recipe by its ID

```
Method: GET
URL: {{baseURL}}/recipes/{{recipeId}}
```

**Test Script**:
```javascript
pm.test("Get recipe by ID successful", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.have.property('_id');
    pm.expect(response.data).to.have.property('title');
});

pm.test("Recipe contains all required fields", function () {
    const response = pm.response.json();
    const recipe = response.data;
    
    pm.expect(recipe).to.have.property('ingredients');
    pm.expect(recipe).to.have.property('instructions');
    pm.expect(recipe).to.have.property('cookingTime');
    pm.expect(recipe).to.have.property('preparationTime');
    pm.expect(recipe).to.have.property('difficulty');
    pm.expect(recipe).to.have.property('category');
});
```

### 5. Update Recipe
**Purpose**: Update an existing recipe

```
Method: PUT
URL: {{baseURL}}/recipes/{{recipeId}}
Headers: 
  Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Updated Chocolate Chip Cookies",
  "cookingTime": 12,
  "rating": 4.8
}
```

**Test Script**:
```javascript
pm.test("Recipe updated successfully", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.title).to.equal("Updated Chocolate Chip Cookies");
    pm.expect(response.data.cookingTime).to.equal(12);
});
```

### 6. Search Recipes
**Purpose**: Search recipes with filters

```
Method: GET
URL: {{baseURL}}/recipes
Query Parameters:
  search: chocolate
  category: Dessert
  difficulty: Easy
  page: 1
  limit: 5
```

**Test Script**:
```javascript
pm.test("Search results are filtered correctly", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    
    if (response.data.length > 0) {
        response.data.forEach(recipe => {
            pm.expect(recipe.category).to.equal("Dessert");
            pm.expect(recipe.difficulty).to.equal("Easy");
        });
    }
});
```

### 7. Get Recipes by Category
**Purpose**: Get recipes filtered by category

```
Method: GET
URL: {{baseURL}}/recipes/category/Dessert
Query Parameters:
  page: 1
  limit: 10
```

**Test Script**:
```javascript
pm.test("Category filter works correctly", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    
    if (response.data.length > 0) {
        response.data.forEach(recipe => {
            pm.expect(recipe.category).to.equal("Dessert");
        });
    }
});
```

### 8. Get Recipes by Difficulty
**Purpose**: Get recipes filtered by difficulty level

```
Method: GET
URL: {{baseURL}}/recipes/difficulty/Easy
Query Parameters:
  page: 1
  limit: 10
```

**Test Script**:
```javascript
pm.test("Difficulty filter works correctly", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    
    if (response.data.length > 0) {
        response.data.forEach(recipe => {
            pm.expect(recipe.difficulty).to.equal("Easy");
        });
    }
});
```

### 9. Add Review to Recipe
**Purpose**: Add a review and rating to a recipe

```
Method: POST
URL: {{baseURL}}/recipes/{{recipeId}}/reviews
Headers: 
  Content-Type: application/json
```

**Request Body**:
```json
{
  "user": "John Doe",
  "comment": "Absolutely delicious cookies! My family loved them.",
  "rating": 5
}
```

**Test Script**:
```javascript
pm.test("Review added successfully", function () {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.reviews).to.be.an('array');
    
    // Check if the new review was added
    const reviews = response.data.reviews;
    const newReview = reviews.find(review => review.user === "John Doe");
    pm.expect(newReview).to.exist;
    pm.expect(newReview.rating).to.equal(5);
});
```

### 10. Get Recipe Statistics
**Purpose**: Get overall statistics about recipes

```
Method: GET
URL: {{baseURL}}/recipes/stats
```

**Test Script**:
```javascript
pm.test("Statistics retrieved successfully", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.have.property('overview');
    pm.expect(response.data).to.have.property('byCategory');
    pm.expect(response.data).to.have.property('byDifficulty');
});

pm.test("Statistics contain valid data", function () {
    const response = pm.response.json();
    const overview = response.data.overview;
    
    if (overview.totalRecipes) {
        pm.expect(overview.totalRecipes).to.be.a('number');
        pm.expect(overview.totalRecipes).to.be.above(0);
    }
});
```

### 11. Delete Recipe
**Purpose**: Delete a recipe (should be last test)

```
Method: DELETE
URL: {{baseURL}}/recipes/{{recipeId}}
```

**Test Script**:
```javascript
pm.test("Recipe deleted successfully", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.message).to.include("deleted successfully");
});
```

### 12. Verify Recipe Deletion
**Purpose**: Confirm recipe was deleted

```
Method: GET
URL: {{baseURL}}/recipes/{{recipeId}}
```

**Test Script**:
```javascript
pm.test("Recipe not found after deletion", function () {
    pm.response.to.have.status(404);
    const response = pm.response.json();
    pm.expect(response.success).to.be.false;
    pm.expect(response.error).to.equal("Recipe not found");
});
```

## 🧪 Error Testing

### Invalid Recipe ID Format
```
Method: GET
URL: {{baseURL}}/recipes/invalid-id
```

**Expected Response (400)**:
```json
{
  "success": false,
  "error": "Invalid ID",
  "message": "Please provide a valid recipe ID"
}
```

### Validation Error
```
Method: POST
URL: {{baseURL}}/recipes
Body: {
  "title": "AB", // Too short
  "description": "" // Empty
}
```

**Expected Response (400)**:
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Please check the provided data",
  "details": [
    {
      "field": "title",
      "message": "Recipe title must be at least 3 characters"
    },
    {
      "field": "description",
      "message": "Recipe description is required"
    }
  ]
}
```

## 📊 Collection Variables

Set these variables in your Postman environment:

| Variable | Value | Description |
|----------|--------|-------------|
| `baseURL` | `http://localhost:3000/api/v1` | Base API URL |
| `healthURL` | `http://localhost:3000/api/health` | Health check URL |
| `recipeId` | `(dynamic)` | Current recipe ID for testing |

## 🎯 Test Scenarios

### Complete CRUD Flow
1. Health Check
2. Create Recipe (store ID)
3. Get All Recipes
4. Get Recipe by ID
5. Update Recipe
6. Add Review
7. Get Updated Recipe
8. Delete Recipe
9. Verify Deletion

### Filtering and Search
1. Create multiple recipes with different categories
2. Test category filtering
3. Test difficulty filtering
4. Test search functionality
5. Test pagination
6. Test sorting

### Error Handling
1. Test invalid IDs
2. Test validation errors
3. Test missing required fields
4. Test invalid enum values

## 🚀 Running the Collection

### Manual Testing
1. Import the collection into Postman
2. Set up environment variables
3. Run requests individually
4. Check responses and test results

### Automated Testing
1. Use Collection Runner
2. Select the entire collection
3. Choose the environment
4. Run all tests sequentially
5. Review test results

### Command Line (Newman)
```bash
# Install Newman
npm install -g newman

# Run collection
newman run recipes-api-collection.json -e recipes-api-environment.json --reporters cli,html
```

## 📝 Expected Results

After running the complete test suite:
- All health checks should pass
- CRUD operations should work correctly
- Filtering and search should return appropriate results
- Validation errors should be properly handled
- Statistics endpoint should provide meaningful data
- All test assertions should pass

## 🔧 Troubleshooting

### Common Issues
1. **Connection Refused**: Ensure the server is running on the correct port
2. **Invalid JSON**: Check request body formatting
3. **Validation Errors**: Verify all required fields are provided
4. **404 Errors**: Confirm the recipe ID exists in the database

### Debug Tips
1. Check server logs for detailed error messages
2. Verify environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Use Postman Console to view request/response details

This comprehensive test suite ensures your Recipes API is working correctly and handles all edge cases properly.