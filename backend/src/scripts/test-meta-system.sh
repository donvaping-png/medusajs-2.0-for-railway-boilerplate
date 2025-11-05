#!/bin/bash

# Test script for Meta Fields System
# Make sure your backend is running on localhost:9000

BASE_URL="http://localhost:9000"
ADMIN_TOKEN="YOUR_ADMIN_TOKEN_HERE"

echo "=== Testing Meta Fields System ==="
echo ""

# Test 1: List definitions
echo "Test 1: List meta definitions for categories"
curl -s -X GET "$BASE_URL/admin/meta/definitions?scope=category" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
echo ""

# Test 2: Create a test category
echo "Test 2: Create a test category"
CATEGORY_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Test Category",
    "handle": "test-category",
    "is_active": true
  }')
echo "$CATEGORY_RESPONSE" | jq .
CATEGORY_ID=$(echo "$CATEGORY_RESPONSE" | jq -r '.category.id')
echo "Created category ID: $CATEGORY_ID"
echo ""

# Test 3: Get meta for the new category (should have defaults)
echo "Test 3: Get meta for new category (should have default values)"
curl -s -X GET "$BASE_URL/admin/categories/$CATEGORY_ID/meta" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
echo ""

# Test 4: Update meta with valid values
echo "Test 4: Update meta with valid values"
curl -s -X POST "$BASE_URL/admin/categories/$CATEGORY_ID/meta" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "seo.meta_title": "Test Category - Best Products",
    "seo.meta_description": "Discover our amazing test category with the best products available in the market.",
    "seo.short_description": "A short description for testing purposes"
  }' | jq .
echo ""

# Test 5: Try to update with invalid value (meta_title too long)
echo "Test 5: Try to update with invalid value (should fail with 422)"
curl -s -X POST "$BASE_URL/admin/categories/$CATEGORY_ID/meta" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "seo.meta_title": "This is a very long meta title that exceeds the maximum allowed length of 70 characters and should fail validation"
  }' | jq .
echo ""

# Test 6: Get meta again to verify the update
echo "Test 6: Get meta again to verify the valid update was saved"
curl -s -X GET "$BASE_URL/admin/categories/$CATEGORY_ID/meta" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
echo ""

echo "=== Tests completed ==="
