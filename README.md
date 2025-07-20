<<<<<<< HEAD
# Invoice_API
=======
## INVOICE SYSTEM API

## BASE ROUTE - api/products/

## Dependencies
1. Express
2. Mongoose
3. Nodemon

## NOTE
- Make sure your MongoDB service runs at `localhost:27017`.
- The server will start running on `http://localhost:8000`.
- Start the server  : 
```bash
npm start
```

### Products
Dummy Products <br>

#### Get All Products
- **GET** `/api/products`
- **Description**: Retrieve all available products
- **Response**: List of products with their IDs, names, and details
- **Usage**: Copy the product ID to add items to cart

#### Add Product to Cart
- **POST** `/api/products/cart/:id`
- **Description**: Add a product to the shopping cart
- **Parameters**: 
  - `id` (path parameter): Product ID
- **Body**:
  ```json
  {
    "name": "Customer Name",
    "contact": "customer@email.com",
    "quantity": 2
  }
  ```

#### View Cart
- **GET** `/api/products/cart`
- **Description**: View items in the shopping cart
- **Query Parameters**:
  - `contact`: Customer's contact information to retrieve their cart
- **Response**: Cart details including Cart-ID for checkout

#### Clear Cart
- **DELETE** `/api/products/cart/:id`
- **Description**: Remove all items from the cart
- **Parameters**:
  - `id` (path parameter): Cart ID

### Checkout

#### Process Checkout
- **POST** `/api/checkout/:id`
- **Description**: Complete the checkout process
- **Parameters**:
  - `id` (path parameter): Cart ID (obtained from viewing cart)
- **Body**:
  ```json
  {
    "amount": 150.00
  }
  ```

## Usage Example

1. **View Products**: `GET /api/products`
2. **Add to Cart**: `POST /api/products/cart/123` with customer details
3. **View Cart**: `GET /api/products/cart?contact=customer@email.com`
4. **Checkout**: `POST /api/checkout/cart-id-here` with payment amount

## Project Structure

```
src/
├── app.js              # Main application entry point
├── Models/             # Database models
│   ├── billing.js
│   ├── cart.js
│   ├── customer.js
│   └── products.js
└── Routes/             # API route handlers
    ├── checkout.js
    └── products.js
```
>>>>>>> 521a9dc (Initial Commit)
