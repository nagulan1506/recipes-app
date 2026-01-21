# Recipes App - Complete CRUD API

A comprehensive Node.js REST API for managing recipes built with Express.js and MongoDB using Mongoose. This application follows the MVC (Model-View-Controller) pattern and provides full CRUD operations for recipe management.

## 🚀 Features

- **Complete CRUD Operations**: Create, Read, Update, Delete recipes
- **Advanced Filtering**: Filter by category, difficulty, cuisine, rating, and cooking time
- **Search Functionality**: Full-text search across recipe titles, descriptions, and cuisines
- **Pagination**: Efficient pagination for large datasets
- **Sorting**: Sort recipes by various fields (title, rating, creation date, etc.)
- **Review System**: Add and manage recipe reviews with ratings
- **Data Validation**: Comprehensive input validation using Joi
- **Error Handling**: Robust error handling with detailed error messages
- **Security**: Rate limiting, CORS, and security headers
- **Statistics**: Recipe analytics and statistics endpoints
- **Documentation**: Comprehensive API documentation

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Joi
- **Security**: Helmet, CORS, Express Rate Limit
- **Environment**: dotenv
- **Development**: Nodemon

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (v4.4 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recipes-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/recipes-app
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # API Configuration
   API_VERSION=v1
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Windows
   net start MongoDB
   
   # On Linux
   sudo systemctl start mongod
   ```

5. **Run the application**
   
   **Development mode:**
   ```bash
   npm run dev
   ```
   
   **Production mode:**
   ```bash
   npm start
   ```

6. **Verify installation**
   Open your browser and navigate to:
   - API Health Check: `http://localhost:3000/api/health`
   - API Documentation: `http://localhost:3000/api`

## 📁 Project Structure

```
recipes-app/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── recipeController.js  # Recipe controller with CRUD operations
├── middleware/
│   ├── errorHandler.js      # Error handling middleware
│   └── validation.js        # Request validation middleware
├── models/
│   └── Recipe.js            # Recipe schema/model
├── routes/
│   └── recipeRoutes.js      # Recipe routes
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies and scripts
├── README.md               # This file
└── server.js               # Main server file
```

## 🌐 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Recipe Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/recipes` | Get all recipes with filtering, sorting, and pagination |
| `POST` | `/recipes` | Create a new recipe |
| `GET` | `/recipes/:id` | Get a specific recipe by ID |
| `PUT` | `/recipes/:id` | Update a recipe by ID |
| `DELETE` | `/recipes/:id` | Delete a recipe by ID |
| `GET` | `/recipes/category/:category` | Get recipes by category |
| `GET` | `/recipes/difficulty/:difficulty` | Get recipes by difficulty level |
| `POST` | `/recipes/:id/reviews` | Add a review to a recipe |
| `GET` | `/recipes/stats` | Get recipe statistics |

### Query Parameters

#### Pagination
- `page` - Page number (default: 1)
- `limit` - Number of items per page (default: 10, max: 100)

#### Filtering
- `category` - Filter by category (Appetizer, Main Course, Dessert, etc.)
- `difficulty` - Filter by difficulty (Easy, Medium, Hard)
- `cuisine` - Filter by cuisine type
- `minRating` - Minimum rating filter (0-5)
- `maxCookingTime` - Maximum cooking time in minutes

#### Sorting
- `sortBy` - Sort field (title, createdAt, rating, totalTime, difficulty)
- `sortOrder` - Sort order (asc, desc)

#### Search
- `search` - Full-text search in title, description, cuisine, and tags

### Example Requests

#### Get All Recipes
```http
GET /api/v1/recipes?page=1&limit=10&category=Dessert&sortBy=rating&sortOrder=desc
```

#### Create Recipe
```http
POST /api/v1/recipes
Content-Type: application/json

{
  "title": "Chocolate Chip Cookies",
  "description": "Classic homemade chocolate chip cookies",
  "ingredients": [
    {
      "name": "All-purpose flour",
      "quantity": "2.25",
      "unit": "cups"
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
      "description": "Preheat oven to 375°F"
    },
    {
      "step": 2,
      "description": "Mix dry ingredients in a bowl"
    }
  ],
  "cookingTime": 12,
  "preparationTime": 15,
  "servings": 24,
  "difficulty": "Easy",
  "category": "Dessert",
  "cuisine": "American",
  "createdBy": "Chef John"
}
```

#### Update Recipe
```http
PUT /api/v1/recipes/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "title": "Updated Chocolate Chip Cookies",
  "cookingTime": 15
}
```

#### Add Review
```http
POST /api/v1/recipes/507f1f77bcf86cd799439011/reviews
Content-Type: application/json

{
  "user": "John Doe",
  "comment": "Absolutely delicious!",
  "rating": 5
}
```

## 📊 Recipe Schema

```javascript
{
  "title": "String (required, 3-100 characters)",
  "description": "String (required, max 500 characters)",
  "ingredients": [
    {
      "name": "String (required)",
      "quantity": "String (required)",
      "unit": "String (required)"
    }
  ],
  "instructions": [
    {
      "step": "Number (required)",
      "description": "String (required)"
    }
  ],
  "cookingTime": "Number (required, min 1)",
  "preparationTime": "Number (required, min 1)",
  "servings": "Number (required, min 1)",
  "difficulty": "String (Easy, Medium, Hard)",
  "category": "String (Appetizer, Main Course, Dessert, etc.)",
  "cuisine": "String (required)",
  "tags": ["String"],
  "nutritionInfo": {
    "calories": "Number",
    "protein": "Number",
    "carbohydrates": "Number",
    "fat": "Number"
  },
  "imageUrl": "String (valid image URL)",
  "rating": "Number (0-5)",
  "reviews": [
    {
      "user": "String",
      "comment": "String",
      "rating": "Number (1-5)",
      "createdAt": "Date"
    }
  ],
  "createdBy": "String (required)",
  "isPublic": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 🧪 Testing with Postman

### Postman Collection

Import the following collection to test all endpoints:

1. **Create a new collection** named "Recipes API"
2. **Set base URL variable**: `{{baseURL}}` = `http://localhost:3000/api/v1`

### Sample Test Cases

#### 1. Health Check
- **Method**: GET
- **URL**: `http://localhost:3000/api/health`
- **Expected**: Status 200 with API health information

#### 2. Create Recipe
- **Method**: POST
- **URL**: `{{baseURL}}/recipes`
- **Headers**: `Content-Type: application/json`
- **Body**: Use the create recipe example above

#### 3. Get All Recipes
- **Method**: GET
- **URL**: `{{baseURL}}/recipes`
- **Expected**: List of recipes with pagination

#### 4. Get Recipe by ID
- **Method**: GET
- **URL**: `{{baseURL}}/recipes/{{recipeId}}`
- **Expected**: Single recipe object

#### 5. Update Recipe
- **Method**: PUT
- **URL**: `{{baseURL}}/recipes/{{recipeId}}`
- **Body**: Partial recipe data to update

#### 6. Delete Recipe
- **Method**: DELETE
- **URL**: `{{baseURL}}/recipes/{{recipeId}}`
- **Expected**: Success confirmation

#### 7. Search Recipes
- **Method**: GET
- **URL**: `{{baseURL}}/recipes?search=chocolate&category=Dessert`
- **Expected**: Filtered recipes matching criteria

### Postman Environment Variables

Set up the following environment variables:
- `baseURL`: `http://localhost:3000/api/v1`
- `recipeId`: (set after creating a recipe)

## 🚨 Error Handling

The API provides comprehensive error handling with detailed error messages:

### Error Response Format
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message",
  "details": ["Additional error details"] // For validation errors
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive data validation
- **CORS**: Configurable cross-origin resource sharing
- **Security Headers**: Using Helmet.js
- **Environment Variables**: Sensitive data protection

## 📈 Performance Features

- **Database Indexing**: Optimized queries
- **Pagination**: Efficient data retrieval
- **Query Optimization**: Aggregation pipelines for statistics
- **Connection Pooling**: MongoDB connection optimization

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify MongoDB port (default: 27017)

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill process using the port: `lsof -ti:3000 | xargs kill`

3. **Validation Errors**
   - Check request body format
   - Ensure all required fields are provided
   - Verify data types match schema

4. **Rate Limiting**
   - Wait for rate limit window to reset
   - Adjust rate limit settings in `.env`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB team for the robust database
- Mongoose team for the ODM
- All open-source contributors

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Joi Validation](https://joi.dev/)
- [Postman Documentation](https://learning.postman.com/)

---

**Happy Coding! 🚀**