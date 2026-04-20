//i think we'll add this (anonymous feedback)?

export const submit_feedback = async (req, res) => {
    const { name, email, message } = req.body;
    try {
        
        res.json({ 
            message: 'Feedback submitted successfully',
            name,
            email,
            message
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
};
