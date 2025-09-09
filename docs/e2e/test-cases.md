This document outlines all possible scenarios that a customer or an admin might face. The scenarios must be passed to mark the project as success. During the scenario testing, each scenario must validate the following:

- The functionalities are working as expected
- The frontend page designs follows the ui design system of the project.
- The Design is responsive and all the elements are visible in all different screen sizes.
- Proper error handling is in place and proper error message is shown with toast.
- proper validation and guards are placed.

# SPECIAL INSTRUCTIONS - MUST FOLLOW
1. All the scenarios must be tested using the playwright mcp server and tools.
2. All tests must start with the base path and must use the site navigation to browse specific features. Customer tests will start from `/` route and admin panel tests must start from `/admin` base route.
3. Never type a URL to navigate. Must start from base path stated in the above. for example: if testing the order feature, do not directly navigate to `/admin/orders`, instead start from the base admin route `/admin`, then click the order menu/navigation button to navigate to the `/admin/orders` page.

# Test Scenarios

## 🌐 Public User Experience

### 1. Site Navigation & Basic Access
**Status:** Pending  
**Story:** Users can navigate to the site using the site's address and the site will load correctly with proper language switching functionality.
- Visit homepage and verify site loads properly
- Test language switching between English and Bengali
- Verify responsive design across mobile, tablet, and desktop
- Check navigation menu and footer links functionality
- Validate proper meta tags and SEO implementation

### 2. Product Browsing & Catalog
**Status:** Pending  
**Story:** Users can browse the products in the site, view product catalogue, apply search and filters to find the product that they need.
- Browse product catalog without authentication
- Use search functionality with various keywords
- Apply category and price filters
- Sort products by price, name, and popularity
- View product details including images, descriptions, and specifications
- Navigate between product categories and subcategories
- Test pagination on product listing pages
- Verify product availability and stock status display

### 3. Multi-language Content
**Status:** Pending  
**Story:** Users can switch between English and Bengali languages and see content properly translated throughout the site.
- Switch language from header language selector
- Verify product names, descriptions display in selected language
- Check navigation menu translations
- Verify category names in selected language
- Test form labels and validation messages in both languages
- Confirm currency and number formatting for Bengali locale

### 4. Newsletter Subscription (Public)
**Status:** Pending  
**Story:** Visitors can subscribe to newsletters and manage their subscription preferences.
- Subscribe to newsletter from footer or dedicated page
- Verify email confirmation process
- Test double opt-in verification
- Unsubscribe using email link
- Re-subscribe after unsubscribing
- Test invalid email address handling

### 5. Blog & Content Pages
**Status:** Pending  
**Story:** Users can read blog posts and access custom CMS pages with proper SEO optimization.
- Browse blog post listings
- Read individual blog posts with full content
- Navigate blog categories and tags
- Test blog search functionality
- Access custom CMS pages (About, Contact, etc.)
- Verify SEO meta tags and social media integration
- Test content responsive display across devices

## 🔐 User Authentication & Account Management

### 6. User Registration
**Status:** Pending  
**Story:** New users can create accounts with proper validation and email verification.
- Register with valid email and strong password
- Test password confirmation validation
- Verify email verification process
- Test duplicate email registration prevention
- Validate required field enforcement
- Test registration with invalid email formats
- Verify redirect to dashboard after successful registration

### 7. User Login & Logout
**Status:** Pending  
**Story:** Users can securely login and logout with proper session management.
- Login with valid credentials
- Test "Remember me" functionality
- Login with invalid credentials (wrong password/email)
- Test account lockout after multiple failed attempts
- Logout and verify session termination
- Test automatic logout after extended inactivity
- Verify proper redirects based on user roles

### 8. Password Management
**Status:** Pending  
**Story:** Users can reset forgotten passwords and update existing passwords securely.
- Request password reset with valid email
- Complete password reset using email link
- Test password reset with invalid/expired tokens
- Update password from profile settings
- Verify old password requirement for password change
- Test password strength validation
- Confirm password change email notifications

