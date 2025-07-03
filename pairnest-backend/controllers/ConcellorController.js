const Workspace = require('../models/Workspace');

exports.createWorkspace = async (req, res) => {
  try {
    const { name, createdBy, teamMembers } = req.body;
    const workspace = await Workspace.create({ name, createdBy, teamMembers });
    res.status(201).json(workspace);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create workspace' });
  }
};

exports.getUserWorkspaces = async (req, res) => {
  try {
    const { userId } = req.query;
    const workspaces = await Workspace.find({
      $or: [{ createdBy: userId }, { teamMembers: userId }]
    });
    res.status(200).json(workspaces);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workspaces' });
  }
};
