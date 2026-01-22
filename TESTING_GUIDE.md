# Recipes API - Complete Testing Guide

This comprehensive guide provides step-by-step instructions for testing the Recipes API using various methods including Postman, cURL, and automated testing scripts.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [API Endpoints Overview](#api-endpoints-overview)
4. [Testing with Postman](#testing-with-postman)
5. [Testing with cURL](#testing-with-curl)
6. [Automated Testing Scripts](#automated-testing-scripts)
7. [Test Scenarios](#test-scenarios)
8. [Error Handling Tests](#error-handling-tests)
9. [Performance Testing](#performance-testing)
10. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before testing, ensure you have the following installed and running:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **Postman** (for GUI testing)
- **cURL** (for command-line testing)

### Starting the Application

1. **Clone and install dependencies:**
   ```bash
   cd recipes-app
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/recipes-app
   PORT=3000
   NODE_ENV=development
   API_VERSION=v1
   ```

3. **Start MongoDB:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Verify server is running:**
   Open browser to `http://localhost:3000/api/health`

## 🌐 API Endpoints Overview

### Base URLs
- **API Base:** `http://localhost:3000/api/v1`
- **Health Check:** `http://localhost:3000/api/health`
- **Documentation:** `http://localhost:3000/api`

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/recipes` | Get all recipes (with filtering/pagination) |
| `POST` | `/recipes` | Create a new recipe |
| `GET` | `/recipes/:id` | Get recipe by ID |
| `PUT` | `/recipes/:id` | Update recipe by ID |
| `DELETE` | `/recipes/:id` | Delete recipe by ID |
| `GET` | `/recipes/category/:category` | Get recipes by category |
| `GET` | `/recipes/difficulty/:difficulty` | Get recipes by difficulty |
| `POST` | `/recipes/:id/reviews` | Add review to recipe |
| `GET` | `/recipes/stats` | Get recipe statistics |

## 🔍 Testing with Postman

### 1. Import Collection and Environment

**Import the provided Postman files:**
- `Recipes-API.postman_collection.json`
- `Recipes-API.postman_environment.json`

### 2. Basic Testing Flow

#### Step 1: Health Check
```http
GET {{healthURL}}
```
**Expected Response (200):**
```json
{
  "success": true,
  "message": "Recipes API is running successfully",
  "timestamp": "2023-12-01T10:30:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

#### Step 2: Create a Recipe
```http
POST {{baseURL}}/recipes
Content-Type: application/json

{
  "title": "Spaghetti Carbonara",
  "description": "Classic Italian pasta dish with eggs, cheese, and pancetta",
  "ingredients": [
    {
      "name": "Spaghetti",
      "quantity": "400",
      "unit": "grams"
    },
    {
      "name": "Pancetta",
      "quantity": "150",
      "unit": "grams"
    },
    {
      "name": "Large eggs",
      "quantity": "3",
      "unit": "pieces"
    },
    {
      "name": "Parmigiano-Reggiano cheese",
      "quantity": "100",
      "unit": "grams"
    },
    {
      "name": "Black pepper",
      "quantity": "1",
      "unit": "teaspoon"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "description": "Bring a large pot of salted water to boil. Cook spaghetti according to package instructions."
    },
    {
      "step": 2,
      "description": "While pasta cooks, heat pancetta in a large skillet over medium heat until crispy."
    },
    {
      "step": 3,
      "description": "In a bowl, whisk together eggs, grated cheese, and black pepper."
    },
    {
      "step": 4,
      "description": "Drain pasta, reserving 1 cup pasta water. Add hot pasta to pancetta."
    },
    {
      "step": 5,
      "description": "Remove from heat, add egg mixture, tossing quickly to create creamy sauce."
    }
  ],
  "cookingTime": 15,
  "preparationTime": 10,
  "servings": 4,
  "difficulty": "Medium",
  "category": "Main Course",
  "cuisine": "Italian",
  "tags": ["pasta", "italian", "comfort food", "quick"],
  "nutritionInfo": {
    "calories": 520,
    "protein": 25,
    "carbohydrates": 65,
    "fat": 18
  },
  "createdBy": "Chef Marco"
}
```

**Store the returned `_id` in environment variable `recipeId`**

#### Step 3: Get All Recipes
```http
GET {{baseURL}}/recipes?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

#### Step 4: Get Recipe by ID
```http
GET {{baseURL}}/recipes/{{recipeId}}
```

#### Step 5: Update Recipe
```http
PUT {{baseURL}}/recipes/{{recipeId}}
Content-Type: application/json

{
  "rating": 4.5,
  "tags": ["pasta", "italian", "comfort food", "quick", "updated"]
}
```

#### Step 6: Add Review
```http
POST {{baseURL}}/recipes/{{recipeId}}/reviews
Content-Type: application/json

{
  "user": "Alice Johnson",
  "comment": "Delicious and authentic! Perfect creamy texture.",
  "rating": 5
}
```

#### Step 7: Search and Filter
```http
GET {{baseURL}}/recipes?search=pasta&category=Main Course&difficulty=Medium&minRating=4
```

#### Step 8: Get Statistics
```http
GET {{baseURL}}/recipes/stats
```

#### Step 9: Delete Recipe
```http
DELETE {{baseURL}}/recipes/{{recipeId}}
```

### 3. Postman Test Scripts

Add these test scripts to verify responses:

#### For Create Recipe:
```javascript
pm.test("Recipe created successfully", function () {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.have.property('_id');
    
    // Store recipe ID for future tests
    pm.environment.set("recipeId", response.data._id);
});

pm.test("Recipe contains required fields", function () {
    const response = pm.response.json();
    pm.expect(response.data).to.have.property('title');
    pm.expect(response.data).to.have.property('ingredients');
    pm.expect(response.data.ingredients).to.be.an('array');
    pm.expect(response.data.instructions).to.be.an('array');
});
```

## 💻 Testing with cURL

### 1. Health Check
```bash
curl -X GET http://localhost:3000/api/health
```

### 2. Create Recipe
```bash
curl -X POST http://localhost:3000/api/v1/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Quick Pancakes",
    "description": "Fluffy breakfast pancakes ready in minutes",
    "ingredients": [
      {"name": "All-purpose flour", "quantity": "1", "unit": "cup"},
      {"name": "Milk", "quantity": "1", "unit": "cup"},
      {"name": "Large egg", "quantity": "1", "unit": "piece"},
      {"name": "Sugar", "quantity": "2", "unit": "tablespoons"},
      {"name": "Baking powder", "quantity": "2", "unit": "teaspoons"},
      {"name": "Salt", "quantity": "1/2", "unit": "teaspoon"}
    ],
    "instructions": [
      {"step": 1, "description": "Mix dry ingredients in a bowl"},
      {"step": 2, "description": "Whisk wet ingredients separately"},
      {"step": 3, "description": "Combine wet and dry ingredients"},
      {"step": 4, "description": "Cook on hot griddle until golden"}
    ],
    "cookingTime": 10,
    "preparationTime": 5,
    "servings": 4,
    "difficulty": "Easy",
    "category": "Breakfast",
    "cuisine": "American",
    "createdBy": "Home Cook"
  }'
```

### 3. Get All Recipes
```bash
curl -X GET "http://localhost:3000/api/v1/recipes?page=1&limit=5"
```

### 4. Get Recipe by ID
```bash
# Replace RECIPE_ID with actual ID
curl -X GET http://localhost:3000/api/v1/recipes/RECIPE_ID
```

### 5. Update Recipe
```bash
curl -X PUT http://localhost:3000/api/v1/recipes/RECIPE_ID \
  -H "Content-Type: application/json" \
  -d '{"rating": 4.8, "servings": 6}'
```

### 6. Search Recipes
```bash
curl -X GET "http://localhost:3000/api/v1/recipes?search=pancakes&category=Breakfast"
```

### 7. Add Review
```bash
curl -X POST http://localhost:3000/api/v1/recipes/RECIPE_ID/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "user": "Food Lover",
    "comment": "Best pancakes ever!",
    "rating": 5
  }'
```

### 8. Delete Recipe
```bash
curl -X DELETE http://localhost:3000/api/v1/recipes/RECIPE_ID
```

## 🤖 Automated Testing Scripts

### Node.js Test Script

Create `test-api.js`:

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';
const HEALTH_URL = 'http://localhost:3000/api/health';

let createdRecipeId = null;

// Test data
const testRecipe = {
  title: "Test Chocolate Cake",
  description: "Rich and moist chocolate cake for testing",
  ingredients: [
    { name: "Flour", quantity: "2", unit: "cups" },
    { name: "Sugar", quantity: "1.5", unit: "cups" },
    { name: "Cocoa powder", quantity: "0.5", unit: "cup" }
  ],
  instructions: [
    { step: 1, description: "Preheat oven to 350°F" },
    { step: 2, description: "Mix dry ingredients" },
    { step: 3, description: "Add wet ingredients and mix" },
    { step: 4, description: "Bake for 30 minutes" }
  ],
  cookingTime: 30,
  preparationTime: 15,
  servings: 8,
  difficulty: "Medium",
  category: "Dessert",
  cuisine: "American",
  createdBy: "Test Chef"
};

async function runTests() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // 1. Health Check
    console.log('1. Testing Health Check...');
    const health = await axios.get(HEALTH_URL);
    console.log(`   ✅ Status: ${health.status}, Message: ${health.data.message}\n`);

    // 2. Create Recipe
    console.log('2. Testing Create Recipe...');
    const createResponse = await axios.post(`${BASE_URL}/recipes`, testRecipe);
    createdRecipeId = createResponse.data.data._id;
    console.log(`   ✅ Recipe created with ID: ${createdRecipeId}\n`);

    // 3. Get All Recipes
    console.log('3. Testing Get All Recipes...');
    const allRecipes = await axios.get(`${BASE_URL}/recipes`);
    console.log(`   ✅ Retrieved ${allRecipes.data.count} recipes\n`);

    // 4. Get Recipe by ID
    console.log('4. Testing Get Recipe by ID...');
    const singleRecipe = await axios.get(`${BASE_URL}/recipes/${createdRecipeId}`);
    console.log(`   ✅ Retrieved recipe: ${singleRecipe.data.data.title}\n`);

    // 5. Update Recipe
    console.log('5. Testing Update Recipe...');
    const updateData = { rating: 4.7, tags: ["chocolate", "cake", "dessert"] };
    const updateResponse = await axios.put(`${BASE_URL}/recipes/${createdRecipeId}`, updateData);
    console.log(`   ✅ Recipe updated, new rating: ${updateResponse.data.data.rating}\n`);

    // 6. Add Review
    console.log('6. Testing Add Review...');
    const reviewData = {
      user: "Test User",
      comment: "Excellent cake recipe!",
      rating: 5
    };
    const reviewResponse = await axios.post(`${BASE_URL}/recipes/${createdRecipeId}/reviews`, reviewData);
    console.log(`   ✅ Review added, total reviews: ${reviewResponse.data.data.reviews.length}\n`);

    // 7. Search Recipes
    console.log('7. Testing Search Functionality...');
    const searchResponse = await axios.get(`${BASE_URL}/recipes?search=chocolate&category=Dessert`);
    console.log(`   ✅ Search returned ${searchResponse.data.count} results\n`);

    // 8. Get Statistics
    console.log('8. Testing Statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/recipes/stats`);
    console.log(`   ✅ Total recipes in database: ${statsResponse.data.data.overview.totalRecipes}\n`);

    // 9. Delete Recipe
    console.log('9. Testing Delete Recipe...');
    await axios.delete(`${BASE_URL}/recipes/${createdRecipeId}`);
    console.log(`   ✅ Recipe deleted successfully\n`);

    // 10. Verify Deletion
    console.log('10. Verifying Recipe Deletion...');
    try {
      await axios.get(`${BASE_URL}/recipes/${createdRecipeId}`);
      console.log('   ❌ ERROR: Recipe still exists after deletion\n');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('   ✅ Recipe successfully deleted (404 confirmed)\n');
      } else {
        throw error;
      }
    }

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests
runTests();
```

### Run the automated tests:
```bash
node test-api.js
```

## 🧪 Test Scenarios

### 1. CRUD Operations Test Sequence

1. **Create** → **Read** → **Update** → **Delete**
2. Verify each operation returns correct status codes
3. Ensure data persistence between operations
4. Confirm proper error handling

### 2. Data Validation Tests

#### Valid Data Tests:
- All required fields present
- Correct data types
- Valid enum values
- Proper array structures

#### Invalid Data Tests:
- Missing required fields
- Invalid data types
- Invalid enum values
- Empty arrays where required
- Negative numbers where inappropriate

### 3. Search and Filter Tests

#### Search Tests:
- Search by title
- Search by description
- Search by cuisine
- Search by tags
- Case-insensitive search

#### Filter Tests:
- Filter by category
- Filter by difficulty
- Filter by rating range
- Filter by cooking time
- Combined filters

#### Pagination Tests:
- First page
- Last page
- Invalid page numbers
- Different page sizes

### 4. Performance Tests

#### Load Testing:
```bash
# Using Apache Bench (ab)
ab -n 100 -c 10 http://localhost:3000/api/v1/recipes

# Using curl in a loop
for i in {1..50}; do
  curl -s http://localhost:3000/api/v1/recipes > /dev/null &
done
wait
```

## ❌ Error Handling Tests

### 1. Invalid MongoDB ObjectId
```bash
curl -X GET http://localhost:3000/api/v1/recipes/invalid-id
# Expected: 400 Bad Request
```

### 2. Non-existent Recipe
```bash
curl -X GET http://localhost:3000/api/v1/recipes/507f1f77bcf86cd799439011
# Expected: 404 Not Found
```

### 3. Validation Errors
```bash
curl -X POST http://localhost:3000/api/v1/recipes \
  -H "Content-Type: application/json" \
  -d '{"title": "AB", "description": ""}'
# Expected: 400 Bad Request with validation details
```

### 4. Invalid Category
```bash
curl -X GET http://localhost:3000/api/v1/recipes/category/InvalidCategory
# Expected: 400 Bad Request
```

### 5. Invalid JSON
```bash
curl -X POST http://localhost:3000/api/v1/recipes \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", invalid json}'
# Expected: 400 Bad Request
```

## 📊 Expected Test Results

### Successful Responses

| Operation | Status Code | Response Structure |
|-----------|-------------|-------------------|
| Health Check | 200 | `{success: true, message: string}` |
| Create Recipe | 201 | `{success: true, data: Recipe}` |
| Get Recipes | 200 | `{success: true, data: Recipe[], pagination: object}` |
| Get Recipe | 200 | `{success: true, data: Recipe}` |
| Update Recipe | 200 | `{success: true, data: Recipe}` |
| Delete Recipe | 200 | `{success: true, message: string}` |
| Add Review | 201 | `{success: true, data: Recipe}` |
| Get Stats | 200 | `{success: true, data: Statistics}` |

### Error Responses

| Error Type | Status Code | Response Structure |
|------------|-------------|-------------------|
| Validation Error | 400 | `{success: false, error: string, details: array}` |
| Invalid ID | 400 | `{success: false, error: "Invalid ID"}` |
| Not Found | 404 | `{success: false, error: "Recipe not found"}` |
| Rate Limited | 429 | `{success: false, error: "Too many requests"}` |
| Server Error | 500 | `{success: false, error: "Server Error"}` |

## 🔧 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure server is running: `npm start`
   - Check if port 3000 is available
   - Verify MongoDB is running

2. **MongoDB Connection Error**
   - Start MongoDB service
   - Check connection string in `.env`
   - Verify MongoDB port (default: 27017)

3. **Validation Errors**
   - Check request body format
   - Ensure all required fields are present
   - Verify data types match schema

4. **404 Errors**
   - Confirm recipe ID exists
   - Check endpoint spelling
   - Verify API version in URL

### Debug Commands

```bash
# Check if MongoDB is running
mongo --eval "db.stats()"

# Check server logs
npm start

# Test server connectivity
curl -I http://localhost:3000/api/health

# View environment variables
cat .env
```

## 📚 Additional Resources

- [Postman Documentation](https://learning.postman.com/)
- [cURL Manual](https://curl.se/docs/manual.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

## 🤝 Contributing to Tests

When adding new features:

1. Add corresponding test cases
2. Update this testing guide
3. Include error scenarios
4. Test edge cases
5. Verify backwards compatibility

---

**Happy Testing! 🚀**