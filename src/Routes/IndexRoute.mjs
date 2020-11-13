import express from 'express';
import IndexController from '../Controller/IndexController.mjs';

const router = express.Router();
router.get("/", (req, res, next) => {
    new IndexController(req, res).getLatestArticles();
});

export {
    router
};