### 9. Profile Management
**Status:** Pending  
**Story:** Users can manage their personal information and account settings.
- Update profile information (name, email, phone)
- Add and manage multiple addresses
- Set default billing and shipping addresses
- Update language preferences
- Delete account with proper confirmation
- Test profile picture upload (if implemented)
- Verify email verification after email change

## 🛒 Shopping Experience

### 10. Shopping Cart Management
**Status:** Pending  
**Story:** Users can add products to cart, modify quantities, and manage cart contents effectively.
- Add products to cart from product pages
- Update product quantities in cart
- Remove products from cart
- Apply coupon codes and see discounts
- View cart total calculations including taxes
- Test cart persistence across sessions
- Handle out-of-stock products in cart
- Test cart with maximum quantity limits

### 11. Wishlist Functionality
**Status:** Pending  
**Story:** Authenticated users can save products to wishlist for future purchase consideration.
- Add products to wishlist from product pages
- View wishlist with all saved products
- Remove products from wishlist
- Move products from wishlist to cart
- Share wishlist (if implemented)
- Test wishlist pagination for large lists
- Verify wishlist persistence across sessions

### 12. Checkout Process
**Status:** Pending  
**Story:** Users can complete purchases using the checkout system with address management and COD payment.
- Proceed to checkout from cart
- Select shipping address or add new address
- Choose Cash on Delivery (COD) payment method
- Review order summary before confirmation
- Complete order placement successfully
- Verify order confirmation email
- Test checkout with invalid address data
- Handle checkout with out-of-stock products

### 13. Order Management
**Status:** Pending  
**Story:** Users can view their order history, track order status, and manage their orders.
- View order history in customer dashboard
- Check individual order details
- Track order status updates
- Download order invoices (PDF)
- Cancel orders (if within allowed timeframe)
- Request order modifications
- Verify order notification emails
- Test order search and filtering

## 🔧 Admin Panel - User Management

### 14. Admin Authentication & Dashboard
**Status:** Pending  
**Story:** Administrators can access admin panel with role-based permissions and view comprehensive dashboard.
- Login to admin panel with admin credentials
- Access admin dashboard with statistics
- Test role-based access control (Admin, Manager, Salesperson)
- Verify proper navigation and menu structure
- Test admin logout and session management
- Check responsive design of admin interface
- Validate admin-only features restriction

### 15. User Management (Admin)
**Status:** Pending  
**Story:** Administrators can manage user accounts, roles, and permissions effectively.
- View user list with search and filtering
- Create new user accounts
- Edit existing user information
- Assign and modify user roles
- Activate/deactivate user accounts
- Delete user accounts with proper confirmation
- Export user data
- Test bulk user operations

### 16. Role & Permission Management
**Status:** Pending  
**Story:** Administrators can manage system roles and permissions for proper access control.
- Create and edit user roles
- Assign permissions to roles
- Test permission inheritance
- Verify role-based dashboard access
- Test middleware protection for different routes
- Validate admin, manager, and salesperson access levels
- Test role modification effects on logged-in users

## 📦 Admin Panel - Product Management

### 17. Product CRUD Operations
**Status:** Pending  
**Story:** Administrators can create, read, update, and delete products with full product information management.
- Create new products with all details
- Upload and manage product images
- Set product pricing and inventory
- Edit existing product information
- Delete products with confirmation
- Bulk product operations
- Test product image management
- Validate required field enforcement

### 18. Category Management
**Status:** Pending  
**Story:** Administrators can manage product categories and subcategories with proper hierarchy.
- Create new categories and subcategories
- Edit category information
- Reorder categories using drag-and-drop
- Delete categories with products handling
- Test category hierarchy management
- Verify category SEO settings
- Test category image uploads
- Validate category-product relationships

### 19. Inventory Management
**Status:** Pending  
**Story:** Administrators can track and manage product inventory with stock alerts and low stock notifications.
- Update product stock quantities
- Set low stock alert thresholds
- View inventory reports
- Track stock movement history
- Handle out-of-stock products
- Test automated stock deduction on orders
- Configure stock alert notifications
- Manage product variants inventory

## 📋 Admin Panel - Order Management

