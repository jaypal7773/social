const isAdmin = (req , res , next) => {
    if(!req.user || req.user.role !== "ADMIN") {
        return res.status(401).json({error : "Admin access only"})
    }
    next();
}

module.exports = isAdmin