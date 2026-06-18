const authorize = (...roles) => {
    return (req, res, next) => {
        // चेक करें कि यूजर लॉगिश्ड इन है और उसका रोल अलाउड है या नहीं
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Role (${req.user?.role}) is not allowed to access this resource` 
            });
        }
        next();
    };
};

// सुनिश्चित करें कि एक्सपोर्ट इस तरह ऑब्जेक्ट के रूप में ही हो
module.exports = { authorize };