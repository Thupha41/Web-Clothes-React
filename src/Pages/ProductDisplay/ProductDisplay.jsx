import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { IoMdStar } from "react-icons/io";
import { ShopContext } from "../../context/ShopContext";
import ReactImageZoom from "react-image-zoom";
import "./ProductDisplay.css";
import formatNumber from "../../utils/formatCurrency";
import { addRecentlyViewedProduct } from "../../utils/recentlyViewed";
import ToastNotification from "../../components/Popup/ToastNotification/ToastNotification";

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart, cartItems } = useContext(ShopContext);
  const thumbnails = product.sku_image.map((url) => url.trim());
  const [mainImage, setMainImage] = useState(thumbnails[0]);
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState("");

  useEffect(() => {
    addRecentlyViewedProduct(product);
    if (!thumbnails.includes(mainImage)) {
      setMainImage(thumbnails[0]);
    }
  }, [product, thumbnails, mainImage]);

  const zoomConfig = {
    width: 400,
    height: 500,
    zoomWidth: 500,
    scale: 0.5,
    img: mainImage,
    zoomStyle: "border: 1px solid #ccc; border-radius: 10px;",
    zoomLensStyle: "opacity: 0.4; background-color: white;",
  };

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  const handleThumbnailClick = (url) => {
    setMainImage(url);
  };

  const productInCart = cartItems[product.id] || 0;
  const currentProduct = product.sku_id;
  const isOutOfStock = currentProduct && productInCart >= product.sku_quantity;
  console.log(product.sku_quantity);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleAddToCart = () => {
    const accessToken = localStorage.getItem("auth-token");
    if (!accessToken) {
      ToastNotification("Login before continuing", "warn");
    } else {
      ToastNotification("Add to cart successfully", "success");
      addToCart(product.sku_id, quantity);
    }
  };

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    // Logic to handle out-of-stock notifications
    ToastNotification(
      "You will be notified when the product is back in stock",
      "success"
    );
  };

  return (
    <div
      data-aos="fade-up"
      className="flex flex-col lg:flex-row mt-10 ml-0 lg:ml-[170px] mb-10 px-4"
    >
      <div className="flex flex-col lg:flex-row gap-4 mb-4 lg:mb-0">
        {/* Thumbnails */}
        <div className="hidden sm:flex flex-col gap-4">
          {thumbnails.map((url, index) => (
            <img
              key={index}
              className={`h-[100px] sm:h-[120px] object-cover cursor-pointer ${
                url === mainImage ? "selected-thumbnail" : ""
              }`}
              src={url}
              alt=""
              onClick={() => handleThumbnailClick(url)}
            />
          ))}
        </div>
        {/* Main image */}
        <div className="main-product-image">
          <div>
            <ReactImageZoom {...zoomConfig} />
          </div>
        </div>
      </div>

      {/* Product information */}
      <div className="mt-4 lg:mt-0 lg:ml-10 flex flex-col w-full lg:w-auto">
        <h1 className="font-bold text-2xl lg:text-3xl mb-4">
          {product.Product.Brand.name}
        </h1>
        <h2 className="text-base lg:text-lg">SKU: {product.sku_no}</h2>
        <h2 className="font-semibold text-xl lg:text-2xl mt-4">
          {product.Product.product_name}
        </h2>

        {/* Ratings */}
        <div className="flex mt-2">
          {[...Array(5)].map((_, index) => (
            <IoMdStar key={index} className="text-yellow-500" />
          ))}
        </div>

        {/* Price */}
        <div className="flex mt-4">
          <div className="text-gray-500 line-through mr-2">
            {product.oldPrice}
          </div>
          <div className="text-red-500 text-xl lg:text-2xl font-bold">
            {formatNumber(product.Product.product_price)}{" "}
            <span lang="vi">đ</span>
          </div>
        </div>
        <div className="mt-4">Color: {product.sku_color}</div>
        <div className="mt-4">Size: {product.sku_size}</div>

        {/* Quantity input */}
        <div className="bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 my-10">
          <div className="w-full flex justify-between items-center gap-x-1">
            <div className="grow py-2 px-3">
              <span className="block text-xs text-gray-500 dark:text-neutral-400">
                Select quantity
              </span>
              <input
                className="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 dark:text-white"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
            <div className="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-neutral-700 dark:border-neutral-700">
              <button
                type="button"
                className="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                data-hs-input-number-decrement=""
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
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
              <button
                type="button"
                className="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                data-hs-input-number-increment=""
                onClick={() => setQuantity(quantity + 1)}
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
        </div>

        {/* ADD TO CART button */}
        <div className="flex flex-col justify-center mr-0 lg:mr-[75px] mt-2">
          {isOutOfStock ? (
            <>
              <button className="w-full sm:w-[300px] text-[18px] h-14 font-semibold text-gray-600 bg-gray-300 cursor-not-allowed">
                OUT OF STOCK
              </button>
              <form className="mt-8" onSubmit={handleNotifySubmit}>
                <p className="text-sm text-gray-600">
                  Notify me when available
                </p>
                <div className="flex mt-2">
                  <input
                    type="email"
                    className="p-2 border border-gray-300 rounded-md flex-grow"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Notify Me
                  </button>
                </div>
              </form>
            </>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-[300px] text-[16px] h-14 font-semibold text-white bg-black hover:bg-gray-800"
            >
              ADD TO CART
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ProductDisplay.propTypes = {
  product: PropTypes.shape({
    product_id: PropTypes.string,
    id: PropTypes.string,
    sku_color: PropTypes.string.isRequired,
    Product: PropTypes.objectOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    sku_image: PropTypes.string.isRequired,
    oldPrice: PropTypes.string.isRequired,
    current_unit_price: PropTypes.string.isRequired,
    Brand: PropTypes.string.isRequired,
    sku_no: PropTypes.string,
    sku_size: PropTypes.string,
    sku_id: PropTypes.string,
    sku_quantity: PropTypes.number,
  }).isRequired,
};

export default ProductDisplay;