### 20. Order Processing & Management
**Status:** Pending  
**Story:** Administrators can view, process, and manage customer orders through their complete lifecycle.
- View order list with search and filtering
- Process individual orders
- Update order status (processing, shipped, delivered, etc.)
- Generate and view order invoices
- Print shipping labels
- Handle order cancellations
- Process refunds and returns
- Export order data for analysis

### 21. Invoice & Document Management
**Status:** Pending  
**Story:** Administrators can generate, customize, and manage order-related documents.
- Generate PDF invoices for orders
- Customize invoice templates
- Email invoices to customers
- Print invoices and shipping documents
- Track document generation history
- Test multi-language invoice generation
- Verify invoice calculations and taxes
- Manage invoice numbering system

## 💰 Admin Panel - Promotions & Marketing

### 22. Coupon & Discount Management
**Status:** Pending  
**Story:** Administrators can create and manage promotional coupons with various discount types and conditions.
- Create percentage-based discount coupons
- Create fixed amount discount coupons
- Set coupon usage limits and expiry dates
- Apply coupons to specific products or categories
- Test coupon validation on checkout
- Deactivate and delete coupons
- View coupon usage analytics
- Test coupon code generation

### 23. Flash Sales Management
**Status:** Pending  
**Story:** Administrators can create and manage time-limited flash sales with automatic pricing.
- Create flash sales with time constraints
- Set flash sale discounts for products
- Schedule future flash sales
- Monitor active flash sales
- End flash sales early if needed
- View flash sale performance analytics
- Test automatic price updates during sales
- Handle flash sale notifications

### 24. Newsletter Management System
**Status:** Pending  
**Story:** Administrators can create, send, and manage email newsletters with subscriber management.
- Create newsletter campaigns with WYSIWYG editor
- Manage subscriber lists and segmentation
- Schedule newsletter delivery
- Send newsletters immediately or schedule for later
- Track newsletter open rates and click-through rates
- Manage newsletter templates
- Handle subscriber unsubscribes
- View newsletter analytics and performance

### 25. Subscriber Management
**Status:** Pending  
**Story:** Administrators can manage newsletter subscribers and their preferences.
- View subscriber list with search functionality
- Import/export subscriber lists
- Manage subscriber segmentation
- Handle subscription confirmations
- Process unsubscribe requests
- View subscriber growth analytics
- Manage subscriber preferences
- Handle bounce management

## 📝 Admin Panel - Content Management

### 26. CMS Page Management
**Status:** Pending  
**Story:** Administrators can create and manage custom pages using the page builder with SEO optimization.
- Create new pages using page builder
- Use drag-and-drop page sections
- Edit page content with WYSIWYG editor
- Configure page SEO settings
- Publish and unpublish pages
- Preview pages before publishing
- Manage page URL structure
- Test responsive page layouts

### 27. Blog Management System
**Status:** Pending  
**Story:** Administrators can create and manage blog posts with categories, tags, and SEO features.
- Create new blog posts with rich content editor
- Manage blog categories and tags
- Upload and manage blog featured images
- Schedule blog post publishing
- Configure blog post SEO settings
- Manage blog post comments (if enabled)
- Test blog post preview functionality
- Handle blog post archiving

### 28. Media Library Management
**Status:** Pending  
**Story:** Administrators can upload, organize, and manage media files with proper file handling.
- Upload single and multiple files
- Organize files in folders/categories
- Search and filter media files
- Edit file information and alt tags
- Delete files with usage checking
- Bulk file operations
- Test file type restrictions
- Manage file thumbnails and optimization

### 29. SEO Management & Optimization
**Status:** Pending  
**Story:** Administrators can manage and optimize SEO settings across the entire website.
- Configure global SEO settings
- Manage meta tags for pages and products
- Generate and manage XML sitemaps
- Monitor SEO scores and recommendations
- Configure Open Graph and Twitter Cards
- Manage structured data/schema markup
- Test SEO audit functionality
- Handle 404 pages and redirects

## ⚡ Edge Cases & Error Handling

