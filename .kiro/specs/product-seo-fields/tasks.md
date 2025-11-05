# Implementation Plan

- [x] 1. Create database migration for SEO fields





  - Create MikroORM migration file with timestamp naming convention
  - Implement up migration: ALTER TABLE product ADD COLUMN for seo_title, seo_description, short_description (all TEXT, nullable)
  - Implement down migration: DROP COLUMN IF EXISTS for all three fields
  - Place migration in src/migrations/ directory
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 2. Extend Product data model with SEO fields





  - Create src/models/product.ts file
  - Define Product model extension using @medusajs/utils model.define()
  - Add seo_title as model.text().nullable()
  - Add seo_description as model.text().nullable()
  - Add short_description as model.text().nullable()
  - Export the extended Product model
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 3. Implement SEO validation middleware





  - Create or update src/api/middlewares.ts
  - Implement validateSeoFields middleware function
  - Add validation logic: if status === "published", check seo_title and seo_description are not null/empty/whitespace
  - Return 400 error with message "seo_title is required for published products" when seo_title missing
  - Return 400 error with message "seo_description is required for published products" when seo_description missing
  - Configure middleware to apply to POST /admin/products and PATCH /admin/products/:id routes
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
-

- [x] 4. Create custom Admin API route handlers for products



  - Create src/api/admin/products/route.ts
  - Implement POST handler that accepts seo_title, seo_description, short_description from request body
  - Implement POST handler that passes SEO fields to productModuleService.create()
  - Ensure POST handler returns product with SEO fields in response
  - Create src/api/admin/products/[id]/route.ts
  - Implement PATCH handler that accepts seo_title, seo_description, short_description from request body
  - Implement PATCH handler that passes SEO fields to productModuleService.update()
  - Ensure PATCH handler returns updated product with SEO fields in response
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_





- [ ] 5. Create Admin UI widget for SEO fields

  - Create src/admin/widgets/product-seo-fields.tsx
  - Import defineWidgetConfig from @medusajs/admin-shared
  - Create ProductSeoFields React component
  - Add Input component for "Meta Title" bound to seo_title field
  - Add Textarea component for "Meta Description" bound to seo_description field with character counter
  - Add Textarea component for "Short Description" bound to short_description field
  - Implement character counter logic for seo_description (display current length)
  - Configure widget to inject into "product.details.after" and "product.create.after" zones
  - Handle form state integration with Admin SDK form context
  - Display validation error messages from API responses
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 6. Verify Store API includes SEO fields in responses



  - Check that Store API product queries automatically include seo_title, seo_description, short_description
  - If needed, update Store API serializers to include SEO fields
  - _Requirements: 6.1, 6.2, 6.3_



- [ ] 7. Create migration execution script and documentation

  - Document migration execution command: `npm run build && npx medusa migrations run`
  - Create verification SQL queries to check column existence
  - Document rollback command: `npx medusa migrations revert`


  - Add deployment notes for Railway (migrations run automatically on start)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8. Manual testing and verification

  - Execute migration up and verify columns exist in product table
  - Test creating draft product without SEO fields (should succeed)
  - Test creating published product without seo_title (should fail with 400)
  - Test creating published product without seo_description (should fail with 400)
  - Test creating published product with all SEO fields (should succeed)
  - Test updating draft product to published without SEO fields (should fail with 400)
  - Test updating published product SEO fields (should succeed)
  - Test retrieving product via Admin API (should include SEO fields)
  - Test Admin UI Create Product form (verify SEO fields visible and functional)
  - Test Admin UI Edit Product form (verify SEO fields populated and editable)
  - Test character counter in Meta Description field
  - Test validation error display in Admin UI
  - Execute migration down and verify columns removed
  - Execute migration up again to verify idempotency
  - _Requirements: All requirements_

- [ ] 9. Document Storefront integration pattern
  - Create documentation file explaining how to use SEO fields in Storefront
  - Document meta title pattern: product.seo_title || product.title
  - Document meta description pattern: product.seo_description || product.subtitle || ""
  - Document short_description usage in product listing cards
  - Provide code examples for Next.js Head component
  - _Requirements: 6.4, 6.5_
