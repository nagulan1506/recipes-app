const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const API_BASE = BASE_URL + '/api/v1';

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  console.log('\n🔍 Testing Health Check...');
  try {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET'
    };

    const result = await makeRequest(options);
    console.log(`✅ Status: ${result.status}`);
    console.log(`📝 Response:`, JSON.stringify(result.data, null, 2));
    return result.status === 200;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function testGetAllRecipes() {
  console.log('\n📚 Testing Get All Recipes...');
  try {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/recipes',
      method: 'GET'
    };

    const result = await makeRequest(options);
    console.log(`✅ Status: ${result.status}`);
    console.log(`📊 Found ${result.data.count} recipes`);
    console.log(`📄 Pagination:`, JSON.stringify(result.data.pagination, null, 2));

    if (result.data.data && result.data.data.length > 0) {
      console.log(`📝 First recipe: ${result.data.data[0].title}`);
      return { success: result.status === 200, recipeId: result.data.data[0]._id };
    }
    return { success: result.status === 200, recipeId: null };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return { success: false, recipeId: null };
  }
}

async function testCreateRecipe() {
  console.log('\n➕ Testing Create Recipe...');
  try {
    const newRecipe = {
      title: "Test API Pancakes",
      description: "Delicious pancakes created via API test",
      ingredients: [
        { name: "Flour", quantity: "2", unit: "cups" },
        { name: "Milk", quantity: "1.5", unit: "cups" },
        { name: "Eggs", quantity: "2", unit: "pieces" },
        { name: "Sugar", quantity: "2", unit: "tablespoons" }
      ],
      instructions: [
        { step: 1, description: "Mix dry ingredients" },
        { step: 2, description: "Add wet ingredients" },
        { step: 3, description: "Cook on griddle" }
      ],
      cookingTime: 10,
      preparationTime: 5,
      servings: 4,
      difficulty: "Easy",
      category: "Breakfast",
      cuisine: "American",
      createdBy: "API Test"
    };

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/recipes',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options, newRecipe);
    console.log(`✅ Status: ${result.status}`);

    if (result.status === 201) {
      console.log(`📝 Created recipe: ${result.data.data.title}`);
      console.log(`🆔 Recipe ID: ${result.data.data._id}`);
      return { success: true, recipeId: result.data.data._id };
    } else {
      console.log(`❌ Failed to create recipe:`, JSON.stringify(result.data, null, 2));
      return { success: false, recipeId: null };
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return { success: false, recipeId: null };
  }
}

async function testGetRecipeById(recipeId) {
  console.log(`\n🔎 Testing Get Recipe by ID: ${recipeId}...`);
  try {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/v1/recipes/${recipeId}`,
      method: 'GET'
    };

    const result = await makeRequest(options);
    console.log(`✅ Status: ${result.status}`);

    if (result.status === 200) {
      console.log(`📝 Recipe: ${result.data.data.title}`);
      console.log(`👨‍🍳 Created by: ${result.data.data.createdBy}`);
      console.log(`⏱️ Total time: ${result.data.data.totalTime} minutes`);
      return true;
    } else {
      console.log(`❌ Failed to get recipe:`, JSON.stringify(result.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function testUpdateRecipe(recipeId) {
  console.log(`\n✏️ Testing Update Recipe: ${recipeId}...`);
  try {
    const updateData = {
      title: "Updated Test API Pancakes",
      rating: 4.5,
      tags: ["pancakes", "breakfast", "updated", "api-test"]
    };

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/v1/recipes/${recipeId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options, updateData);
    console.log(`✅ Status: ${result.status}`);

    if (result.status === 200) {
      console.log(`📝 Updated recipe: ${result.data.data.title}`);
      console.log(`⭐ Rating: ${result.data.data.rating}`);
      console.log(`🏷️ Tags: ${result.data.data.tags.join(', ')}`);
      return true;
    } else {
      console.log(`❌ Failed to update recipe:`, JSON.stringify(result.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function testAddReview(recipeId) {
  console.log(`\n⭐ Testing Add Review to Recipe: ${recipeId}...`);
  try {
    const review = {
      user: "API Tester",
      comment: "Great recipe! Tested via API and it works perfectly.",
      rating: 5
    };

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/v1/recipes/${recipeId}/reviews`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options, review);
    console.log(`✅ Status: ${result.status}`);

    if (result.status === 201) {
      console.log(`📝 Added review by: ${review.user}`);
      console.log(`💬 Comment: ${review.comment}`);
      console.log(`⭐ Rating: ${review.rating}`);
      const avgRating = result.data.data.averageRating || result.data.data.rating;
      console.log(`📊 New average rating: ${avgRating}`);
      return true;
    } else {
      console.log(`❌ Failed to add review:`, JSON.stringify(result.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function testGetStats() {
  console.log('\n📊 Testing Get Recipe Statistics...');
  try {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/recipes/stats',
      method: 'GET'
    };

    const result = await makeRequest(options);
    console.log(`✅ Status: ${result.status}`);

    if (result.status === 200) {
      const stats = result.data.data;
      console.log(`📈 Total recipes: ${stats.overview.totalRecipes || 0}`);
      console.log(`⭐ Average rating: ${(stats.overview.avgRating || 0).toFixed(1)}`);
      console.log(`⏱️ Avg cooking time: ${(stats.overview.avgCookingTime || 0).toFixed(1)} minutes`);
      console.log(`📂 Categories:`, stats.byCategory.map(c => `${c._id}: ${c.count}`).join(', '));
      return true;
    } else {
      console.log(`❌ Failed to get stats:`, JSON.stringify(result.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function testDeleteRecipe(recipeId) {
  console.log(`\n🗑️ Testing Delete Recipe: ${recipeId}...`);
  try {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/v1/recipes/${recipeId}`,
      method: 'DELETE'
    };

    const result = await makeRequest(options);
    console.log(`✅ Status: ${result.status}`);

    if (result.status === 200) {
      console.log(`🗑️ Successfully deleted recipe`);
      return true;
    } else {
      console.log(`❌ Failed to delete recipe:`, JSON.stringify(result.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function testSearch() {
  console.log('\n🔍 Testing Recipe Search...');
  try {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/recipes?search=chocolate&category=Dessert',
      method: 'GET'
    };

    const result = await makeRequest(options);
    console.log(`✅ Status: ${result.status}`);

    if (result.status === 200) {
      console.log(`🔍 Found ${result.data.count} recipes matching search`);
      if (result.data.data.length > 0) {
        result.data.data.forEach((recipe, index) => {
          console.log(`   ${index + 1}. ${recipe.title} (${recipe.category})`);
        });
      }
      return true;
    } else {
      console.log(`❌ Search failed:`, JSON.stringify(result.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 Starting Recipes API Tests...');
  console.log('=====================================');

  const results = {
    healthCheck: false,
    getAllRecipes: false,
    createRecipe: false,
    getRecipeById: false,
    updateRecipe: false,
    addReview: false,
    getStats: false,
    search: false,
    deleteRecipe: false
  };

  let createdRecipeId = null;

  // Test 1: Health Check
  results.healthCheck = await testHealthCheck();

  // Test 2: Get All Recipes
  const getAllResult = await testGetAllRecipes();
  results.getAllRecipes = getAllResult.success;

  // Test 3: Create Recipe
  const createResult = await testCreateRecipe();
  results.createRecipe = createResult.success;
  createdRecipeId = createResult.recipeId;

  // Test 4: Get Recipe by ID (using created recipe)
  if (createdRecipeId) {
    results.getRecipeById = await testGetRecipeById(createdRecipeId);

    // Test 5: Update Recipe
    results.updateRecipe = await testUpdateRecipe(createdRecipeId);

    // Test 6: Add Review
    results.addReview = await testAddReview(createdRecipeId);
  }

  // Test 7: Get Statistics
  results.getStats = await testGetStats();

  // Test 8: Search
  results.search = await testSearch();

  // Test 9: Delete Recipe (cleanup)
  if (createdRecipeId) {
    results.deleteRecipe = await testDeleteRecipe(createdRecipeId);
  }

  // Summary
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('=======================');
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });

  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log('🎉 All tests passed! Your Recipes API is working perfectly!');
  } else {
    console.log('⚠️ Some tests failed. Please check the server and try again.');
  }
}

// Run tests
runTests().catch(console.error);
