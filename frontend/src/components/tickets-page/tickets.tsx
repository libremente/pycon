import React, { useEffect } from "react";

import { useRouter } from "next/router";

import type {
  CheckoutCategory,
  CurrentUserQueryResult,
  TicketItem,
  TicketsQueryResult,
} from "~/types";

import { ProductsList } from "../products-list";
import { useLoginState } from "../profile/hooks";
import { CheckoutBar } from "./checkout-bar";
import { useCart } from "./use-cart";

type Props = {
  products: TicketItem[];
  conference: TicketsQueryResult["data"]["conference"];
  me: CurrentUserQueryResult["data"]["me"];
  business: boolean;
  visibleCategories: CheckoutCategory[];
  showHeadings: boolean;
};

export const Tickets = ({
  products,
  conference,
  business,
  me,
  visibleCategories,
  showHeadings = true,
}: Props) => {
  const {
    updateIsBusiness,
    state: {
      invoiceInformation: { isBusiness },
    },
  } = useCart();
  const { push, query } = useRouter();
  const [loggedIn] = useLoginState();
  const voucherCode = query.voucher;

  const onCheckout = () => {
    if (loggedIn) {
      push("/tickets/checkout");
      return;
    }

    push("/login?next=/tickets/checkout");
  };

  useEffect(() => {
    if (isBusiness !== business) {
      updateIsBusiness(business);
    }
  }, []);

  return (
    <>
      <ProductsList
        products={products}
        conference={conference}
        business={business}
        ignoreSoldOut={!!voucherCode}
        me={me}
        visibleCategories={visibleCategories}
        showHeadings={showHeadings}
      />
      <CheckoutBar onCheckout={onCheckout} products={products} />
    </>
  );
};
