import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

router.all('/:apiName', (req : Request, res : Response) => {
    res.send(req.params.apiName);
})

module.exports = router;