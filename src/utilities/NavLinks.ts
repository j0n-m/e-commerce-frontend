type AllLinksType = {
  label: string;
  link: string;
  params: object;
  search: object;
  id?: string;
  newId?: string;
};

const allLinks: AllLinksType[] = [
  {
    label: "Best Deals",
    link: "/shop/category/best-deals",
    id: undefined,
    newId: "1",
    params: {},
    search: { page: 1 },
  },
  {
    label: "Best Sellers",
    link: "/shop/category/best-sellers",
    id: undefined,
    newId: "2",
    params: {},
    search: { page: 1 },
  },
  {
    label: "Electronics",
    link: "/shop/category/$categoryId",
    params: { categoryId: "668d71b9569596eb9af05f13" },
    search: { page: 1, category: "Electronics" },
    id: "668d71b9569596eb9af05f13",
  },
  {
    label: "Garden & Outdoors",
    link: "/shop/category/$categoryId",
    params: { categoryId: "668d7ce16408ff45e381f150" },
    search: { page: 1, category: "Garden & Outdoors" },
    id: "668d7ce16408ff45e381f150",
  },
  {
    label: "Home & Kitchen",
    link: "/shop/category/$categoryId",
    params: { categoryId: "668d7ce06408ff45e381f14d" },
    search: { page: 1, category: "Home & Kitchen" },
    id: "668d7ce06408ff45e381f14d",
  },
  {
    label: "Office Products",
    link: "/shop/category/$categoryId",
    params: { categoryId: "668d71ba569596eb9af05f16" },
    search: { page: 1, category: "Office Products" },
    id: "668d71ba569596eb9af05f16",
  },
  {
    label: "Pet Supplies",
    link: "/shop/category/$categoryId",
    params: { categoryId: "668d7ce06408ff45e381f149" },
    search: { page: 1, category: "Pet Supplies" },
    id: "668d7ce06408ff45e381f149",
  },
  {
    id: "671a9c6496c6fd62be5909b3",
    label: "Photography",
    params: { categoryId: "671a9c6496c6fd62be5909b3" },
    search: { page: 1, category: "Photography" },
    link: "/shop/category/$categoryId",
  },
  {
    label: "Toys & Games",
    link: "/shop/category/$categoryId",
    params: { categoryId: "668d7ce16408ff45e381f153" },
    search: { page: 1, category: "Toys & Games" },
    id: "668d7ce16408ff45e381f153",
  },
  {
    label: "Video Games",
    link: "/shop/category/$categoryId",
    params: { categoryId: "668d71ba569596eb9af05f19" },
    search: { page: 1, category: "Video Games" },
    id: "668d71ba569596eb9af05f19",
  },
];

const mappedLinks = new Map(
  allLinks.map((obj, index) => [
    obj.label.trim().toLowerCase().replaceAll(" ", ""),
    index,
  ])
);
const mappedIds = new Map(allLinks.map((obj) => [obj.id, obj.label]));

export { allLinks, mappedLinks, mappedIds };
