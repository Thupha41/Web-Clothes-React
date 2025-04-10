import React, { useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { ShopContext } from "../../context/ShopContext";

const QuantityUpdate = ({ id }) => {
  const { cartItems, setCartItems, cartId } = useContext(ShopContext);
  const currentItem = cartItems.find((item) => item.sku_id === id);
  const currentQuantity = currentItem?.quantity || 0;

  const updateCartItemQuantity = async (sku_id, quantity) => {
    // Optimistically update the state
    const updatedCartItems = cartItems.map((item) =>
      item.sku_id === sku_id ? { ...item, quantity } : item
    );
    setCartItems(updatedCartItems);

    try {
      const response = await axios.put(
        `https://api.yourrlove.com/v1/web/cart/update/${cartId}`,
        {
          sku_id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        }
      );

      if (response.data.statusCode !== 200) {
        setCartItems(cartItems);
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error);

      setCartItems(cartItems);
    }
  };

  const handleDecrease = () => {
    if (currentQuantity > 1) {
      updateCartItemQuantity(id, currentQuantity - 1);
    }
  };

  const handleIncrease = () => {
    updateCartItemQuantity(id, currentQuantity + 1);
  };

  return (
    <div>
      <div className="flex items-center gap-x-1.5">
        <button
          type="button"
          className="w-8 h-8 sm:w-10 sm:h-10 flex justify-center items-center border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
          onClick={handleDecrease}
          disabled={currentQuantity <= 1}
        >
          <svg
            className="flex-shrink-0 size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14"></path>
          </svg>
        </button>
        <p>{currentQuantity}</p>
        <button
          type="button"
          className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
          onClick={handleIncrease}
        >
          <svg
            className="flex-shrink-0 size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

QuantityUpdate.propTypes = {
  id: PropTypes.string.isRequired,
};

export default QuantityUpdate;
