import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate a PDF receipt for an order
 * @param {Object} order - The order object
 * @param {Array} items - The items in the order
 * @returns {jsPDF} - The generated PDF document
 */
export const generateOrderReceipt = (order, items) => {
  console.log('Generating PDF receipt with order:', order);
  console.log('Order items:', items);
  
  if (!order) {
    console.error('Cannot generate receipt: order is null or undefined');
    throw new Error('Order is required to generate a receipt');
  }
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    console.error('Cannot generate receipt: items array is invalid', items);
    throw new Error('Valid items array is required to generate a receipt');
  }
  
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Add title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Receipt', pageWidth / 2, 20, { align: 'center' });
    
    // Add order information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order ID: ${order._id || 'N/A'}`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 42);
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 49);
    doc.text(`Delivery Address: ${order.address || 'N/A'}`, 20, 56);
    
    // Add payment status
    const paymentStatus = order.isPaid ? 'Paid' : 'Pending';
    doc.setFont('helvetica', 'bold');
    doc.text(`Payment Status: ${paymentStatus}`, 20, 63);
    doc.setFont('helvetica', 'normal');
    
    // Add items table
    const tableColumn = ['Item', 'Qty', 'Price', 'Total'];
    const tableRows = items.map(item => {
      const name = item.name || (item.product ? item.product.name : 'Unknown Item');
      const quantity = item.quantity ? item.quantity.toString() : '1';
      const price = item.price_per_unit || item.price || 0;
      const total = (price * (parseInt(quantity) || 1)).toFixed(2);
      
      return [name, quantity, `$${price}`, `$${total}`];
    });
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 70,
      theme: 'striped',
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: 'center'
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });
    
    // Calculate final position after table
    const finalY = doc.lastAutoTable.finalY || 120;
    
    // Add total amount
    const total = items.reduce(
      (sum, item) => {
        const price = item.price_per_unit || item.price || 0;
        const quantity = item.quantity || 1;
        return sum + (price * quantity);
      }, 
      0
    ).toFixed(2);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: $${total}`, pageWidth - 20, finalY + 20, { align: 'right' });
    
    // Add thank you message
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('Thank you for your purchase!', pageWidth / 2, finalY + 35, { align: 'center' });
    
    // Add footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('SustainaFood © ' + new Date().getFullYear(), pageWidth / 2, finalY + 45, { align: 'center' });
    
    console.log('PDF document generated successfully');
    return doc;
  } catch (error) {
    console.error('Error generating PDF document:', error);
    throw new Error('Failed to generate PDF receipt: ' + error.message);
  }
};

/**
 * Open the PDF receipt in a new window
 * @param {Object} order - The order object
 * @param {Array} items - The items in the order
 */
export const openOrderReceipt = (order, items) => {
  try {
    console.log('Opening PDF receipt in new window');
    const doc = generateOrderReceipt(order, items);
    const orderIdForFilename = order._id ? order._id.substring(0, 6) : 'receipt';
    doc.output('dataurlnewwindow', { filename: `order-${orderIdForFilename}.pdf` });
    console.log('PDF opened successfully in new window');
    return true;
  } catch (error) {
    console.error('Error opening PDF receipt:', error);
    throw error;
  }
};

/**
 * Save the PDF receipt to a file
 * @param {Object} order - The order object
 * @param {Array} items - The items in the order
 */
export const saveOrderReceipt = (order, items) => {
  try {
    console.log('Saving PDF receipt to file');
    const doc = generateOrderReceipt(order, items);
    const orderIdForFilename = order._id ? order._id.substring(0, 6) : 'receipt';
    doc.save(`order-${orderIdForFilename}.pdf`);
    console.log('PDF saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving PDF receipt:', error);
    throw error;
  }
};

/**
 * Print the PDF receipt
 * @param {Object} order - The order object
 * @param {Array} items - The items in the order
 */
export const printOrderReceipt = (order, items) => {
  try {
    console.log('Printing PDF receipt');
    const doc = generateOrderReceipt(order, items);
    doc.autoPrint();
    doc.output('dataurlnewwindow');
    console.log('PDF print dialog opened successfully');
    return true;
  } catch (error) {
    console.error('Error printing PDF receipt:', error);
    throw error;
  }
}; 