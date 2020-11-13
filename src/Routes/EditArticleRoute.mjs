import express from 'express';
import EditArticleController from '../Controller/EditArticleController.mjs';

const router = express.Router();
router.get("/:id?", async (req, res, next) => {
    await new EditArticleController(req, res).getEditArticle();
});

router.post("/:id?", async (req, res, next) => {
    await new EditArticleController(req, res).postNewArticle();
});

export {
    router
};