import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CartContents } from './CartContents';
import { Link, useLocation } from '@remix-run/react';
import { Price } from '~/components/products/Price';
import { CartLoaderData } from '~/routes/api/active-order';
import { CurrencyCode } from '~/generated/graphql';
import { useTranslation } from 'react-i18next';

export function CartTraySimpleComp({
  open,
  onClose,
  activeOrder,
  adjustOrderLine,
  removeItem,
}: {
  open: boolean;
  onClose: (closed: boolean) => void;
  activeOrder: CartLoaderData['activeOrder'];
  adjustOrderLine?: (lineId: string, quantity: number) => void;
  removeItem?: (lineId: string) => void;
}) {
  const currencyCode = activeOrder?.currencyCode || CurrencyCode.Usd;
  const location = useLocation();
  const editable = !location.pathname.startsWith('/checkout');
  const { t } = useTranslation();

  return (
    <div className=" inset-y-0 right-0 pl-2 max-w-full flex ">
      <div className="w-screen max-w-md">
        <div className="h-full flex flex-col bg-white shadow-xl ">
          <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                {t('cart.title')}
              </h2>
              {/* <div className="ml-3 h-7 flex items-center">
              <button
                type="button"
                className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                onClick={() => onClose(false)}
              >
                <span className="sr-only">{t('common.closePanel')}</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div> */}
            </div>

            <div className="mt-4">
              {activeOrder && activeOrder?.totalQuantity ? (
                <CartContents
                  orderLines={activeOrder?.lines ?? []}
                  currencyCode={currencyCode!}
                  editable={editable}
                  removeItem={removeItem}
                  adjustOrderLine={adjustOrderLine}
                />
              ) : (
                <div className="flex items-center justify-center h-48 text-xl text-gray-400">
                  {t('cart.empty')}
                </div>
              )}
            </div>
            <div className="w-full my-10">
              <label
                htmlFor="promotions"
                className="block  text-sm font-medium text-center font-lg py-1 rounded text-white bg-primary-600 hover:bg-primary-700"
              >
                Promotions
              </label>
              <select
                name="promotions"
                id="promotions"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="1">Promotion 1</option>
                <option value="2">Promotion 2</option>
              </select>
            </div>
          </div>

          {activeOrder?.totalQuantity && editable && (
            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>{t('common.subtotal')}</p>
                <p>
                  {currencyCode && (
                    <Price
                      priceWithTax={activeOrder?.subTotalWithTax ?? 0}
                      currencyCode={currencyCode}
                    />
                  )}
                </p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                {t('cart.shippingMessage')}
              </p>
              <div className="mt-6">
                <Link
                  to="/checkout"
                  onClick={() => onClose(false)}
                  className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  {t('cart.checkout')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
