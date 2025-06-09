const Stock = require('../models/Stock');
const Product = require('../models/Product');
const Provider = require('../models/Provider');
const mongoose = require('mongoose');

class StockController {
  static async getProviderStock(req, res) {
    try {
      console.log(`Fetching stock for provider_id: ${req.params.providerId}`); // Debugging log

      const stock = await Stock.findOne({ provider_id: req.params.providerId })
        .populate('products.product_id', 'name category unit') // Ensure products are populated with relevant fields
        .populate('demander_id', 'businessName'); // Populate demander details if needed

      if (!stock) {
        console.log('No stock found for the provider'); // Debugging log
        return res.status(404).json({ error: 'Provider stock not found' });
      }

      console.log('Fetched stock:', stock); // Debugging log
      res.json(stock);
    } catch (error) {
      console.error('Error fetching provider stock:', error); // Debugging log
      res.status(500).json({ error: error.message });
    }
  }

  static async getDemanderStock(req, res) {
    try {
      console.log(`Fetching stock for demander_id: ${req.params.demanderId}`); // Debugging log

      const stock = await Stock.findOne({ demander_id: req.params.demanderId })
        .populate('products.product_id', 'name category unit') // Ensure products are populated with relevant fields
        .populate('provider_id', 'businessName'); // Populate provider details if needed

      if (!stock) {
        console.log('No stock found for the demander'); // Debugging log
        return res.status(404).json({ error: 'Demander stock not found' });
      }

      console.log('Fetched stock:', stock); // Debugging log
      res.json(stock);
    } catch (error) {
      console.error('Error fetching demander stock:', error); // Debugging log
      res.status(500).json({ error: error.message });
    }
  }

  static async fillStockFromProductList(req, res) {
    try {
      const { provider_id, products } = req.body;

      // Validate input
      if (!provider_id || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Invalid input: provider_id and products are required' });
      }

      for (const product of products) {
        if (!product.product_id) {
          return res.status(400).json({ error: 'Each product must have a product_id' });
        }
      }

      // Get or create provider stock
      let providerStock = await Stock.findOne({ provider_id });
      if (!providerStock) {
        providerStock = new Stock({ provider_id, products: [] });
      }

      // Process each product in the list
      for (const product of products) {
        const existingProduct = providerStock.products.find(p => 
          p.product_id.equals(product.product_id)
        );

        if (existingProduct) {
          existingProduct.quantity += product.quantity;
        } else {
          providerStock.products.push({
            product_id: product.product_id,
            quantity: product.quantity,
            unit: product.unit || 'unit'
          });
        }
      }

      await providerStock.save();

      // Populate product details for response
      const populatedStock = await Stock.findById(providerStock._id)
        .populate('products.product_id', 'name category unit');

      res.status(200).json(populatedStock);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async fillStockFromProvider(req, res) {
    try {
      const { demander_id, provider_id, products } = req.body;

      // Validate input
      if (!demander_id || !provider_id || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Invalid input: demander_id, provider_id, and products are required' });
      }

      for (const product of products) {
        if (!product.product_id || typeof product.quantity !== 'number' || product.quantity <= 0) {
          return res.status(400).json({ error: 'Each product must have a valid product_id and quantity' });
        }
      }

      // Get provider stock
      const providerStock = await Stock.findOne({ provider_id });
      if (!providerStock) {
        return res.status(404).json({ error: 'Provider stock not found' });
      }

      // Get or create demander stock
      let demanderStock = await Stock.findOne({ demander_id });
      if (!demanderStock) {
        demanderStock = new Stock({ demander_id, products: [] });
      }

      // Process each requested product
      for (const requestProduct of products) {
        const providerProduct = providerStock.products.find(p =>
          p.product_id.equals(requestProduct.product_id)
        );

        if (!providerProduct) {
          return res.status(404).json({ error: `Product ${requestProduct.product_id} not found in provider stock` });
        }

        if (providerProduct.quantity < requestProduct.quantity) {
          return res.status(400).json({ error: `Insufficient quantity for product ${requestProduct.product_id}` });
        }

        // Update provider stock
        providerProduct.quantity -= requestProduct.quantity;

        // Update demander stock
        const existingDemanderProduct = demanderStock.products.find(p =>
          p.product_id.equals(requestProduct.product_id)
        );

        if (existingDemanderProduct) {
          existingDemanderProduct.quantity += requestProduct.quantity;
        } else {
          demanderStock.products.push({
            product_id: requestProduct.product_id,
            quantity: requestProduct.quantity,
            unit: providerProduct.unit,
            source_provider: provider_id
          });
        }
      }

      await providerStock.save();
      await demanderStock.save();

      // Populate results for response
      const populatedProvider = await Stock.populate(providerStock, {
        path: 'products.product_id',
        select: 'name category unit'
      });

      const populatedDemander = await Stock.populate(demanderStock, {
        path: 'products.product_id',
        select: 'name category unit'
      });

      res.status(200).json({
        providerStock: populatedProvider,
        demanderStock: populatedDemander
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async checkStockExists(req, res) {
    try {
      const { userId } = req.params;
      const userRole = req.query.role; // 'Provider' or 'Demander'
      
      const stock = userRole === 'Provider'
        ? await Stock.findOne({ provider_id: userId })
        : await Stock.findOne({ demander_id: userId });
  
      res.json({ exists: !!stock });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async initializeProviderStock(req, res) {
    try {
      const { provider_id } = req.body;

      // Check if a stock entry already exists for the provider
      const existingStock = await Stock.findOne({ provider_id });
      if (existingStock) {
        return res.status(200).json({ message: 'Stock already exists', stock: existingStock });
      }

      // Initialize empty stock for the provider
      const stock = new Stock({
        provider_id,
        products: []
      });

      const savedStock = await stock.save();
      res.status(201).json({ message: 'Stock created successfully', stock: savedStock });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async initializeDemanderStock(req, res) {
    try {
      const { demander_id } = req.body;

      // Check if a stock entry already exists for the demander
      const existingStock = await Stock.findOne({ demander_id });
      if (existingStock) {
        return res.status(200).json({ message: 'Stock already exists', stock: existingStock });
      }

      // Initialize empty stock for the demander
      const stock = new Stock({
        demander_id,
        products: []
      });

      const savedStock = await stock.save();
      res.status(201).json({ message: 'Stock created successfully', stock: savedStock });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getOrCreateProviderStock(req, res) {
    try {
      const { provider_id } = req.body;

      // Check if a stock entry already exists for the provider
      let stock = await Stock.findOne({ provider_id });

      if (stock) {
        return res.status(200).json({ message: 'Stock already exists', stock });
      }

      // Create a new stock entry if none exists
      stock = new Stock({
        provider_id,
        products: []
      });
      await stock.save();

      res.status(201).json({ message: 'Stock created successfully', stock });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getOrCreateDemanderStock(req, res) {
    try {
      const { demander_id } = req.body;

      // Check if a stock entry already exists for the demander
      let stock = await Stock.findOne({ demander_id });

      if (stock) {
        return res.status(200).json({ message: 'Stock already exists', stock });
      }

      // Create a new stock entry if none exists
      stock = new Stock({
        demander_id,
        products: []
      });
      await stock.save();

      res.status(201).json({ message: 'Stock created successfully', stock });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProvidersByUserId(req, res) {
    try {
      const { userId } = req.params;
      const objectId = mongoose.Types.ObjectId(userId); // Convert to ObjectId
      const providers = await Provider.find({ user_id: objectId });

      if (!providers.length) {
        return res.status(404).json({ error: 'No providers found for this user' });
      }

      res.json(providers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = StockController;