### 30. Session & Security Testing
**Status:** Pending  
**Story:** The system properly handles security scenarios and maintains data integrity.
- Test session timeout and re-authentication
- Verify CSRF protection on forms
- Test SQL injection prevention
- Check XSS protection
- Validate file upload security
- Test rate limiting on API endpoints
- Verify proper error logging
- Test concurrent user sessions

### 31. Performance & Load Testing
**Status:** Pending  
**Story:** The system performs well under various load conditions and handles errors gracefully.
- Test page load times across different sections
- Handle large product catalogs efficiently
- Test search performance with large datasets
- Verify image loading and optimization
- Test concurrent checkout processes
- Handle high traffic scenarios
- Test database query optimization
- Verify cache effectiveness

### 32. Data Validation & Error Handling
**Status:** Pending  
**Story:** The system properly validates input data and provides meaningful error messages.
- Test form validation with invalid data
- Handle file upload errors and size limits
- Test email format validation
- Verify numeric field validation
- Handle special characters in input fields
- Test required field validation
- Verify proper error message display
- Test toast notification system

### 33. Browser Compatibility & Responsive Design
**Status:** Pending  
**Story:** The system works correctly across different browsers and devices with responsive design.
- Test on Chrome, Firefox, Safari, and Edge
- Verify mobile responsiveness on various screen sizes
- Test touch interactions on mobile devices
- Verify tablet layout and functionality
- Test print styles for invoices and reports
- Check accessibility compliance
- Test keyboard navigation
- Verify screen reader compatibility

### 34. Backup & Recovery Scenarios
**Status:** Pending  
**Story:** The system can handle data recovery and maintains data integrity during failures.
- Test data backup procedures
- Verify database recovery processes
- Handle file corruption scenarios
- Test system recovery after crashes
- Verify data consistency after failures
- Test rollback procedures
- Handle partial data loss scenarios
- Verify audit trail maintenance

### 35. Integration & Third-party Services
**Status:** Pending  
**Story:** The system properly integrates with external services and handles service failures.
- Test email service integration
- Handle email delivery failures
- Test file storage service integration
- Verify API rate limiting handling
- Test service timeout scenarios
- Handle external service unavailability
- Test webhook implementations
- Verify API authentication

## 🔄 Workflow Integration Testing

### 36. Complete Customer Journey
**Status:** Pending  
**Story:** Test the complete customer experience from discovery to post-purchase.
- Browse products as guest user
- Register for account during checkout
- Complete first purchase with COD
- Receive order confirmation emails
- Track order status updates
- Leave product reviews (if implemented)
- Subscribe to newsletter
- Complete repeat purchase as returning customer

### 37. Complete Admin Workflow
**Status:** Pending  
**Story:** Test the complete administrative workflow for order processing and content management.
- Process incoming orders from customer
- Update inventory after order fulfillment
- Generate and send invoices
- Update order status to shipped/delivered
- Handle customer service inquiries
- Create promotional campaigns
- Publish blog content and newsletters
- Monitor analytics and reports

### 38. Multi-language Workflow
**Status:** Pending  
**Story:** Test complete workflows in both English and Bengali to ensure proper localization.
- Complete customer registration in Bengali
- Browse and purchase products in Bengali interface
- Receive emails in appropriate language
- Test admin panel operations in Bengali
- Verify content management in multiple languages
- Test newsletter campaigns in both languages
- Validate error messages in both languages
- Check currency and date formatting

### 39. Role-based Access Validation
**Status:** Pending  
**Story:** Verify that different user roles have appropriate access levels and restrictions.
- Test admin access to all features
- Verify manager limitations and permissions
- Test salesperson restricted access
- Validate customer-only features
- Test role switching effects
- Verify unauthorized access prevention
- Test permission inheritance
- Validate feature-based access control

### 40. Data Consistency & Integrity
**Status:** Pending  
**Story:** Ensure data remains consistent across all operations and user interactions.
- Test concurrent order processing
- Verify inventory consistency during high traffic
- Test data consistency after user role changes
- Validate product data integrity during bulk operations
- Test order data consistency across different views
- Verify user data consistency during profile updates
- Test category hierarchy consistency
- Validate reporting data accuracy 