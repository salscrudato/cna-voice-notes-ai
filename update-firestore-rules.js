#!/usr/bin/env node

/**
 * Update Firestore Security Rules
 * This script updates the Firestore security rules to allow read/write access
 * 
 * Usage: node update-firestore-rules.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
// Make sure you have GOOGLE_APPLICATION_CREDENTIALS set or firebase-adminsdk JSON file
try {
  admin.initializeApp({
    projectId: 'generic-voice',
  });
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error.message);
  console.log('\nTo use this script, you need to:');
  console.log('1. Download your Firebase service account key from Firebase Console');
  console.log('2. Set GOOGLE_APPLICATION_CREDENTIALS environment variable:');
  console.log('   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"');
  process.exit(1);
}

const rulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

async function updateRules() {
  try {
    console.log('🔄 Updating Firestore Security Rules...\n');
    
    const rulesService = admin.securityRules();
    
    // Create a new ruleset
    const ruleset = await rulesService.createRuleset({
      source: {
        files: [
          {
            name: 'firestore.rules',
            content: rulesText,
          },
        ],
      },
    });
    
    console.log('✅ Ruleset created:', ruleset.name);
    
    // Release the ruleset
    const release = await rulesService.releaseRuleset({
      name: ruleset.name,
      testSuite: {
        name: 'projects/generic-voice/rulesets/' + ruleset.name.split('/').pop(),
      },
    });
    
    console.log('✅ Ruleset released:', release.name);
    console.log('\n✨ Firestore Security Rules updated successfully!\n');
    console.log('Rules:');
    console.log(rulesText);
    console.log('\n🎉 You can now use Firestore in your app!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating rules:', error.message);
    process.exit(1);
  }
}

updateRules();

