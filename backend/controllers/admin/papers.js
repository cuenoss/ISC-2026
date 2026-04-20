import Submission from '../../models/Paper.js';

export const get_all_papers_admin = async (req, res) => {
  try {
    const papers = await Submission.find()
      .sort({ created_at: -1 });
    res.json(papers);
  } catch (error) {
    console.error('Get papers error:', error);
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
};

export const update_paper_status = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const paper = await Submission.findByIdAndUpdate(
      id,
      {
        status,
        updated_at: new Date()
      },
      { new: true }
    );
    
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    res.json(paper);
  } catch (error) {
    console.error('Update paper status error:', error);
    res.status(500).json({ error: 'Failed to update paper status' });
  }
};

export const get_papers_by_status = async (req, res) => {
  const { status } = req.params;
  try {
    const papers = await Submission.find({ status })
      .sort({ created_at: 'desc' });
    res.json(papers);
  } catch (error) {
    console.error('Get papers by status error:', error);
    res.status(500).json({ error: 'Failed to fetch papers by status' });
  }
};
