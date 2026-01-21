const Recipe = require('./models/Recipe');
const connectDB = require('./config/database');
const sampleData = require('./sampleData.json');

require('dotenv').config();

const setupDatabase = async () => {
  try {
    console.log('🚀 Starting database setup...\n');

    // Connect to MongoDB
    await connectDB();

    // Clear existing recipes
    console.log('🧹 Clearing existing recipes...');
    await Recipe.deleteMany({});
    console.log('✅ Existing recipes cleared\n');

    // Insert sample data
    console.log('📦 Inserting sample data...');
    const recipes = await Recipe.insertMany(sampleData);
    console.log(`✅ Successfully inserted ${recipes.length} recipes\n`);

    // Display summary
    console.log('📊 Database Setup Complete!');
    console.log('==============================');
    console.log(`📝 Total recipes: ${recipes.length}`);

    // Count by category
    const categoryStats = await Recipe.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📂 Recipes by category:');
    categoryStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

    // Count by difficulty
    const difficultyStats = await Recipe.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    console.log('\n⚡ Recipes by difficulty:');
    difficultyStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

    console.log('\n🎯 Sample Recipe IDs for testing:');
    recipes.slice(0, 3).forEach((recipe, index) => {
      console.log(`   ${index + 1}. ${recipe.title}: ${recipe._id}`);
    });

    console.log('\n🌐 Your API is ready at: http://localhost:3000/api/v1');
    console.log('📊 Health check: http://localhost:3000/api/health');
    console.log('📚 Documentation: http://localhost:3000/api');

    console.log('\n🧪 Quick Test Commands:');
    console.log('   curl http://localhost:3000/api/health');
    console.log('   curl http://localhost:3000/api/v1/recipes');
    console.log(`   curl http://localhost:3000/api/v1/recipes/${recipes[0]._id}`);

    console.log('\n✨ Setup completed successfully!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
