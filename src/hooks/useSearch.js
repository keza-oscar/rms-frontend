export const useSearch = () => {
  const searchOrders = (orders, query) => {
    if (!query.trim()) return orders;
    
    const q = query.toLowerCase();
    return orders.filter(order =>
      order.customer_name?.toLowerCase().includes(q) ||
      order.order_id?.toString().includes(q) ||
      order.table_id?.toString().includes(q)
    );
  };

  const searchCustomers = (customers, query) => {
    if (!query.trim()) return customers;
    
    const q = query.toLowerCase();
    return customers.filter(customer =>
      customer.first_name?.toLowerCase().includes(q) ||
      customer.last_name?.toLowerCase().includes(q) ||
      customer.phone?.includes(q) ||
      customer.email?.toLowerCase().includes(q)
    );
  };

  const searchMenu = (menu, query) => {
    if (!query.trim()) return menu;
    
    const q = query.toLowerCase();
    return menu.filter(item =>
      item.item_name?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  };

  const searchInventory = (inventory, query) => {
    if (!query.trim()) return inventory;
    
    const q = query.toLowerCase();
    return inventory.filter(item =>
      item.item_name?.toLowerCase().includes(q)
    );
  };

  return { searchOrders, searchCustomers, searchMenu, searchInventory };
};