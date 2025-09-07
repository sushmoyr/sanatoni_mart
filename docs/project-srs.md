# **Software Requirements Specification (SRS)**

## 1. **Introduction**

Sanatoni Mart is an e-commerce platform that specializes in selling religious products for Hinduism. This platform will enable users to purchase items such as deity portraits, prayer beads, holy scriptures, and more. The website will be designed for easy navigation and a seamless shopping experience, supporting features such as product management, order management, customer management, and customizations.

### 1.1 **Scope**

Sanatoni Mart will offer a user-friendly interface for browsing products, managing orders, tracking shipments, and handling customer profiles. The site will be fully responsive and support both English and Bengali languages.

### 1.2 **Overview**

This SRS outlines the functionality and design of the Sanatoni Mart e-commerce platform. The features include:

* Product Management
* Order Management
* Customer Management
* Inventory Management
* Shipping Management
* Promotions and Discounts
* Content Customization and SEO features
* Authentication and Role-based Access Control
* Multi-language Support
* Responsive Design

## 2. **Functional Requirements**

### 2.1 **Category and Subcategory Management**

* The website will support categories and subcategories for products (e.g., **Beads**, **Deity Portraits**, **Holy Scriptures**).
* Admin will have the ability to create, edit, or delete categories and subcategories.

### 2.2 **Product Management**

* Products will be listed with detailed descriptions, specifications (size, color), and multiple images (main image + gallery images).
* Admin will be able to manage stock, set the product quantity (in pieces or by weight), and define product specifications.
* Admin will also have the option to make a product have **unlimited stock** (e.g., flowers).

### 2.3 **Order Management**

* Admin can view all orders, including customer details, order status, and payment method.
* Customers can track their orders post-purchase, view invoices, and download order details.
* Admin can update order status (processing, shipped, delivered).

### 2.4 **Customer Management**

* Admin can view and manage customer profiles, including name, email, shipping addresses, and order history.
* Customers can manage their profile information, including uploading a profile picture, adding multiple shipping addresses, and updating personal information.

### 2.5 **Inventory Management**

* Admin will receive low-stock and out-of-stock alerts on the dashboard.
* Products marked as **unlimited stock** will not require any stock tracking.

### 2.6 **Payment and Checkout**

* The website will only support **Cash on Delivery (COD)** as the payment method.
* The checkout process will support guest checkout as well as customer account checkout.

### 2.7 **Shipping Management**

* Shipping charges will be zone-based:

  * **Inside Dhaka**: 60
  * **Outside Dhaka**: 120
* Admin can manage shipping zones and apply different charges based on location.

### 2.8 **Promotions and Discounts**

* **Flash Sales**: Time-bound sales with percentage discounts on selected products.
* **Special Offers**: Campaign-based sales such as "Summer Sale" or "Winter Sale" for specific product categories.
* **Coupons**: Product-specific coupons that may have fixed or unlimited usage and duration.

### 2.9 **Product Wishlist**

* Customers can add products to their personal wishlist.
* Admin can view the total number of users who have wishlisted a product.

### 2.10 **Customizable Pages**

* **Home Page**: Fully customizable with configurable sections like sliders, banners, featured products, flash sales, etc.
* **About Page**, **Terms & Conditions**, **Privacy Policy**: These pages can be customized by the admin.
* **Footer**: Customizable with links and icons for social media and other sections.

### 2.11 **Authentication Management**

* **Login & Registration**: Simple login and registration using email and password.
* **Password Reset & Update**: Users can reset and update their passwords.
* **Role-Based Access**: Admin, Manager, and Salesperson roles with permissions to manage different parts of the site (content, orders, customer data).

### 2.12 **Content Management and SEO**

* **WYSIWYG Editor**: The admin will have a highly-featured editor to create customizable content.
* **SEO Customization**: Ability to set custom title tags, meta descriptions, and keywords for product pages and blog posts.

### 2.13 **Blog Management**

* Admin will manage blog posts, tags, and SEO.
* Blogs can include media (images, videos), and titles/content can be in both English and Bengali.

### 2.14 **Multi-language Support**

* The website will support both **English** and **Bengali** languages.
* Product titles, descriptions, blog posts, and other content will be available in both languages.

### 2.15 **Responsive Design**

* The website will be fully responsive, ensuring a seamless experience across desktops, tablets, and smartphones.

### 2.16 **Newsletter management**

* the website will support a complete newsletter management, including managing newsletter subscriptions, sending newsletter emails etc. the users can subscribe and unsubscibe from newsletter both from email or website. a mail verification is needed during unsubscribing from the site.

## 3. **Non-Functional Requirements**

### 3.1 **Performance**

* The website must handle high traffic efficiently, especially during sales or promotional events.

### 3.2 **Security**

* All sensitive data (passwords, user information) will be encrypted.
* HTTPS will be implemented across the website to ensure secure transactions.

### 3.3 **Scalability**

* The platform should be scalable to handle an increasing number of products, customers, and orders.

### 3.4 **Backup and Recovery**

* Regular backups of product data, customer data, and orders must be implemented.
* Recovery processes should be in place to restore data in case of failure.

## 4. **User Interface Design**

### 4.1 **Color Scheme**

The website will use the following **Tailwind CSS** color configuration:

* **Neutral Colors**: For text and background color, e.g., `neutral.500` for text and `neutral.50` for backgrounds.
* **Brand Colors**: For primary buttons and accents, e.g., `brand.500` for the main CTA button.
* **Accent Colors**: For secondary buttons and links, e.g., `accent.500` for hover states.
* **Success & Danger Colors**: For success and error messages, e.g., `success.500` for delivered orders, `danger.500` for error notifications.

### 4.2 **Navigation**

* The site will have a clear, intuitive navigation bar with categories and subcategories.
* The mobile design will include a collapsible navigation menu for easier access on smaller screens.

### 4.3 **Product Display**

* Products will be displayed in a grid layout with filters for category, price, and other specifications.
* The product detail page will display the main image, gallery images, specifications, and a detailed description.

### 4.4 **Customer Profile**

* Customers can manage their profile from a dedicated section where they can update personal details and manage shipping addresses.

## 5. **System Architecture**

### 5.1 **Technology Stack**

* **Frontend**: React.js with Tailwind CSS for styling.
* **Backend**: Node.js with Express for API development.
* **Database**: MongoDB or MySQL for storing product, order, and customer data.
* **Authentication**: JWT-based authentication for secure login.

### 5.2 **Admin Panel**

* The Admin panel will allow role management (Admin, Manager, Salesperson) and provide an interface for managing products, orders, customers, and content.

### 5.3 **Localization**

* Support for English and Bengali language for content translation.

---

