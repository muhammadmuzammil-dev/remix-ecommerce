import FacetFilterControls from '~/components/facet-filter/FacetFilterControls';
import { ProductCard } from '~/components/products/ProductCard';
import {
  translatePaginationFrom,
  translatePaginationTo,
} from '~/utils/pagination';
import { Pagination } from '~/components/Pagination';
import { NoResultsHint } from '~/components/products/NoResultsHint';
import { useRef, useState } from 'react';
import { FacetFilterTracker } from '~/components/facet-filter/facet-filter-tracker';
import { filteredSearchLoaderFromPagination } from '~/utils/filtered-search-loader';
import { useTranslation } from 'react-i18next';
import { CartTraySimpleComp } from '~/components/cart/CartTraySimpleComp';
import { useActiveOrder } from '~/utils/use-active-order';

export function FilterableProductGrid({
  result,
  resultWithoutFacetValueFilters,
  facetValueIds,
  appliedPaginationPage,
  appliedPaginationLimit,
  allowedPaginationLimits,
  mobileFiltersOpen,
  collectionParam,
  error,
  setMobileFiltersOpen,
}: Awaited<
  ReturnType<
    ReturnType<
      typeof filteredSearchLoaderFromPagination
    >['filteredSearchLoader']
  >
> & {
  allowedPaginationLimits: Set<number>;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (arg0: boolean) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const {
    activeOrderFetcher,
    activeOrder,
    adjustOrderLine,
    removeItem,
    refresh,
  } = useActiveOrder();
  const facetValuesTracker = useRef(new FacetFilterTracker());
  facetValuesTracker.current.update(
    result,
    resultWithoutFacetValueFilters,
    facetValueIds,
  );
  return (
    <div className="t-2 grid sm:grid-cols-5 gap-x-2 pr-4">
      {/* Uncomment if FacetFilterControls is needed */}
      {/* <FacetFilterControls
      facetFilterTracker={facetValuesTracker.current}
      mobileFiltersOpen={mobileFiltersOpen}
      setMobileFiltersOpen={setMobileFiltersOpen}
    /> */}

      {result.items.length > 0 ? (
        <div
          className={`space-y-6 ${
            activeOrder && activeOrder.totalQuantity
              ? 'sm:col-span-3'
              : 'sm:col-span-5'
          }`}
        >
          {/* Dynamically adjust grid layout for product cards */}
          <div
            className={`
        grid grid-cols-1 gap-y-10 gap-x-12 
        ${
          activeOrder && activeOrder.totalQuantity
            ? 'md:grid-cols-4 xl:gap-x-2'
            : 'md:grid-cols-2 lg:grid-cols-4 xl:gap-x-6'
        } 
      `}
          >
            {result.items.map((item) => (
              <ProductCard
                key={item.productId}
                {...item}
                error={error}
                collection={collectionParam}
              />
            ))}
          </div>

          {/* Pagination and other elements */}
          <div className="flex flex-row justify-between items-center gap-4">
            <span className="self-start text-gray-500 text-sm mt-2">
              {t('product.showing')}{' '}
              {translatePaginationFrom(
                appliedPaginationPage,
                appliedPaginationLimit,
              )}
              {t('product.to')}{' '}
              {translatePaginationTo(
                appliedPaginationPage,
                appliedPaginationLimit,
                result.items.length,
              )}
            </span>
            <Pagination
              appliedPaginationLimit={appliedPaginationLimit}
              allowedPaginationLimits={allowedPaginationLimits}
              totalItems={result.totalItems}
              appliedPaginationPage={appliedPaginationPage}
            />
          </div>
        </div>
      ) : (
        <NoResultsHint
          facetFilterTracker={facetValuesTracker.current}
          className={`sm:col-span-${
            activeOrder && activeOrder.totalQuantity ? '3' : '4'
          } sm:p-4`}
        />
      )}

      {/* Conditionally render CartTraySimpleComp if activeOrder.totalQuantity exists */}
      {activeOrder && activeOrder.totalQuantity && (
        <div className="sm:flex sm:justify-center sm:col-span-2 h-[600px] sticky top-0 z-10">
          <CartTraySimpleComp
            open={open}
            onClose={setOpen}
            activeOrder={activeOrder}
            adjustOrderLine={adjustOrderLine}
            removeItem={removeItem}
          />
        </div>
      )}
    </div>
  );
}
