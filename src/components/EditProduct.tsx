import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import React, { useState } from "react";
import {
  allCategoriesOption,
  editProductOption,
} from "../routes/shop/product_/$productId/edit";
const route = getRouteApi("/shop/product/$productId/edit");
import { ProductType } from "../types/ProductType";
import { Category } from "../types/ProductType";

function assertIsProductType(val: unknown): asserts val is ProductType {
  if ((val as ProductType)._id === undefined) {
    throw new Error("Not a product");
  }
}
function assertIsCategoryType(val: unknown): asserts val is Category[] {
  if (Array.isArray(val)) {
    if ((val as Category[])[0]._id === undefined) {
      throw new Error("Not a category");
    }
  }
}
function useProductCategories() {
  const {
    data: {
      data: { data: categories },
    },
  } = useSuspenseQuery(allCategoriesOption());
  return { categories };
}
function useProductData(productId: string) {
  const {
    data: {
      data: { data },
    },
  } = useSuspenseQuery(editProductOption(productId));
  return { data };
}

function EditProduct() {
  const { productId } = route.useParams();

  const { data } = useProductData(productId);
  const { categories: productCategories } = useProductCategories();
  assertIsProductType(data);
  assertIsCategoryType(productCategories);

  const [name, setName] = useState(data.name);
  const [brand, setBrand] = useState(data.brand);
  const [price, setPrice] = useState(data.price);
  const [retailPrice, setRetailPrice] = useState(data.retail_price);
  const [description, setDescription] = useState(data.description);
  const [quantity, setQuantity] = useState(data.quantity);
  const [totalBought, setTotalBought] = useState(data.total_bought);
  const [highlights, setHighlights] = useState(data.highlights);
  const [imageSrc, setImageSrc] = useState(data.image_src);
  const [tags, setTags] = useState(data.tags);
  const [newTag, setNewTag] = useState("");
  const [categories, setCategories] = useState(data.category);

  console.log(data);

  const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  const handleHighlightHeading = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const data = [...highlights];
    data[index].heading = e.target.value;
    setHighlights(data);
  };
  const handleHighlightOverview = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const data = [...highlights];
    data[index].overview = e.target.value;
    setHighlights(data);
  };
  const handleHighlightDelete = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
    index: number
  ) => {
    const data = [...highlights].filter((row, i) => i !== index);
    console.log("index to delete", index);
    setHighlights(data);
  };
  const handleHighlightNewRow = () => {
    const data = [...highlights];
    data.push({ heading: "", overview: "" });
    setHighlights(data);
  };

  const handleNewTag = () => {
    if (newTag === "") return;
    setTags([...tags, newTag]);
    setNewTag("");
  };
  function handleInitialCheckedCategory(id: string) {
    const productCategoryIds = categories.map((cat) => cat._id);
    if (productCategoryIds.includes(id)) {
      return true;
    }
    return false;
  }
  const handleCheckedCategory = (
    e: React.ChangeEvent<HTMLInputElement>,
    categoryId: string
  ) => {
    const [category] = productCategories.filter((d) => d._id === categoryId);
    const currentCategories = categories.map((d) => d._id);
    if (currentCategories.includes(category._id)) {
      //remove
      const newCategories = categories.filter((d) => d._id !== category._id);
      setCategories(newCategories);
    } else {
      //add
      setCategories([...categories, category]);
    }
  };
  const handleTags = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const data = [...tags];
    data[index] = e.target.value;
    setTags(data);
  };
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted form");
  };

  return (
    <div className="mx-2">
      {data && (
        <form
          className="border border-4 p-2 flex flex-col gap-3"
          onSubmit={handleFormSubmit}
        >
          <h1 className="font-bold text-lg text-center">
            Edit Product - {productId}
          </h1>
          <div className="input-field">
            <label htmlFor="name">Product Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              className="px-2 w-full border border-gray-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="brand">Product Brand:</label>
            <input
              type="text"
              name="brand"
              id="brand"
              className="px-2 w-full border border-gray-500"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="price">Price: $</label>
            <input
              type="number"
              className="px-2 w-full border border-gray-500"
              id="price"
              name="price"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              min={0}
              step={0.01}
            />
          </div>
          <div className="input-field">
            <label htmlFor="retail-price">Retail Price: $</label>
            <input
              type="number"
              className="px-2 w-full border border-gray-500"
              id="retail-price"
              name="retail-price"
              value={retailPrice}
              onChange={(e) => setRetailPrice(parseFloat(e.target.value) || 0)}
              min={0}
              step={0.01}
            />
          </div>
          <div className="input-field">
            <label htmlFor="description">Description:</label>
            <textarea
              name="description"
              id="description"
              className="px-2 w-full border border-gray-500"
              value={description}
              rows={8}
              onChange={handleDescription}
            ></textarea>
          </div>
          <div className="input-field">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              className="px-2 w-full border border-gray-500"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="total-bought">Total Units Sold:</label>
            <input
              type="number"
              className="px-2 w-full border border-gray-500"
              min={0}
              value={totalBought}
              onChange={(e) => setTotalBought(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="highlights">Quick Highlights</label>
            <table className="border border-2 border-collapse">
              <tbody>
                <tr className="border border-b-2">
                  <th className="border border-r-2">Heading</th>
                  <th className="border border-r-2">Overview</th>
                  <th></th>
                </tr>
                {highlights.length ? (
                  highlights.map((unit, i) => {
                    return (
                      <tr className="border border-b-2" key={i}>
                        <td className="border border-r-2 px-3">
                          <input
                            type="text"
                            value={unit?.heading}
                            className="border border-2 border-gray-400 px-1"
                            placeholder="eg. Color"
                            onChange={(e) => handleHighlightHeading(e, i)}
                          />
                        </td>
                        <td className="px-3 border border-r-2">
                          <input
                            type="text"
                            value={unit?.overview}
                            placeholder="eg. Green"
                            className="border border-2 border-gray-400 px-1"
                            onChange={(e) => handleHighlightOverview(e, i)}
                          />
                        </td>
                        <td>
                          <input
                            type="button"
                            value={"✕"}
                            className="border bg-red-400 border-black px-2 hover:cursor-pointer"
                            onClick={(e) => handleHighlightDelete(e, i)}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td>Nothing here.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <input
              type="button"
              value={"Add new Row"}
              className="border-blue-600 border-2 px-2 bg-blue-300 mt-2 hover:cursor-pointer"
              onClick={handleHighlightNewRow}
            />
          </div>
          <div className="input-field">
            <label htmlFor="image">Product Image URL:</label>
            <input
              type="url"
              className="px-2 w-full border border-gray-500"
              value={imageSrc}
              onChange={(e) => setImageSrc(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="tags-section">Product (search) Tags:</label>
            <div
              className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6"
              id="tags-section"
            >
              {tags.length ? (
                tags.map((tag, i) => {
                  return (
                    <div key={i} className="shadow-md flex">
                      <input
                        type="text"
                        onChange={(e) => handleTags(e, i)}
                        value={tag}
                        className="bg-slate-300 px-2 flex-1"
                      ></input>
                      <input
                        type="button"
                        value={"✕"}
                        className="px-2 bg-red-400 hover:cursor-pointer"
                        onClick={() =>
                          setTags(tags.filter((tag, index) => index !== i))
                        }
                      />
                    </div>
                  );
                })
              ) : (
                <p>No tags to display.</p>
              )}
            </div>
          </div>
          <div className="input-field">
            <label htmlFor="">Create a tag:</label>
            <input
              type="text"
              className="px-2 w-full border border-gray-500"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            {newTag.length > 0 ? (
              <input
                type="button"
                value={"Add"}
                className="bg-green-400 px-2 mt-1 hover:cursor-pointer"
                onClick={handleNewTag}
              />
            ) : (
              <input
                type="button"
                disabled={true}
                value={"Add"}
                className="bg-gray-300 px-2 mt-1 hover:cursor-not-allowed"
              />
            )}
          </div>
          <div className="input-field">
            <div>
              <h2 className="font-semibold">Category:</h2>
            </div>
            <div className="categorySelection grid grid-cols-2 lg:grid-cols-6">
              {productCategories.map((category, i) => (
                <div className="category flex gap-1 items-center" key={i}>
                  <input
                    type="checkbox"
                    id={category._id}
                    value={category.name}
                    checked={handleInitialCheckedCategory(category._id)}
                    onChange={(e) => handleCheckedCategory(e, category._id)}
                  />
                  <label htmlFor={category._id}>{category.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="btns flex justify-center items-center mt-7 gap-2">
            <input
              type="submit"
              className="border bg-green-300 rounded-sm px-2 hover:cursor-pointer"
              value={"Save changes"}
            />
            <input
              type="button"
              className="border rounded-sm px-2 bg-red-400 hover:cursor-pointer"
              value={"Cancel"}
            />
          </div>
          <hr className="mb-20" />
        </form>
      )}
    </div>
  );
}

export default EditProduct;
