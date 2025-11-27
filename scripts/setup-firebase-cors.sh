#!/bin/bash

# Firebase Storage CORS Configuration Setup Script
# This script configures CORS rules for Firebase Storage to allow uploads from localhost and production domains

echo "Setting up Firebase Storage CORS configuration..."
echo ""
echo "Prerequisites:"
echo "1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install"
echo "2. Authenticate: gcloud auth login"
echo "3. Set project: gcloud config set project generic-voice"
echo ""
echo "To apply CORS configuration, run:"
echo "gsutil cors set cors.json gs://generic-voice.firebasestorage.app"
echo ""
echo "To verify CORS configuration, run:"
echo "gsutil cors get gs://generic-voice.firebasestorage.app"
echo ""
echo "Note: Replace 'generic-voice.firebasestorage.app' with your actual Firebase Storage bucket name"

