import { useState, useEffect } from "react";

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

export default function ShoppingCart() {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    setSubtotal(total);

    if (total >= THRESHOLD) {
      const hasGift = cart.some((item) => item.id === FREE_GIFT.id);
      if (!hasGift) {
        setCart((prevCart) => [...prevCart, { ...FREE_GIFT, quantity: 1 }]);
      }
    } else {
      setCart((prevCart) => prevCart.filter((item) => item.id !== FREE_GIFT.id));
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      let found = false;
      const newCart = prevCart.map((item) => {
        if (item.id === product.id) {
          found = true;
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      return found ? newCart : [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, change) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            return { ...item, quantity: Math.max(1, item.quantity + change) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6">Shopping Cart</h2>
      <h3 className="text-xl font-semibold mb-4">Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-lg font-medium">{product.name}</p>
            <p className="text-gray-600">₹{product.price}</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mt-6">Cart Summary</h3>
      <div className="bg-white p-4 rounded-lg shadow-md mt-2">
        <p className="text-lg font-medium">Subtotal: ₹{subtotal}</p>
        {subtotal < THRESHOLD ? (
          <p className="text-gray-600 mt-2 p-2 bg-gray-200 rounded">
            Add ₹{THRESHOLD - subtotal} more to get a FREE Wireless Mouse!
          </p>
        ) : (
          <p className="text-green-600 mt-2 font-medium">You got a free Wireless Mouse!</p>
        )}
      </div>

      {cart.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mt-6">Cart Items</h3>
          <div className="mt-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-2">
                <p className="text-lg font-medium">
                  {item.name} ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                </p>
                {item.id !== FREE_GIFT.id ? (
                  <div>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded mr-2 hover:bg-red-600"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 bg-gray-200 rounded">{item.quantity}</span>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded ml-2 hover:bg-green-600"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="bg-green-200 text-green-600 px-3 py-1 rounded">FREE GIFT</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
