const prisma = require('../prismaClient')


const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await prisma.post.create({
            data: { title, content, authorId: req.user.id },
            include: { author: { select: { id: true, email: true, name: true } } }
        });
        res.json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "server error" })
    }
}

const getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { id: true, name: true, email: true } },
                comments: { where: { parentId: null }, include: { replies: true } },
                likes: true
            }
        })
        res.json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server Error" })
    }
}

const getPost = async (req, res) => {
    const id = Number(req.params.id)
    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: true,
                comments: { include: { author: true, replies: { include: { author: true } } } },
                likes: true
            }
        });
        if (!post) return res.status(404).json({ error: "Not Found" });
        res.json(post);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Server error" })
    }
}

const updatePost = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ error: "not found" })
        if (post.authorId !== req.user.id) return res.status(404).json({ error: "error" })

        const { title, content } = req.body;
        const updated = await prisma.post.update({
            where: { id },
            data: { title, content }
        })
        res.json(updated);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Server error" })
    }
}

// const deletePost = async (req, res) => {
//     const id = parseInt(req.params.id , 10);
//     if(isNaN(id)){
//         return res.status(400).json({error : "Invalid post id"})
//     }
//     try {
//         const post = await prisma.post.findUnique({
//       where: { id }
//     });
//         if (!post) return res.status(404).json({ error: "post Not found" })
//         if (post.authorId !== post.user.id) return res.status(404).json({ error: "Not authorized" })

//         await prisma.post.delete({ where: { id } });
//         res.json({ success: true })
//             console.log("Delete post", post)
//     } 
//     catch (err){
//         console.log(err)
//         res.status(500).json({error : "Server error"})
//     }
// }

const deletePost = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid post id" });
  }

  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Now req.user.id is set by authMiddleware
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.post.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { createPost, getPosts, getPost, updatePost, deletePost}