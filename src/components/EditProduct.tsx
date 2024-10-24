import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { allCategoriesOption } from "../routes/shop/product_/$productId/edit";
import { singleProductQueryOption } from "../routes/shop/product/$productId";
import { PaginationResponse, ProductType } from "../types/ProductType";
import { CategoryType } from "../types/CategoryType";
import {
  Button,
  Cell,
  Collection,
  Column,
  FieldError,
  Form,
  Group,
  Input,
  Key,
  Label,
  ListBox,
  ListBoxItem,
  NumberField,
  ResizableTableContainer,
  Row,
  Selection,
  Table,
  TableBody,
  TableHeader,
  Tag,
  TagGroup,
  TagList,
  Text,
  TextArea,
  TextField,
} from "react-aria-components";
import { IconCheck, IconMinus, IconPlus, IconX } from "@tabler/icons-react";
import useAuth from "../hooks/useAuth";
import { queryClient } from "../App";
import { AxiosError, AxiosResponse } from "axios";
import fetch from "../utilities/fetch";

const route = getRouteApi("/shop/product/$productId/edit");
function useProductCategories() {
  const categoriesResponse = useSuspenseQuery(allCategoriesOption()).data.data;
  const categoriesData = categoriesResponse as PaginationResponse & {
    categories: CategoryType[];
  };
  return { categoriesData };
}
function useProductData(productId: string) {
  const productResponse = useSuspenseQuery(
    singleProductQueryOption(productId)
  ).data;
  const product = productResponse?.product as ProductType;
  return { product };
}

