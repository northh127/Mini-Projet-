import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ProductDetail() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-4">
        {product.name}
      </h1>

      <p className="text-xl">
        ราคา ฿ {product.price}
      </p>

    </div>
  );
}

export default ProductDetail;