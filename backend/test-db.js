const mongoose = require('mongoose');
const config = require('./config/config');

const testConnection = async () => {
  try {
    console.log('Testing database connection...');
    console.log('MongoDB URI:', config.MONGODB_URI);
    
    const conn = await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Test creating a simple document
    const TestModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
    const testDoc = await TestModel.create({ name: 'test' });
    console.log('✅ Database write test successful');
    
    // Clean up test document
    await TestModel.findByIdAndDelete(testDoc._id);
    console.log('✅ Database cleanup successful');
    
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

testConnection();
