import express from 'express';
import IndexController from '../Controller/IndexController.mjs';

const router = express.Router();
router.get("/", async (req, res, next) => {
    await new IndexController(req, res).getLatestArticles();
});

router.post("/", async (req, res, next) => {
    await new IndexController(req, res).postNewArticle();
});

export {
    router
};