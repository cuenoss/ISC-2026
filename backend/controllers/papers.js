import Submission from '../models/Paper.js';

//we need a page to display papers?
export const get_papers = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .sort({ created_at: 'desc' });
    res.json(submissions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

export const get_papers_by_author = async (req, res) => {
  const { author_name } = req.params;
  try {
    const submissions = await Submission.find({ author_name })
      .sort({ created_at: 'desc' });
    res.json(submissions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch author submissions' });
  }
};

export const get_papers_by_email = async (req, res) => {
  const { email } = req.params;
  try {
    const submissions = await Submission.find({ email })
      .sort({ created_at: 'desc' });
    res.json(submissions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch email submissions' });
  }
};

export const submit_paper = async (req, res) => {
  try {
    const { author_name, email, paper_title, abstract, theme } = req.body;
    
    if (!author_name || !email || !paper_title || !abstract || !theme) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const submission = new Submission({
      author_name,
      email,
      paper_title,
      abstract,
      theme,
      status: 'pending'
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to submit paper' });
  }
};
