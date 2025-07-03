const express = require('express');
const router = express.Router();
const { createWorkspace, getUserWorkspaces } = require('../controllers/workspaceController');

router.post('/', createWorkspace);
router.get('/', getUserWorkspaces);

module.exports = router;
