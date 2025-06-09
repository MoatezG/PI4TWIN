const express = require('express');
const router = express.Router();
const {
  createDemander,
  getDemanders,
  getDemanderById,
  updateDemander,
  deleteDemander,
  getDemandersByUserId
} = require('../controllers/demanderController');

// Route definitions
router.post('/', createDemander);
router.get('/', getDemanders);
router.get('/user/:userId', getDemandersByUserId);
router.get('/:id', getDemanderById);
router.put('/:id', updateDemander);
router.delete('/:id', deleteDemander);

module.exports = router;