function EditProduct() {
  const { productId } = route.useParams();
  const { user } = useAuth();
  const { product } = useProductData(productId);
  const { categoriesData } = useProductCategories();

  const [name, setName] = useState(product.name);
  const [brand, setBrand] = useState(product.brand);
  const [price, setPrice] = useState(product.price);
  const [retailPrice, setRetailPrice] = useState(product.retail_price);
  const [description, setDescription] = useState(product.description);
  const [quantity, setQuantity] = useState(product.quantity);
  const [totalBought, setTotalBought] = useState(product.total_bought);
  const [highlights, setHighlights] = useState(product.highlights);
  const [newHighlightsHeading, setNewHighlightsHeading] = useState("");
  const [newHighlightsOverview, setNewHighlightsOverview] = useState("");
  const [imageSrc, setImageSrc] = useState(product.image_src);
  const [tags, setTags] = useState(product.tags);
  const [newTag, setNewTag] = useState("");
  const [formReadyToSubmit, setFormReadyToSubmit] = useState(false);
  const [categories, setCategories] = useState(product.category);
  const [selectedCategory, setSelectedCategory] = React.useState<Selection>(
    new Set(undefined)
  );
  const tagList = tags.map((str, i) => ({ id: i, label: str }));
  const [error, setError] = useState<{ [index: string]: string } | undefined>(
    undefined
  );
  const [globalError, setGlobalError] = useState<[{ msg: string }] | undefined>(
    undefined
  );

  const saveFormMutate = useMutation({
    mutationFn: () => {
      return fetch.put(
        `/api/product/${product._id}`,
        {
          name,
          brand,
          price,
          retail_price: retailPrice,
          description,
          highlights: JSON.stringify(highlights),
          quantity,
          total_bought: totalBought,
          category: categories.map((obj) => obj._id),
          tags,
          image_src: imageSrc,
        },
        { withCredentials: true }
      );
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["product"],
      });
      queryClient.invalidateQueries({
        queryKey: ["category"],
      });
      await navigate({
        to: "/shop/product/$productId",
        params: { productId: product._id },
        replace: true,
      });
    },
    onError: (error) => {
      console.log(error);
      const res = error as AxiosError;
      setFormReadyToSubmit(false);
      setGlobalError(res.response?.data?.errors || [{ msg: [res.message] }]);
      setTimeout(() => {
        window.scroll(0, 10000);
      }, 200);
    },
  });
  const navigate = useNavigate();

  const handleHighlightDelete = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
    index: number
  ) => {
    const data = [...highlights].filter((_, i) => i !== index);
    setHighlights(data);
  };
  const handleHighlightNewRow = () => {
    if (newHighlightsHeading === "" || newHighlightsOverview === "") return;
    const newHighlights = [
      ...highlights,
      { heading: newHighlightsHeading, overview: newHighlightsOverview },
    ];
    setHighlights(newHighlights);
  };

  const handleAddNewCategory = () => {
    const newCategories_Id = Array.from(selectedCategory);
    const newCategories: CategoryType[] = [];
    newCategories_Id.forEach((id) => {
      const foundCategory = categoriesData.categories.find(
        (obj) => obj._id === id
      );
      if (foundCategory) {
        newCategories.push(foundCategory);
      }
    });

    setSelectedCategory(new Set(undefined));
    setCategories([...categories, ...newCategories]);
  };
  const handleCategoryRemoval = (key: Set<Key>) => {
    if (categories.length <= 1) return;
    const [firstItem] = Array.from(key);
    setCategories(categories.filter((obj) => obj._id !== firstItem));
  };

  const handleTagRemoval = (key: Set<Key>) => {
    const [firstItem] = Array.from(key);
    const newtags = tagList.filter((obj) => obj.id !== firstItem);
    setTags(newtags.map((obj) => obj.label));
  };
  const handleNewTag = () => {
    if (newTag === "") return;
    setTags([...tags, newTag]);
    setNewTag("");
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormReadyToSubmit(true);
  };
  useEffect(() => {
    const userCache = queryClient.getQueryData(["auth"]) as AxiosResponse;
    if (!user && !userCache.data?.user?.is_admin) {
      navigate({ to: "/signin", search: { from: window.location.pathname } });
    }
  }, [user]);

  if (formReadyToSubmit) {
    window.scroll(0, 0);
    return (
      <div className="review-form flex-1 py-4 px-2 lg:px-4">
        <h2 className="font-bold text-xl p-2">Review Product Form</h2>
        <div className="dark:bg-a1sd p-2 rounded-lg flex flex-col gap-3">
          <div className="dark:bg-amenusd p-3">
            <p>
              <span>Review the changes below before submitting the form.</span>
            </p>
          </div>
          <div className="input-field">
            <dl>
              <dt className="font-bold">Product Name</dt>
              <dd className="ml-2">{name}</dd>
            </dl>
          </div>
          <div className="input-field">
            <dl>
              <dt className="font-bold">Product Categories</dt>
              <dd className="ml-2">
                <ul className="flex gap-2">
                  {categories.map((cat, i) => (
                    <li
                      key={i}
                      className="border dark:border-a3sd p-1 rounded-md"
                    >
                      {cat.name}
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
          </div>
          <div className="input-field">
            <dl>
              <dt className="font-bold">Product Image source</dt>
              <dd className="ml-2">{imageSrc}</dd>
            </dl>
          </div>
          <div className="input-field">
            <dl>
              <dt className="font-bold">Product Brand</dt>
              <dd className="ml-2">{brand}</dd>
            </dl>
          </div>
          <div className="input-field">
            <dl>
              <dt className="font-bold">Product Tags</dt>
              <dd className="ml-2">
                <ul className="flex gap-2">
                  {tags.map((tag, i) => (
                    <li
                      key={i}
                      className="border dark:border-a3sd p-1 rounded-md"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
          </div>
          <div className="input-field">
            <dl>
              <dt className="font-bold">Product Price</dt>
              <dd className="ml-2">${price.toFixed(2)}</dd>
            </dl>
          </div>
          <div className="input-field">
            <dl>
              <dt className="font-bold">Product Retail Price</dt>
              <dd className="ml-2">${retailPrice.toFixed(2)}</dd>
            </dl>
          </div>
          <div className="input-field">
            <dl>
              <dt className="font-bold">Product Description</dt>
              <dd className="ml-2 whitespace-pre-wrap">{description}</dd>
            </dl>
          </div>
          <div className="input-field">
            <dl>
              <dt className="font-bold">Product Highlights</dt>
              <dd className="ml-2">
                <ul>
                  {highlights.map((highlight, i) => {
                    return (
                      <li key={i}>
                        <p className="flex gap-4">
                          <span>{highlight.heading}:</span>
                          <span>{highlight.overview}</span>
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </dl>
          </div>
          <div className="input-field">
            <dl>
              <dt className="font-bold">Product Quantity</dt>
              <dd className="ml-2">{quantity}</dd>
            </dl>
          </div>
          <div className="input-field">
            <dl>
              <dt className="font-bold">Product Total bought</dt>
              <dd className="ml-2">{totalBought}</dd>
            </dl>
          </div>
          <div className="btns dark:bg-amenusd p-3 flex gap-4">
            <Button
              className={`border dark:border-a3sd p-2 rounded-sm`}
              onPress={() => setFormReadyToSubmit(false)}
            >
              Back to edit form
            </Button>
            <Button
              className={`dark:bg-blue-500 p-2 rounded-sm`}
              onPress={() => saveFormMutate.mutate()}
              isDisabled={saveFormMutate.isPending}
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <main className="flex-1 py-4 px-2 lg:px-4">
      <div className="content max-w-[600px] mx-auto">
        <h1 className="font-bold text-xl">Edit Product</h1>
        <p className="text-sm text-a1d">
          <span className="text-red-500">*</span> denotes required fields.
        </p>
        <div className="divider dark:bg-a3sd h-[1px] mt-2 mb-2"></div>
        <Form
          onSubmit={handleFormSubmit}
          className="mt-2 flex flex-col gap-4"
          validationErrors={error}
          onInvalid={() => console.log("invalid form")}
        >
          <TextField
            name="id"
            type="text"
            isReadOnly={true}
            value={productId}
            className={"flex flex-col gap-1"}
          >
            <Label>Product ID</Label>
            <Input className={"dark:bg-a1sd p-2 rounded-lg dark:text-a1d"} />
            <FieldError className={"text-red-500"} />
          </TextField>
          <TextField
            name="name"
            type="text"
            isRequired
            minLength={1}
            value={name}
            onChange={setName}
            className={"flex flex-col gap-1"}
          >
            <Label>
              <span className="text-red-500">*</span>Product Name
            </Label>
            <Input className={"dark:bg-a1sd dark:text-a0d p-2 rounded-lg"} />
            <FieldError className={"text-red-500"} />
          </TextField>
          <div>
            <TagGroup
              className="flex flex-col gap-1"
              onRemove={handleCategoryRemoval}
            >
              <Label>
                <span className="text-red-500">*</span>Product Categories
              </Label>
              <TagList
                className={"flex gap-2 flex-wrap"}
                items={categories}
                renderEmptyState={() => (
                  <p className="font-bold text-red-600">
                    This product has no category.
                  </p>
                )}
              >
                {(items) => (
                  <Tag
                    className={
                      "px-2 py-1 flex items-center justify-center outline dark:outline-a3sd"
                    }
                    textValue={items.name}
                    id={items._id}
                  >
                    {({ allowsRemoving }) => (
                      <>
                        <span>{items.name}</span>
                        {allowsRemoving && (
                          <Button slot="remove">
                            <IconX stroke={1} size={18} />
                          </Button>
                        )}
                      </>
                    )}
                  </Tag>
                )}
              </TagList>
              <Text slot="description" className="text-sm mt-1 dark:text-a1d">
                At least one category must be set.
              </Text>
            </TagGroup>
            <div className={"mt-3"}>
              <Label>Add new Category</Label>
              <div className="flex gap-3 items-center mt-1">
                <ListBox
                  aria-label="Category Options"
                  renderEmptyState={() => "No available categories found."}
                  selectionMode="multiple"
                  items={categoriesData.categories}
                  disabledKeys={categories.map((obj) => obj._id)}
                  selectedKeys={selectedCategory}
                  onSelectionChange={setSelectedCategory}
                  className={
                    "outline dark:outline-a3sd p-1 max-h-[10rem] overflow-y-scroll"
                  }
                >
                  {(items) => (
                    <ListBoxItem
                      key={items._id}
                      id={items._id}
                      textValue={items.name}
                    >
                      {({
                        isSelected,
                        isFocusVisible,
                        isHovered,
                        isDisabled,
                      }) => (
                        <>
                          <div
                            className={`flex px-2 py-1 justify-between items-center ${isSelected ? "dark:bg-a3sd" : isHovered || isFocusVisible ? "dark:bg-a2sd cursor-pointer" : isDisabled ? "dark:text-a2d" : ""}`}
                          >
                            <span>{items.name}</span>
                            {isSelected && (
                              <IconCheck stroke={1} size={18}></IconCheck>
                            )}
                          </div>
                        </>
                      )}
                    </ListBoxItem>
                  )}
                </ListBox>
                <Button
                  type="button"
                  className={({ isFocusVisible, isHovered, isPressed }) =>
                    `outline dark:outline-a3sd p-1 data-[disabled]:text-a2d rounded-lg ${isFocusVisible || isHovered || isPressed ? "dark:bg-a3sd" : ""}`
                  }
                  onPress={handleAddNewCategory}
                  isDisabled={Array.from(selectedCategory).length < 1}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          <TextField
            name="image_src"
            type="text"
            value={imageSrc}
            onChange={setImageSrc}
            className={"flex flex-col gap-1"}
          >
            <Label>Product Image</Label>
            <Input className={"dark:bg-a1sd dark:text-a0d p-2 rounded-lg"} />
            <FieldError className={"text-red-500"} />
          </TextField>
          <TextField
            name="brand"
            type="text"
            value={brand}
            isRequired={true}
            minLength={1}
            onChange={setBrand}
            className={"flex flex-col gap-1"}
          >
            <Label>
              <span className="text-red-500">*</span>Product Brand
            </Label>
            <Input className={"dark:bg-a1sd dark:text-a0d p-2 rounded-lg"} />
            <FieldError className={"text-red-500"} />
          </TextField>
          <div>
            <TagGroup
              className="flex flex-col gap-1"
              onRemove={handleTagRemoval}
            >
              <Label>Product Tags</Label>
              <TagList
                className={"flex gap-2 flex-wrap"}
                items={tagList}
                renderEmptyState={() => (
                  <p className="font-bold text-red-600">
                    This product has no tags.
                  </p>
                )}
              >
                {(items) => (
                  <Tag
                    className={
                      "px-2 py-1 flex items-center justify-center outline dark:outline-a3sd"
                    }
                    textValue={items.label}
                    id={items.id}
                  >
                    {({ allowsRemoving }) => (
                      <>
                        <span>{items.label}</span>
                        {allowsRemoving && (
                          <Button slot="remove">
                            <IconX stroke={1} size={18} />
                          </Button>
                        )}
                      </>
                    )}
                  </Tag>
                )}
              </TagList>
            </TagGroup>
            <TextField
              className={
                "mt-4 flex flex-col items-start gap-3 md:flex-row md:items-center"
              }
            >
              <Label>Add new tag</Label>
              <Input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleNewTag();
                  }
                }}
                className={"dark:bg-a1sd dark:text-a0d p-2 rounded-lg"}
              />
              <Button
                type="button"
                isDisabled={newTag.length <= 0}
                className={({
                  isFocusVisible,
                  isHovered,
                  isPressed,
                  isDisabled,
                }) =>
                  `outline dark:outline-a3sd p-1 rounded-lg ${isFocusVisible || isHovered || isPressed ? "dark:bg-a3sd" : isDisabled ? "dark:text-a2d" : ""}`
                }
                onPress={handleNewTag}
              >
                Send
              </Button>
            </TextField>
          </div>
          <div>
            <NumberField
              value={price}
              isRequired={true}
              onChange={setPrice}
              minValue={0.01}
              maxValue={10000}
              step={0.01}
              className={"flex flex-col gap-1"}
              formatOptions={{
                style: "currency",
                currency: "USD",
                currencyDisplay: "symbol",
                currencySign: "accounting",
              }}
            >
              <Label>
                <span className="text-red-500">*</span>Price
              </Label>
              <Group
                className={"flex outline dark:outline-a3sd w-max rounded-lg"}
              >
                <Button
                  slot="decrement"
                  className={({ isDisabled }) =>
                    `flex flex-col justify-center items-center aspect-square h-[30px] border-r dark:border-r-a3sd ${isDisabled ? "dark:text-a1d" : ""}`
                  }
                >
                  <IconMinus size={18} />
                </Button>
                <Input
                  className={({ isDisabled }) =>
                    `dark:bg-a1sd dark:text-a0d px-2`
                  }
                />
                <Button
                  slot="increment"
                  className={({ isDisabled }) =>
                    `flex flex-col justify-center items-center aspect-square h-[30px] border-l dark:border-l-a3sd ${isDisabled ? "dark:text-a1d" : ""}`
                  }
                >
                  <IconPlus size={18} />
                </Button>
              </Group>
              <FieldError className={"text-red-500"} />
            </NumberField>
          </div>
          <div>
            <NumberField
              value={retailPrice}
              onChange={setRetailPrice}
              minValue={0.01}
              maxValue={10000}
              isRequired={true}
              step={0.01}
              className={"flex flex-col gap-1"}
              formatOptions={{
                style: "currency",
                currency: "USD",
                currencyDisplay: "symbol",
                currencySign: "accounting",
              }}
            >
              <Label>
                <span className="text-red-500">*</span>Retail Price
              </Label>
              <Group
                className={"flex outline dark:outline-a3sd w-max rounded-lg"}
              >
                <Button
                  slot="decrement"
                  className={({ isDisabled }) =>
                    `flex flex-col justify-center items-center aspect-square h-[30px] border-r dark:border-r-a3sd ${isDisabled ? "dark:text-a1d" : ""}`
                  }
                >
                  <IconMinus size={18} />
                </Button>
                <Input
                  className={({ isDisabled }) =>
                    `dark:bg-a1sd dark:text-a0d px-2`
                  }
                />
                <Button
                  slot="increment"
                  className={({ isDisabled }) =>
                    `flex flex-col justify-center items-center aspect-square h-[30px] border-l dark:border-l-a3sd ${isDisabled ? "dark:text-a1d" : ""}`
                  }
                >
                  <IconPlus size={18} />
                </Button>
              </Group>
              <FieldError className={"text-red-500"} />
            </NumberField>
          </div>
          <TextField className={"flex flex-col gap-1"}>
            <Label>Product Description</Label>
            <TextArea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={"dark:bg-a1sd dark:text-a0d p-2 rounded-lg"}
            />
          </TextField>
          <TextField className={"flex flex-col gap-1"}>
            <Label>Product Highlights</Label>
            <ResizableTableContainer>
              <Table aria-label="Product highlights" className={"border"}>
                <TableHeader className={"border-b"}>
                  <Collection
                    items={[
                      { label: "Heading", id: 1 },
                      { label: "Overview", id: 2 },
                    ]}
                  >
                    {(items) => (
                      <Column
                        className={"text-start p-2"}
                        id={items.id}
                        isRowHeader={true}
                      >
                        {items.label}
                      </Column>
                    )}
                  </Collection>
                  <Column width={1} className={"p-2"}>
                    {"X"}
                  </Column>
                </TableHeader>
                <TableBody>
                  {highlights.map((obj, i) => {
                    return (
                      <Row key={i}>
                        <Cell className={"p-2"}>{obj.heading}</Cell>
                        <Cell className={"p-2"}>{obj.overview}</Cell>
                        <Cell className={"text-end p-2"}>
                          <Button
                            onPress={(e) => handleHighlightDelete(e, i)}
                            className={"bg-red-400 px-1 rounded-md"}
                          >
                            Delete
                          </Button>
                        </Cell>
                      </Row>
                    );
                  })}
                </TableBody>
              </Table>
            </ResizableTableContainer>
          </TextField>

          <TextField className={"flex flex-col gap-1"}>
            <Label>Add new product highlights</Label>
            <Group className={"flex flex-col gap-2 ml-4"}>
              <Label>Heading</Label>
              <Input
                onChange={(e) => setNewHighlightsHeading(e.target.value)}
                value={newHighlightsHeading}
                className={({ isDisabled }) =>
                  `dark:bg-a1sd dark:text-a0d h-[38px] px-2 rounded-lg `
                }
              ></Input>
              <Label>Overview</Label>
              <Input
                className={({ isDisabled }) =>
                  `dark:bg-a1sd h-[38px] px-2 dark:text-a0d`
                }
                value={newHighlightsOverview}
                onChange={(e) => setNewHighlightsOverview(e.target.value)}
              ></Input>
              <Button
                className={({
                  isFocusVisible,
                  isHovered,
                  isPressed,
                  isDisabled,
                }) =>
                  `outline dark:outline-a3sd max-w-max py-1 px-2 rounded-lg ${isFocusVisible || isHovered || isPressed ? "dark:bg-a3sd" : isDisabled ? "dark:text-a2d" : ""}`
                }
                isDisabled={
                  newHighlightsHeading.length < 1 ||
                  newHighlightsOverview.length < 1
                }
                onPress={() => handleHighlightNewRow()}
              >
                Add highlight
              </Button>
            </Group>
          </TextField>
          <div>
            <NumberField
              className={"flex flex-col gap-1"}
              value={quantity}
              onChange={setQuantity}
              minValue={0}
              isRequired={true}
              maxValue={10000}
              step={1}
            >
              <Label>
                <span className="text-red-500">*</span>Product Quantity
                (backstock)
              </Label>
              <Group
                className={"flex outline dark:outline-a3sd w-max rounded-lg"}
              >
                <Button
                  slot="decrement"
                  className={({ isDisabled }) =>
                    `flex flex-col justify-center items-center aspect-square h-[30px] border-r dark:border-r-a3sd ${isDisabled ? "dark:text-a1d" : ""}`
                  }
                >
                  <IconMinus size={18} />
                </Button>
                <Input
                  className={({ isDisabled }) =>
                    `dark:bg-a1sd dark:text-a0d px-2`
                  }
                />
                <Button
                  slot="increment"
                  className={({ isDisabled }) =>
                    `flex flex-col justify-center items-center aspect-square h-[30px] border-l dark:border-l-a3sd ${isDisabled ? "dark:text-a1d" : ""}`
                  }
                >
                  <IconPlus size={18} />
                </Button>
              </Group>
              <FieldError className={"text-red-500"} />
            </NumberField>
          </div>
          <div>
            <NumberField
              className={"flex flex-col gap-1"}
              value={totalBought}
              onChange={setTotalBought}
              minValue={0}
              maxValue={10000}
              isRequired={true}
              validate={(num) => (Number(num) <= 0 ? "Invalid number" : "")}
              step={1}
            >
              <Label>
                <span className="text-red-500">*</span>Total Bought
              </Label>
              <Group
                className={"flex outline dark:outline-a3sd w-max rounded-lg"}
              >
                <Button
                  slot="decrement"
                  className={({ isDisabled }) =>
                    `flex flex-col justify-center items-center aspect-square h-[30px] border-r dark:border-r-a3sd ${isDisabled ? "dark:text-a1d" : ""}`
                  }
                >
                  <IconMinus size={18} />
                </Button>
                <Input
                  className={({ isDisabled }) =>
                    `dark:bg-a1sd dark:text-a0d px-2`
                  }
                />
                <Button
                  slot="increment"
                  className={({ isDisabled }) =>
                    `flex flex-col justify-center items-center aspect-square h-[30px] border-l dark:border-l-a3sd ${isDisabled ? "dark:text-a1d" : ""}`
                  }
                >
                  <IconPlus size={18} />
                </Button>
              </Group>
              <FieldError className={"text-red-500"} />
            </NumberField>
          </div>
          <div className="errors">
            {globalError && (
              <ul>
                {globalError.map((error, i) => {
                  return (
                    <li key={i} className="text-red-500">
                      {error.msg}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="submit-btn mt-4">
            <Button
              type="submit"
              autoFocus={false}
              className={({ isDisabled }) =>
                `py-2 px-3 rounded-md ${isDisabled ? "bg-neutral-300" : "bg-blue-500"}`
              }
            >
              Review Changes
            </Button>
          </div>
        </Form>
      </div>
    </main>
  );
}

export default EditProduct;
