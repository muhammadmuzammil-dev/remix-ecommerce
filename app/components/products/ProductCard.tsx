import { SearchQuery } from '~/generated/graphql';
import {
  FetcherWithComponents,
  Form,
  Link,
  useLoaderData,
  useOutletContext,
} from '@remix-run/react';
import { Price } from './Price';
import { CartLoaderData } from '~/routes/api/active-order';
// import { getAddItemToOrderError } from '~/routes/products/$slug';
import { useState } from 'react';
import { ScrollableContainer } from '~/components/products/ScrollableContainer';
import { CheckIcon, HeartIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { StockLevelLabel } from '~/components/products/StockLevelLabel';
import Alert from '~/components/Alert';
import { loader } from '~/root';
import { useTranslation } from 'react-i18next';
import { ErrorCode, ErrorResult } from '~/generated/graphql';
import { useFetcher } from '@remix-run/react';

function getAddItemToOrderError(error?: ErrorResult): string | undefined {
  if (!error || !error.errorCode) {
    return undefined;
  }
  switch (error.errorCode) {
    case ErrorCode.OrderModificationError:
    case ErrorCode.OrderLimitError:
    case ErrorCode.NegativeQuantityError:
    case ErrorCode.InsufficientStockError:
      return error.message;
  }
}
export type ProductCardProps = SearchQuery['search']['items'][number];
export function ProductCard({
  productAsset,
  productName,
  slug,
  priceWithTax,
  currencyCode,
  collection,
  productDetails,
  error,
}: ProductCardProps) {
  const { activeOrderFetcher } = useOutletContext<{
    activeOrderFetcher: FetcherWithComponents<CartLoaderData>;
  }>();
  const { activeOrder } = activeOrderFetcher.data ?? {};
  const addItemToOrderError = getAddItemToOrderError(error);
  const { t } = useTranslation();
  if (!productDetails) {
    return <div>{t('product.notFound')}</div>;
  }
  const fetcher = useFetcher();
  const findVariantById = (id: string) =>
    productDetails.variants.find((v: any) => v.id === id);

  const [selectedVariantId, setSelectedVariantId] = useState(
    productDetails.variants[0].id,
  );
  const selectedVariant = findVariantById(selectedVariantId);
  if (!selectedVariant) {
    setSelectedVariantId(productDetails.variants[0].id);
  }

  const qtyInCart =
    activeOrder?.lines.find((l) => l.productVariant.id === selectedVariantId)
      ?.quantity ?? 0;

  const asset = productDetails.assets[0];
  const brandName = productDetails.facetValues.find(
    (fv: any) => fv.facet.code === 'brand',
  )?.name;

  const [featuredAsset, setFeaturedAsset] = useState(
    selectedVariant?.featuredAsset,
  );

  return (
    <>
      {/* <Link className="flex flex-col" prefetch="intent" to={`/products/${slug}`}>
      <img
        className="rounded-xl flex-grow object-cover aspect-[7/8]"
        alt=""
        src={productAsset?.preview + '?w=300&h=400'}
      />
      <div className="h-2" />
      <div className="text-sm text-gray-700">{productName}</div>
      <div className="text-sm font-medium text-gray-900">
        <Price priceWithTax={priceWithTax} currencyCode={currencyCode} />
      </div>
    </Link> */}

      {/* -----------------------------------Changes -------------------------------- */}
      <div className="mt-4 md:mt-0 lg:flex lg:flex-col lg:gap-y-8 h-auto shadow p-2 rounded">
        {/* Image gallery */}
        <div className="w-full max-w-2xl mx-auto sm:block lg:max-w-none h-52 overflow-hidden">
          <span className="rounded-md overflow-hidden h-full block">
            <img
              src={
                (featuredAsset?.preview ||
                  productDetails.featuredAsset?.preview) + '?w=800'
              }
              alt={productDetails.name}
              className="w-full h-full object-center object-cover rounded-lg"
            />
          </span>
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0 flex-grow overflow-hidden">
          {/* Description */}
          <div
            className="description-scroll"
            style={{
              maxHeight:
                activeOrder && activeOrder?.lines.length === 0
                  ? '60vh'
                  : '13vh',
              overflowY: 'auto',
              msOverflowStyle: 'none', // Works for Internet Explorer and Edge
              scrollbarWidth: 'none', // Works for Firefox
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: productDetails.description }}
            />
          </div>
          <style>
            {`
    .description-scroll::-webkit-scrollbar {
      display: none;
    }
  `}
          </style>
          {/* Variant Selector */}
          <activeOrderFetcher.Form method="post" action="/api/active-order">
            <input type="hidden" name="action" value="addItemToOrder" />
            <input type="hidden" name="collectionSlug" value={collection} />
            <div className="h-16 mt-4">
              {productDetails.variants.length > 1 ? (
                <div className="mt-0">
                  <label
                    htmlFor="option"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t('product.selectOption')}
                  </label>
                  <select
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md ${
                      selectedVariantId ? '' : 'h-20' // Apply the height class conditionally
                    }`}
                    id="productVariant"
                    value={selectedVariantId}
                    name="variantId"
                    onChange={(e) => {
                      setSelectedVariantId(e.target.value);
                      const variant = findVariantById(e.target.value);
                      if (variant) {
                        setFeaturedAsset(variant!.featuredAsset);
                      }
                    }}
                  >
                    {productDetails.variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <input
                  type="hidden"
                  name="variantId"
                  value={selectedVariantId}
                />
              )}
            </div>
            {/* Other elements (e.g., price, buttons) */}
            {/* <div className="mt-4 flex flex-col sm:flex-row sm:items-center w-full">
              <p className="text-3xl text-gray-900 mr-4 flex-1">
                <Price
                  priceWithTax={selectedVariant?.priceWithTax}
                  currencyCode={selectedVariant?.currencyCode}
                ></Price>
              </p>
              <div className="flex sm:flex-col1 align-baseline w-full">
                <button
                  type="submit"
                  className={`max-w-xs flex-1 ${
                    activeOrderFetcher.state !== 'idle'
                      ? 'bg-gray-400'
                      : qtyInCart === 0
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-green-600 active:bg-green-700 hover:bg-green-700'
                  }
                                 transition-colors border border-transparent rounded-md py-3 px-8 flex items-center
                                  justify-center text-base font-medium text-white focus:outline-none
                                  focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500 sm:w-full`}
                  disabled={activeOrderFetcher.state !== 'idle'}
                >
                  {qtyInCart ? (
                    <span className="flex items-center">
                      <CheckIcon className="w-5 h-5 mr-1" /> {qtyInCart}{' '}
                      {t('product.inCart')}
                    </span>
                  ) : (
                    t('product.addToCart')
                  )}
                </button>

                <button
                  type="button"
                  className="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <HeartIcon
                    className="h-6 w-6 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{t('product.addToFavorites')}</span>
                </button>
              </div>
            </div> */}
            <div
              className={`mt-10 ${
                activeOrder && activeOrder?.lines.length === 0
                  ? 'flex flex-row items-center'
                  : 'flex flex-col sm:flex-col '
              }  my-2`}
            >
              <p className="text-xl text-gray-900 mr-2 flex-shrink-0">
                <Price
                  priceWithTax={selectedVariant?.priceWithTax}
                  currencyCode={selectedVariant?.currencyCode}
                />
              </p>
              <div
                className={` flex-grow  sm:flex sm:flex-col1 sm:items-center`}
              >
                <button
                  type="submit"
                  className={`w-full sm:max-w-xs ${
                    activeOrderFetcher.state !== 'idle'
                      ? 'bg-gray-400'
                      : qtyInCart === 0
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-green-600 active:bg-green-700 hover:bg-green-700'
                  } ${
                    activeOrder?.lines.length == 0
                      ? 'py-2 sm:py-3 px-3 sm:px-4'
                      : 'py-0 sm:py-0 px-0 sm:px-0'
                  }
      transition-colors border border-transparent rounded-md  flex items-center
      justify-center text-sm sm:text-base font-medium text-white focus:outline-none
      focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500`}
                  disabled={activeOrderFetcher.state !== 'idle'}
                >
                  {qtyInCart ? (
                    <span className="flex items-center">
                      <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                      {qtyInCart} {t('product.inCart')}
                    </span>
                  ) : (
                    t('product.addToCart')
                  )}
                </button>

                <button
                  type="button"
                  className="mt-2 sm:mt-0 sm:ml-0 py-2 sm:py-3 px-2 sm:px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <HeartIcon
                    className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{t('product.addToFavorites')}</span>
                </button>
              </div>
            </div>

            <div
              className={`${
                activeOrder?.lines.length == 0
                  ? 'flex flex-row justify-between'
                  : 'flex flex-col  space-x-0'
              }`}
            >
              <span className="text-gray-500">{selectedVariant?.sku}</span>
              <StockLevelLabel stockLevel={selectedVariant?.stockLevel} />
            </div>
            {addItemToOrderError && (
              <div className="mt-4">
                <Alert message={addItemToOrderError} />
              </div>
            )}
          </activeOrderFetcher.Form>
        </div>
      </div>
    </>
  );
}

export function CatchBoundary() {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
        {t('product.notFound')}
      </h2>
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start mt-4 md:mt-12">
        {/* Image gallery */}
        <div className="w-full max-w-2xl mx-auto sm:block lg:max-w-none">
          <span className="rounded-md overflow-hidden">
            <div className="w-full h-96 bg-slate-200 rounded-lg flex content-center justify-center">
              <PhotoIcon className="w-48 text-white"></PhotoIcon>
            </div>
          </span>
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <div className="">{t('product.notFoundInfo')}</div>
          <div className="flex-1 space-y-3 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
