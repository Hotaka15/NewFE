import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import { getOrderStatus } from "../lib/helpers";

const recentOrderData = [
  {
    id: "1",
    product_id: "4324",
    customer_id: "23143",
    customer_name: "Shirley A. Lape",
    order_date: "2022-05-17T03:24:00",
    order_total: "$435.50",
    current_order_status: "PLACED",
    shipment_address: "Cottage Grove, OR 97424",
  },
  {
    id: "7",
    product_id: "7453",
    customer_id: "96453",
    customer_name: "Ryan Carroll",
    order_date: "2022-05-14T05:24:00",
    order_total: "$96.35",
    current_order_status: "CONFIRMED",
    shipment_address: "Los Angeles, CA 90017",
  },
  {
    id: "2",
    product_id: "5434",
    customer_id: "65345",
    customer_name: "Mason Nash",
    order_date: "2022-05-17T07:14:00",
    order_total: "$836.44",
    current_order_status: "SHIPPED",
    shipment_address: "Westminster, CA 92683",
  },
  {
    id: "3",
    product_id: "9854",
    customer_id: "87832",
    customer_name: "Luke Parkin",
    order_date: "2022-05-16T12:40:00",
    order_total: "$334.50",
    current_order_status: "SHIPPED",
    shipment_address: "San Mateo, CA 94403",
  },
  {
    id: "4",
    product_id: "8763",
    customer_id: "09832",
    customer_name: "Anthony Fry",
    order_date: "2022-05-14T03:24:00",
    order_total: "$876.00",
    current_order_status: "OUT_FOR_DELIVERY",
    shipment_address: "San Mateo, CA 94403",
  },
  {
    id: "5",
    product_id: "5627",
    customer_id: "97632",
    customer_name: "Ryan Carroll",
    order_date: "2022-05-14T05:24:00",
    order_total: "$96.35",
    current_order_status: "DELIVERED",
    shipment_address: "Los Angeles, CA 90017",
  },
];

export default function RecentRp() {
  const { t } = useTranslation();
  return (
    <div className="bg-ascent-3/10 px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1">
      <strong className="text-ascent-1 font-medium">Recent Report</strong>
      <div className="border-x border-gray-200 rounded-sm mt-3">
        <table className="w-full text-ascent-1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product ID</th>
              <th>Customer Name</th>
              <th>Report Date</th>
              <th>Report Total</th>
              <th>Shipping Address</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrderData.map((order) => (
              <tr key={order.id}>
                <td className="text-center">
                  <Link to={``}>#{order.id}</Link>
                </td>
                <td className="text-center">
                  <Link to={``}>#{order.product_id}</Link>
                </td>
                <td className="text-center">
                  <Link to={``}>{order.customer_name}</Link>
                </td>
                <td className="text-center">
                  {format(new Date(order.order_date), "dd MMM yyyy")}
                </td>
                <td className="text-center">{order.order_total}</td>
                <td className="text-center">{order.shipment_address}</td>
                <td className="select-none flex justify-center gap-2">
                  <div
                    onClick={() => {}}
                    className="px-3 rounded-lg py-1 bg-blue cursor-pointer text-white"
                  >
                    Hold
                  </div>
                  <div
                    onClick={() => {}}
                    className="px-3 rounded-lg py-1 bg-[#ff0015b2] cursor-pointer text-white"
                  >
                    Delete
                  </div>
                </td>
                {/* <td>{getOrderStatus(order.current_order_status)}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
