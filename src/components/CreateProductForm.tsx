import { IconCheck, IconMinus, IconPlus, IconX } from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
import { allCategoriesOption } from "../routes/shop/product_/$productId/edit";
import { Category, Highlight, PaginationResponse } from "../types/ProductType";
import { useNavigate } from "@tanstack/react-router";
import fetch from "../utilities/fetch";
import { queryClient } from "../App";
import { AxiosError, AxiosResponse } from "axios";
import useAuth from "../hooks/useAuth";

function useCategories() {
  const response = useSuspenseQuery(allCategoriesOption()).data;
  const categoryData = response.data as PaginationResponse & {
    categories: Category[];
  };
  return { categoryData };
}

function CreateProductForm() {
  const { categoryData } = useCategories();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState<number>(1000);
  const [retailPrice, setRetailPrice] = useState<number>(1000);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [totalBought, setTotalBought] = useState<number>(0);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [newHighlightsHeading, setNewHighlightsHeading] = useState("");
  const [newHighlightsOverview, setNewHighlightsOverview] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [formReadyToSubmit, setFormReadyToSubmit] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<{ [index: string]: string } | undefined>(
    undefined
  );
  const [selectedCategory, setSelectedCategory] = useState<Selection>(
    new Set(undefined)
  );
  const [globalError, setGlobalError] = useState<[{ msg: string }] | undefined>(
    undefined
  );
  console.log("globalError?", globalError);
  const tagList = tags.map((str, i) => ({ id: i, label: str }));
  const userCache = (queryClient.getQueryData(["auth"]) as AxiosResponse).data;
  const createFormMutate = useMutation({
    mutationFn: () => {
      return fetch.post(
        `/api/products`,
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
        queryKey: ["searchQuery"],
      });
      queryClient.invalidateQueries({
        queryKey: ["category"],
      });
      await navigate({
        to: "/shop/category/$categoryId",
        params: { categoryId: categories[0]._id },
        search: { page: 1 },
        replace: true,
      });
    },
    onError: (error) => {
      const res = error as AxiosError;
      console.log(res);
      setFormReadyToSubmit(false);
      setTimeout(() => {
        window.scroll(0, 10000);
      }, 200);

      if (res.status === 401 || res.status === 403) {
        console.log("error", error);
        setGlobalError([{ msg: "You must be signed in to do that." }]);
        queryClient.invalidateQueries({
          queryKey: ["auth"],
        });
      } else {
        setGlobalError([
          {
            msg: `Error: ${res.status}, ${res.response?.data?.error[0]?.msg || res.message}`,
          },
        ]);
      }
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
    setNewHighlightsHeading("");
    setNewHighlightsOverview("");
    setHighlights(newHighlights);
  };

  const handleAddNewCategory = () => {
    const newCategories_Id = Array.from(selectedCategory);
    const newCategories: Category[] = [];
    newCategories_Id.forEach((id) => {
      const foundCategory = categoryData.categories.find(
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
    const isValidated = () => {
      if (categories.length < 1) {
        setError({
          category: "You must select at least one category for this product.",
        });
        return false;
      }
      return true;
    };
    if (isValidated()) {
      setFormReadyToSubmit(true);
    } else {
      setGlobalError([{ msg: "Please fix the form errors above." }]);
    }
  };

  useEffect(() => {
    if (!user && !userCache?.user?.is_admin) {
      navigate({ to: "/signin", search: { from: window.location.pathname } });
    }
  }, [user, userCache]);

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
              className={`border rounded-md dark:border-a3sd p-2`}
              onPress={() => setFormReadyToSubmit(false)}
            >
              Back to edit form
            </Button>
            <Button
              className={`bg-blue-500 p-2 rounded-md dark:text-a0d text-white`}
              onPress={() => createFormMutate.mutate()}
              isDisabled={createFormMutate.isPending}
            >
              Create Product
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content max-w-[600px] mx-auto">
      <h1 className="font-bold text-xl">Create Product Form</h1>
      <p className="text-sm dark:text-a1d text-a1">
        <span className="text-red-500">*</span> denotes required fields.
      </p>
      <div className="divider dark:bg-a3sd h-[1px] mt-2 mb-2"></div>
      <Form
        onSubmit={handleFormSubmit}
        className="mt-2 flex flex-col gap-4"
        validationErrors={error}
      >
        {/* <TextField
          name="id"
          minLength={5}
          className={"flex flex-col gap-1 flex-1"}
          type="text"
          isRequired
        >
          <Label>
            <span className="text-red-600">*</span>Product ID
          </Label>
          <Input
            className={"dark:bg-a1sd dark:text-a0d p-2 rounded-lg"}
            placeholder="e.g. 668dad22f647efa27c8c6af1"
            value={id}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (error?.id) {
                setError(undefined);
              }
              setId(e.target.value);
            }}
          />
          <FieldError className={`text-red-600`} />
        </TextField> */}
        <TextField
          name="name"
          type="text"
          isRequired
          minLength={1}
          className={"flex flex-col gap-1"}
        >
          <Label>
            <span className="text-red-500">*</span>Product Name
          </Label>
          <Input
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (error?.name) {
                setError(undefined);
              }
              setName(e.target.value);
            }}
            className={
              "dark:bg-a1sd dark:text-a0d outline outline-a2s dark:outline-none p-2 rounded-lg"
            }
          />
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
                <p className="text-red-600">This product has no category.</p>
              )}
            >
              {(items) => (
                <Tag
                  className={
                    "px-2 py-1 flex items-center justify-center outline outline-1 outline-a3s dark:outline-a3sd rounded-md"
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
            {error?.category && (
              <p className="text-red-500">{error.category}</p>
            )}
          </TagGroup>
          <div className={"mt-3"}>
            <Label>Add new Category</Label>
            <div className="flex gap-3 items-center mt-1">
              <ListBox
                aria-label="Category Options"
                renderEmptyState={() => "No available categories found."}
                selectionMode="multiple"
                items={categoryData.categories}
                disabledKeys={categories.map((obj) => obj._id)}
                selectedKeys={selectedCategory}
                onSelectionChange={setSelectedCategory}
                className={
                  "outline outline-1 rounded-lg dark:outline-a3sd outline-a3s p-1 max-h-[14rem] overflow-y-scroll"
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
                          className={`flex px-2 py-1 justify-between items-center ${isSelected ? "dark:bg-a3sd bg-a1s/90" : isHovered || isFocusVisible ? "dark:bg-a2sd bg-a1s cursor-pointer" : isDisabled ? "dark:text-a2d text-a1/70 bg-a2s dark:bg-amenusd" : ""}`}
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
                className={({
                  isFocusVisible,
                  isHovered,
                  isPressed,
                  isDisabled,
                }) =>
                  `outline outline-a2s dark:outline-a3sd p-1 rounded-lg ${isFocusVisible || isHovered || isPressed ? "dark:bg-a3sd" : isDisabled ? "dark:text-a2d text-a1/60 bg-a2s dark:bg-a2sd" : ""}`
                }
                onPress={() => {
                  if (error?.category) {
                    setError(undefined);
                    setGlobalError(undefined);
                  }
                  handleAddNewCategory();
                }}
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
          className={"flex flex-col gap-1"}
        >
          <Label>Product Image</Label>
          <Input
            value={imageSrc}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (error?.imageSrc) {
                setError(undefined);
              }
              setImageSrc(e.target.value);
            }}
            className={
              "dark:bg-a1sd dark:text-a0d p-2 rounded-lg outline outline-a2s dark:outline-none"
            }
          />
          <FieldError className={"text-red-500"} />
        </TextField>
        <TextField
          name="brand"
          type="text"
          isRequired={true}
          minLength={1}
          className={"flex flex-col gap-1"}
        >
          <Label>
            <span className="text-red-500">*</span>Product Brand
          </Label>
          <Input
            value={brand}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (error?.brand) {
                setError(undefined);
              }
              setBrand(e.target.value);
            }}
            className={
              "dark:bg-a1sd dark:text-a0d p-2 rounded-lg outline outline-a2s dark:outline-none"
            }
          />
          <FieldError className={"text-red-500"} />
        </TextField>
        <div>
          <TagGroup className="flex flex-col gap-1" onRemove={handleTagRemoval}>
            <Label>Product Tags</Label>
            <TagList
              className={"flex gap-2 flex-wrap"}
              items={tagList}
              renderEmptyState={() => (
                <p className="text-red-600">This product has no tags.</p>
              )}
            >
              {(items) => (
                <Tag
                  className={
                    "px-2 py-1 flex items-center justify-center outline outline-1 outline-a3s dark:outline-a3sd rounded-md"
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
              placeholder="e.g. Electronics"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleNewTag();
                }
              }}
              className={
                "dark:bg-a1sd dark:text-a0d p-2 rounded-lg outline outline-a2s dark:outline-none"
              }
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
                `outline dark:outline-a3sd outline-a2s p-1 rounded-lg ${isFocusVisible || isHovered || isPressed ? "dark:bg-a3sd" : isDisabled ? "dark:text-a2d text-a1/60 bg-a1s dark:bg-a0sd" : ""}`
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
            className={
              "dark:bg-a1sd dark:text-a0d p-2 rounded-lg outline outline-a2s dark:outline-none"
            }
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
                  {"Remove"}
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
                `dark:bg-a1sd dark:text-a0d h-[38px] px-2 rounded-lg outline outline-a2s dark:outline-none`
              }
            ></Input>
            <Label>Overview</Label>
            <Input
              className={({ isDisabled }) =>
                `dark:bg-a1sd dark:text-a0d h-[38px] px-2 rounded-lg outline outline-a2s dark:outline-none`
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
                `outline dark:outline-a3sd outline-a2s max-w-max py-1 px-2 rounded-lg ${isFocusVisible || isHovered || isPressed ? "dark:bg-a3sd" : isDisabled ? "dark:text-a2d bg-a1s text-a1/60 dark:bg-a0sd" : ""}`
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
            maxValue={250}
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
            maxValue={1000000}
            isRequired={true}
            validate={(num) =>
              Number(num) < 0 ? "Value must be 0 or a positive number." : ""
            }
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
              `py-2 px-3 rounded-md dark:text-a0d text-white ${isDisabled ? "bg-neutral-300" : "bg-blue-500"}`
            }
          >
            Add product
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CreateProductForm;
