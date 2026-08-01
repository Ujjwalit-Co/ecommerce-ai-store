import { sanityFetch } from "@/sanity/lib/live";
import { ALL_CATEGORIES_QUERY } from "@/sanity/queries/categories";
import {
  FILTER_PRODUCTS_BY_NAME_QUERY,
  FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
  FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
  FILTER_PRODUCTS_BY_RELEVANCE_QUERY,
} from "@/sanity/queries/products";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    color?: string;
    material?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    inStock?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  const searchQuery = params.q ?? "";
  const categorySlug = params.category ?? "";
  const color = params.color ?? "";
  const material = params.material ?? "";
  const minPrice = params.minPrice ? Number(params.minPrice) : 0;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : 0;
  const sort = params.sort ?? "";
  const inStock = params.inStock === "true";

  console.log("--- Incoming Search Params ---");
  console.log({ searchQuery, categorySlug, color, material, minPrice, maxPrice, sort, inStock });

  // Determine which query to use
  const getQuery = () => {
    if (searchQuery && sort === "relevance") {
      return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
    }

    switch (sort) {
      case "price_asc":
        return FILTER_PRODUCTS_BY_PRICE_ASC_QUERY;
      case "price_desc":
        return FILTER_PRODUCTS_BY_PRICE_DESC_QUERY;
      default:
        return FILTER_PRODUCTS_BY_NAME_QUERY;
    }
  };

  const selectedQuery = getQuery();
  console.log("--- Selected Query ---");
  console.log(selectedQuery);

  // Build params object for the filter query
  const queryParams = {
    searchQuery,
    categorySlug,
    color,
    material,
    minPrice,
    maxPrice,
    inStock,
  };

  console.log("--- Query Params ---");
  console.log(queryParams);

  // Fetch products with the selected query
  const { data: products } = await sanityFetch({
    query: selectedQuery,
    params: queryParams,
  });

  console.log("--- Products Result ---");
  console.log(`Found ${products.length} products`);
  console.log(products);

  // Fetch categories
  const { data: categories } = await sanityFetch({
    query: ALL_CATEGORIES_QUERY,
  });

  console.log("--- Categories Result ---");
  console.log(`Found ${categories.length} categories`);
  console.log(categories);

  console.log("--- All Queries Completed ---");

  return (
    <div>
      <p>Check the server console for query logs.</p>
    </div>
  );
}