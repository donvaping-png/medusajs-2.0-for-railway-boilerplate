# Requirements Document

## Introduction

This feature adds custom SEO fields to products in MedusaJS v2 to improve search engine optimization and product presentation. The system will extend the product entity with three new text fields (seo_title, seo_description, short_description) that can be managed through the Admin API and Admin UI, with validation rules that ensure published products have complete SEO metadata.

## Glossary

- **Product Entity**: The core MedusaJS database table and data model representing products in the e-commerce system
- **Admin API**: The backend REST API endpoints under /admin/* used by administrators to manage the store
- **Admin UI**: The MedusaJS Dashboard frontend application used by administrators
- **Migration**: A database schema change script that can be applied (up) or reverted (down)
- **Published Status**: A product state where status field equals "published", making it visible to customers
- **SEO Metadata**: Search engine optimization data including meta title and meta description
- **MikroORM**: The Object-Relational Mapping library used by MedusaJS v2 for database operations
- **Storefront**: The customer-facing Next.js application that displays products

## Requirements

### Requirement 1

**User Story:** As a store administrator, I want to add custom SEO fields to products, so that I can optimize product pages for search engines and improve organic traffic.

#### Acceptance Criteria

1. THE Product Entity SHALL include a column named seo_title of type TEXT that accepts NULL values
2. THE Product Entity SHALL include a column named seo_description of type TEXT that accepts NULL values
3. THE Product Entity SHALL include a column named short_description of type TEXT that accepts NULL values
4. THE Migration System SHALL provide a rollback script that removes the three new columns from the Product Entity
5. WHEN a database migration is executed, THE Product Entity SHALL retain all existing product data without data loss

### Requirement 2

**User Story:** As a store administrator, I want to set SEO metadata when creating or editing products through the Admin API, so that I can manage SEO content programmatically.

#### Acceptance Criteria

1. WHEN an administrator sends a POST request to /admin/products, THE Admin API SHALL accept seo_title as an optional string parameter
2. WHEN an administrator sends a POST request to /admin/products, THE Admin API SHALL accept seo_description as an optional string parameter
3. WHEN an administrator sends a POST request to /admin/products, THE Admin API SHALL accept short_description as an optional string parameter
4. WHEN an administrator sends a PATCH request to /admin/products/:id, THE Admin API SHALL accept seo_title as an optional string parameter
5. WHEN an administrator sends a PATCH request to /admin/products/:id, THE Admin API SHALL accept seo_description as an optional string parameter
6. WHEN an administrator sends a PATCH request to /admin/products/:id, THE Admin API SHALL accept short_description as an optional string parameter
7. WHEN an administrator retrieves a product via GET /admin/products/:id, THE Admin API SHALL include seo_title, seo_description, and short_description in the response payload

### Requirement 3

**User Story:** As a store administrator, I want the system to validate SEO fields before publishing a product, so that all published products have complete SEO metadata for search engines.

#### Acceptance Criteria

1. WHEN an administrator attempts to create or update a product with status set to "published" AND seo_title is NULL or contains only whitespace, THE Admin API SHALL reject the request with HTTP status 400
2. WHEN an administrator attempts to create or update a product with status set to "published" AND seo_description is NULL or contains only whitespace, THE Admin API SHALL reject the request with HTTP status 400
3. WHEN an administrator attempts to create or update a product with status set to "published" AND seo_title is NULL or contains only whitespace, THE Admin API SHALL return an error message stating "seo_title is required for published products"
4. WHEN an administrator attempts to create or update a product with status set to "published" AND seo_description is NULL or contains only whitespace, THE Admin API SHALL return an error message stating "seo_description is required for published products"
5. WHEN an administrator creates or updates a product with status NOT equal to "published", THE Admin API SHALL accept NULL values for seo_title and seo_description

### Requirement 4

**User Story:** As a store administrator, I want to manage SEO fields through the Admin UI product forms, so that I can easily add and edit SEO content without using API calls directly.

#### Acceptance Criteria

1. WHEN an administrator opens the Create Product form in the Admin UI, THE Admin UI SHALL display an input field labeled "Meta Title" bound to seo_title
2. WHEN an administrator opens the Create Product form in the Admin UI, THE Admin UI SHALL display a textarea field labeled "Meta Description" bound to seo_description
3. WHEN an administrator opens the Create Product form in the Admin UI, THE Admin UI SHALL display a textarea field labeled "Short Description" bound to short_description
4. WHEN an administrator opens the Edit Product form in the Admin UI, THE Admin UI SHALL display the current values of seo_title, seo_description, and short_description
5. WHEN an administrator saves a product in the Admin UI, THE Admin UI SHALL send the values of seo_title, seo_description, and short_description to the Admin API
6. WHEN an administrator types in the Meta Description field, THE Admin UI SHALL display a character counter showing the current length
7. WHEN an administrator attempts to publish a product without seo_title or seo_description, THE Admin UI SHALL display the validation error message returned by the Admin API

### Requirement 5

**User Story:** As a developer, I want the database migration to be reversible, so that I can safely rollback changes if issues occur in production.

#### Acceptance Criteria

1. THE Migration System SHALL provide an up migration that adds seo_title, seo_description, and short_description columns to the product table
2. THE Migration System SHALL provide a down migration that removes seo_title, seo_description, and short_description columns from the product table using DROP COLUMN IF EXISTS
3. WHEN the down migration is executed, THE Migration System SHALL complete successfully even if the columns do not exist
4. THE Migration file SHALL follow the naming convention YYYYMMDDHHMM_add_seo_fields_to_product.sql
5. THE Migration file SHALL be placed in the standard migrations directory for MedusaJS v2 projects

### Requirement 6

**User Story:** As a frontend developer, I want SEO fields to be available in the Storefront API responses, so that I can use them to populate meta tags and product descriptions on the customer-facing website.

#### Acceptance Criteria

1. WHEN the Storefront requests product data, THE Store API SHALL include seo_title in the product response
2. WHEN the Storefront requests product data, THE Store API SHALL include seo_description in the product response
3. WHEN the Storefront requests product data, THE Store API SHALL include short_description in the product response
4. WHERE seo_title is NULL, THE Storefront SHALL use the product title as a fallback for the page title
5. WHERE seo_description is NULL, THE Storefront SHALL use the product subtitle or empty string as a fallback for the meta description
