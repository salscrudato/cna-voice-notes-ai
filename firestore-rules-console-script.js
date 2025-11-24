// Firestore Rules Update Script - Paste this into Firebase Console browser console
// This script will update the Firestore rules to allow read/write access

(async function() {
  try {
    console.log('🔄 Starting Firestore Rules update...');
    
    // Get the rules editor
    const rulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

    // Find the editor element
    const editor = document.querySelector('[role="textbox"]');
    if (!editor) {
      console.error('❌ Could not find editor. Make sure you are on the Firestore Rules page.');
      return;
    }

    // Clear existing content
    editor.textContent = '';
    
    // Set new content
    editor.textContent = rulesText;
    
    // Trigger input event to notify the app of changes
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    editor.dispatchEvent(new Event('change', { bubbles: true }));
    
    console.log('✅ Rules text inserted into editor');
    console.log('📋 Rules preview:');
    console.log(rulesText);
    console.log('\n⏭️  Next step: Click the blue "Publish" button in the top right');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();

