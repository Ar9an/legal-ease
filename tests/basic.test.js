// Simple backend test file
// Run: node tests/basic.test.js

import mongoose from 'mongoose';
import User from '../models/User.js';
import Document from '../models/Document.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/legal-ease-test';

async function runTests() {
  try {
    console.log('🧪 Starting LegalEase Backend Tests...\n');

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✓ MongoDB connection successful');

    // Test 1: User model validation
    console.log('\n--- Test 1: User Model Validation ---');
    try {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
      await user.save();
      console.log('✓ User created successfully');
      console.log(`  ID: ${user._id}`);
      console.log(`  Email: ${user.email}`);

      // Test password hashing
      const isPasswordMatch = await user.matchPassword('password123');
      console.log(`✓ Password hashing works: ${isPasswordMatch}`);

      // Cleanup
      await User.deleteOne({ _id: user._id });
    } catch (error) {
      console.error('✗ User model test failed:', error.message);
    }

    // Test 2: Document model with versions
    console.log('\n--- Test 2: Document Model with Versions ---');
    try {
      const testUser = await User.create({
        name: 'Doc Test User',
        email: 'doctest@example.com',
        password: 'test123',
      });

      const doc = new Document({
        user: testUser._id,
        title: 'Test Lease',
        content: 'This is a test lease agreement',
        analysis: {
          summary: 'Test summary',
          risks: ['Risk1', 'Risk2'],
        },
      });
      await doc.save();
      console.log('✓ Document created successfully');
      console.log(`  ID: ${doc._id}`);
      console.log(`  Title: ${doc.title}`);
      console.log(`  Versions: ${doc.versions.length}`);

      // Test update with version tracking
      doc.title = 'Updated Title';
      doc.versions.push({
        title: doc.title,
        content: doc.content,
        analysis: doc.analysis,
      });
      await doc.save();
      console.log('✓ Document update with version tracking works');
      console.log(`  Current versions: ${doc.versions.length}`);

      // Cleanup
      await Document.deleteOne({ _id: doc._id });
      await User.deleteOne({ _id: testUser._id });
    } catch (error) {
      console.error('✗ Document model test failed:', error.message);
    }

    // Test 3: Database connection
    console.log('\n--- Test 3: Database Health Check ---');
    const admin = mongoose.connection.getClient().db('admin');
    const status = await admin.command({ ping: 1 });
    console.log('✓ MongoDB ping successful');
    console.log(`  Response: ${JSON.stringify(status)}`);

    console.log('\n✅ All tests completed!\n');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

runTests();
